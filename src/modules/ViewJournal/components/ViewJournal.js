import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useHref } from 'react-router-dom';

import Grid from '@mui/material/GridLegacy';
import Box from '@mui/material/Box';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import WorkNotFound from 'modules/NotFound/components/WorkNotFound';

import * as actions from 'actions';

import { JournalContext } from 'context';
import Section from './Section';
import { parseHtmlToJSX, tryCatch } from 'helpers/general';

import { userIsAdmin } from 'hooks';
import { default as globalLocale } from 'locale/global';
import { default as pagesLocale } from 'locale/pages';
import { default as viewJournalLocale } from 'locale/viewJournal';
import { viewJournalConfig } from 'config/viewJournal';

import TitleWithFavouriteButton from './partials/TitleWithFavouriteButton';
import { getIndicatorProps, status, types } from '../../SharedComponents/JournalsList/components/partials/utils';
import moment from 'moment';
import { buildJournalSearchQueryParams, getKeywordKey } from '../../SearchJournals/hooks';
import { pathConfig } from '../../../config';
import param from 'can-param';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

export const getAdvisoryStatement = html => {
    return !!html ? parseHtmlToJSX(html) : '';
};

/**
 * @param {object} data
 * @return {boolean}
 */
const isEmbargoDateMoreThanOnYearAway = data => {
    const units = data?.fez_journal_issn?.[0]?.fez_sherpa_romeo?.srm_max_embargo_units;
    const amount = Number(data?.fez_journal_issn?.[0]?.fez_sherpa_romeo?.srm_max_embargo_amount);
    /* istanbul ignore next */
    if (!['days', 'weeks', 'months', 'years'].includes(units) || !Number.isFinite(amount)) return false;

    const now = moment().utc();
    const embargoDate = tryCatch(() => now.clone().add(amount, units), now.clone());
    return embargoDate.isSameOrAfter(now.add(12, 'months'));
};

/**
 * @param {object} location
 * @param {object} data
 * @return {boolean}
 */
const shouldShowPublishAsOAButton = (location, data) =>
    tryCatch(() => {
        const qsParams = Object.fromEntries(new URLSearchParams(location?.search));
        if (qsParams?.fromSearch !== 'true') return false;

        const publishedStatus = getIndicatorProps({ type: types.published, data });
        const acceptedStatus = getIndicatorProps({ type: types.accepted, data });
        return (
            publishedStatus?.status === status.fee &&
            (acceptedStatus?.status !== status.embargo || isEmbargoDateMoreThanOnYearAway(data))
        );
    }, false);

/**
 * Note: lowest is greatest
 * @param data
 * @return {number}
 */
const extractHighestQuartile = (data, prop) =>
    Math.min(
        ...(data?.map?.(item =>
            parseInt(String(item[prop]).toLowerCase().replace('q', ''), 10),
        ) || /* istanbul ignore next */ [0]),
    );

/**
 * @param data
 * @param id
 * @param text
 * @return [{object}]
 */
const extractSubjects = (data, id, text) =>
    data?.reduce?.((keywords, data) => {
        const keyword = {
            cvoId: data[id],
            text: data[text],
            type: 'Subject',
        };
        keyword.id = getKeywordKey(keyword);
        return { ...keywords, [keyword.id]: keyword };
    }, {}) || /* istanbul ignore next */ {};

export const publishAsOASearchFacetDefaults = {
    'Open access: accepted version': [
        '12 month embargo via repository',
        '6 month embargo via repository',
        '3 month embargo via repository',
        'Immediate access via repository',
    ],
    'Open access: published version': ['No fees or fees are prepaid', 'Fees are prepaid (until capped amount reached)'],
};

/**
 * @param data
 * @return {object}
 */
const buildPublishAsOASearch = data =>
    tryCatch(() => {
        const scopusData = data?.fez_journal_cite_score?.fez_journal_cite_score_asjc_code;
        const wosData = data?.fez_journal_jcr_scie?.fez_journal_jcr_scie_category;
        const facets = {
            ...publishAsOASearchFacetDefaults,
        };

        const highestQuartile = Math.min(
            extractHighestQuartile(scopusData, 'jnl_cite_score_asjc_code_quartile'),
            extractHighestQuartile(wosData, 'jnl_jcr_scie_category_quartile'),
        );
        /* istanbul ignore else */
        if (highestQuartile > 0) {
            facets['Highest quartile'] = [highestQuartile];
        }

        const scopusSubjects = extractSubjects(
            scopusData,
            'jnl_cite_score_asjc_code',
            'jnl_cite_score_asjc_code_lookup',
        );
        const wosSubjects = extractSubjects(
            wosData,
            'jnl_jcr_scie_category_description',
            'jnl_jcr_scie_category_description_lookup',
        );

        return buildJournalSearchQueryParams({ keywords: { ...scopusSubjects, ...wosSubjects } }, facets);
    }, {});

/**
 * @param {string} url
 * @param {object} params
 * @return {WindowProxy}
 */
const openPublishAsOASearch = (url, params) => window.open(`${url}?${param(params)}`, '_blank', 'noopener,noreferrer');

