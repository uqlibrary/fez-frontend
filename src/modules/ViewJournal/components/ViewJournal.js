import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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
import Button from '@mui/material/Button';
import { getIndicatorProps, status, types } from '../../SharedComponents/JournalsList/components/partials/utils';
import moment from 'moment';
import { pathConfig } from '../../../config';

export const getAdvisoryStatement = html => {
    return !!html ? parseHtmlToJSX(html) : '';
};

/**
 * @param {object} data
 * @return {boolean}
 */
export const isEmbargoDateMoreThanOnYearAway = data => {
    const units = data?.fez_journal_issn?.[0]?.fez_sherpa_romeo?.srm_max_embargo_units;
    const amount = Number(data?.fez_journal_issn?.[0]?.fez_sherpa_romeo?.srm_max_embargo_amount);
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
export const shouldShowPublishAsOAButton = (location, data) => {
    const qsParams = Object.fromEntries(new URLSearchParams(location?.search));
    if (qsParams?.fromSearch !== 'true') return false;

    const publishedStatus = getIndicatorProps({ type: types.published, data });
    const acceptedStatus = getIndicatorProps({ type: types.accepted, data });
    return (
        publishedStatus.status === status.fee &&
        (acceptedStatus.status !== status.embargo || isEmbargoDateMoreThanOnYearAway(data))
    );
};

/**
 * @param navigate
 * @param {number} id
 */
const openPublishAsOASearchResult = (navigate, id) => {
    console.log(`/journals/search/${id}`);
    // TODO fix link
    navigate(pathConfig.journals.search);
};

export const ViewJournal = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const isAdmin = userIsAdmin();
    const location = useLocation();
    const navigate = useNavigate();
    const txt = pagesLocale.pages.journal.view;
    const viewJournalTxt = viewJournalLocale.viewJournal;

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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => openPublishAsOASearchResult(navigate, journalDetails.jni_id)}
                            title={'Avoid fees and meet mandates by viewing similar journals with open access.'}
                        >
                            I would like to publish open access
                        </Button>
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
                    {journalDetails.fez_journal_read_and_publish &&
                        (journalDetails.fez_journal_read_and_publish.jnl_read_and_publish_is_capped === 'Approaching' ||
                            journalDetails.fez_journal_read_and_publish.jnl_read_and_publish_is_capped ===
                                'Exceeded') && (
                            <Grid item xs={12}>
                                <Alert
                                    type={'warning'}
                                    title={viewJournalTxt.readAndPublish.alert.title}
                                    message={
                                        <Box sx={{ wordWrap: { xs: 'break-word', sm: 'normal' } }}>
                                            {(journalDetails.fez_journal_read_and_publish
                                                .jnl_read_and_publish_is_capped === 'Approaching' &&
                                                viewJournalTxt.readAndPublish.alert.approaching) ||
                                                (journalDetails.fez_journal_read_and_publish
                                                    .jnl_read_and_publish_is_capped === 'Exceeded' &&
                                                    viewJournalTxt.readAndPublish.alert.exceeded)}
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
                                    : !!journalDetails[sectionConfig.key];
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