export const ViewJournal = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const location = useLocation();
    const isAdmin = userIsAdmin();
    const txt = pagesLocale.pages.journal.view;
    const viewJournalTxt = viewJournalLocale.viewJournal;
    // account for HashRouter usage
    const searchUrl = useHref(pathConfig.journals.search);

    const journalLoading = useSelector(state => state.get('viewJournalReducer').loadingJournalToView);
    const journalDetails = useSelector(state => state.get('viewJournalReducer').journalToView);
    const journalLoadingError = useSelector(state => state.get('viewJournalReducer').journalToViewError);
    const [favouriteUpdateError, setUpdateFavouriteError] = React.useState(false);
    const alertProps = favouriteUpdateError && {
        ...txt.errorAlert,
        message: txt.errorAlert.message(globalLocale.global.errorMessages.generic),
    };

    const journalDetailsLength = (!!journalDetails && Object.keys(journalDetails)?.length) || 0;

    React.useEffect(() => {
        !!id && journalDetailsLength === 0 && dispatch(actions.loadJournal(id));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, journalDetailsLength]);

    if (journalLoading) {
        return <InlineLoader message={txt.loadingMessage} loaderId="journal-loading" />;
    }

    if (journalLoadingError) {
        if (journalLoadingError.status === 404) {
            return (
                <WorkNotFound
                    title={viewJournalTxt.notFound.title}
                    message={viewJournalTxt.notFound.message}
                    loadingError={journalLoadingError}
                />
            );
        } else {
            return (
                <StandardPage>
                    <Alert {...txt.loadFailureAlert} />
                </StandardPage>
            );
        }
    }

    if (journalDetailsLength === 0) {
        return <StandardPage />;
    }

    const capped = journalDetails.fez_journal_read_and_publish?.jnl_read_and_publish_is_capped.toLowerCase();
    const showPublishAsOAButton = shouldShowPublishAsOAButton(location, journalDetails);
    return (
        <StandardPage
            standarPageId="journal-view"
            title={
                <>
                    <TitleWithFavouriteButton
                        journal={journalDetails}
                        actions={{
                            addFavourite: actions.addToFavourites,
                            removeFavourite: actions.removeFromFavourites,
                        }}
                        handlers={{ errorUpdatingFavourite: setUpdateFavouriteError }}
                        tooltips={{
                            favourite: txt.favouriteTooltip.isFavourite,
                            notFavourite: txt.favouriteTooltip.isNotFavourite,
                        }}
                        showAdminActions={isAdmin}
                        sx={{ display: 'flex' }}
                    />
                    {showPublishAsOAButton && (
                        <Tooltip title={txt.publishAsOAButton.tooltip}>
                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                data-testid="publish-as-oa-button"
                                onClick={() => openPublishAsOASearch(searchUrl, buildPublishAsOASearch(journalDetails))}
                            >
                                {txt.publishAsOAButton.text}
                                <OpenInNew fontSize="small" sx={{ ml: 1 }} />
                            </Button>
                        </Tooltip>
                    )}
                </>
            }
        >
            <JournalContext.Provider
                value={{
                    journalDetails,
                }}
            >
                <Grid container spacing={3}>
                    {favouriteUpdateError && (
                        <Grid item xs={12}>
                            <Alert
                                pushToTop
                                {...alertProps}
                                allowDismiss
                                dismissAction={() => setUpdateFavouriteError(false)}
                            />
                        </Grid>
                    )}
                    {Object.keys(journalDetails).length > 0 && journalDetails.jnl_advisory_statement && (
                        <Grid item xs={12}>
                            <Alert
                                type={
                                    journalDetails?.jnl_advisory_statement_type_lookup?.trim?.().toLowerCase() || 'info'
                                }
                                title={txt.advisoryStatement.title}
                                message={
                                    <Box sx={{ wordWrap: { xs: 'break-word', sm: 'normal' } }}>
                                        {getAdvisoryStatement(journalDetails.jnl_advisory_statement)}
                                    </Box>
                                }
                            />
                        </Grid>
                    )}
                    {(capped === 'approaching' || capped === 'exceeded') && (
                        <Grid item xs={12}>
                            <Alert
                                type={'warning'}
                                title={viewJournalTxt.readAndPublish.alert.title}
                                message={
                                    <Box sx={{ wordWrap: { xs: 'break-word', sm: 'normal' } }}>
                                        {(capped === 'approaching' &&
                                            viewJournalTxt.readAndPublish.alert.approaching) ||
                                            (capped === 'exceeded' && viewJournalTxt.readAndPublish.alert.exceeded)}
                                    </Box>
                                }
                            />
                        </Grid>
                    )}
                    {capped === 'nodeal' && (
                        <Grid item xs={12}>
                            <Alert
                                type={'info'}
                                title={viewJournalTxt.readAndPublish.alert.title}
                                message={
                                    <Box sx={{ wordWrap: { xs: 'break-word', sm: 'normal' } }}>
                                        {viewJournalTxt.readAndPublish.alert.nodeal}
                                    </Box>
                                }
                            />
                        </Grid>
                    )}
                    {Object.entries(viewJournalConfig)
                        // eslint-disable-next-line no-unused-vars
                        .filter(([_, sectionConfig]) => {
                            if (!!sectionConfig.key) {
                                return Array.isArray(sectionConfig.key)
                                    ? sectionConfig.key.some(key =>
                                          Array.isArray(journalDetails[key])
                                              ? journalDetails[key].length > 0
                                              : !!journalDetails[key],
                                      )
                                    : /* istanbul ignore next */ !!journalDetails[sectionConfig.key];
                            }
                            return true;
                        })
                        .map(([sectionKey, sectionConfig]) => (
                            <Section
                                key={`section-${sectionKey}`}
                                sectionKey={sectionKey}
                                sectionConfig={sectionConfig}
                            />
                        ))}
                </Grid>
            </JournalContext.Provider>
        </StandardPage>
    );
};

ViewJournal.propTypes = {};

export default React.memo(ViewJournal);
