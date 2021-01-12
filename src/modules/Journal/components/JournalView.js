import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { hasContent as tabbedCardHasContent } from 'modules/SharedComponents/Toolbox/TabbedCard/components/TabbedCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { TabbedCard } from 'modules/SharedComponents/Toolbox/TabbedCard';

import { default as CreativeCommonsLicence } from './partials/CreativeCommonsLicence';
import { default as WosCategories } from './partials/WosCategories';

import { default as globalLocale } from 'locale/global';
import pagesLocale from 'locale/pages';
import EraForCodes from './partials/EraForCodes';
const txt = pagesLocale.pages.journal.view;

export const nodeJoin = (arr, glue) =>
    arr
        .slice(1)
        .reduce((op, item) => op.concat([glue, item]), [arr[0]])
        .filter(Boolean);

export const renderBoolean = isTrue => (isTrue ? txt.booleanTrue : txt.booleanFalse);

export const renderDateTime = (dateTimeString, format) =>
    moment(dateTimeString).isValid && moment(dateTimeString).format(format);

export const renderBooleanWithDate = (status, date, format) =>
    `${renderBoolean(status)}${(status && `, ${renderDateTime(date, format)}`) || ''}`;

export const renderExtLink = (key, href, title, text) => <ExternalLink {...{ key, href, title }}>{text}</ExternalLink>;

export const renderData = detail => {
    switch (detail.id) {
        case txt.entries.licence.id:
            return <CreativeCommonsLicence {...detail.data} />;

        case txt.entries.urlRefereed.id:
        case txt.entries.doajSeal.id:
        case txt.entries.citeScoreAsjcCodeTop10Pct.id:
        case txt.entries.hasScopus.id:
        case txt.entries.hasPubmed.id:
        case txt.entries.hasEra.id:
        case txt.entries.ulrOpenAccess.id:
            return renderBoolean(detail.data);

        case txt.entries.doajLastUpdated.id:
            return renderDateTime(detail.data, 'Do MMMM YYYY [at] h:mma');
        case txt.entries.jcrSourceDate.id:
        case txt.entries.citeScoreSourceDate.id:
            return renderDateTime(detail.data, 'YYYY');
        case txt.entries.adbcSourceDate.id:
            return renderDateTime(detail.data, 'Do MMMM YYYY');

        case txt.entries.cwtsSourceDate.id:
            return renderBooleanWithDate(detail.data.status, detail.data.date, 'YYYY');
        case txt.entries.natureIndexSourceDate.id:
            return renderBooleanWithDate(detail.data.status, detail.data.date, 'Do MMMM YYYY');

        case txt.entries.ulrOpenAccessUrl.id:
            return renderExtLink(null, detail.data, txt.links.ulrOpenAccessUrl.title, detail.data);
        case txt.entries.doajHomepageUrl.id:
            return renderExtLink(null, detail.data, txt.links.doajHomepageUrl.title, detail.data);

        case txt.links.jcrHomePage.id:
        case txt.links.citeScoreMoreInfo.id:
            return renderExtLink(null, detail.data.href, detail.data.title, detail.data.text);

        case txt.links.doajJournalUrl.id:
            return renderExtLink(
                null,
                `${txt.links.doajJournalUrl.linkPrefix}${detail.data}`,
                txt.links.doajJournalUrl.title,
                detail.data,
            );

        case txt.links.jcrMoreInfo.id:
            return renderExtLink(
                null,
                `${txt.links.jcrMoreInfo.linkPrefix}${detail.data}/`,
                txt.links.jcrMoreInfo.title,
                `${txt.links.jcrMoreInfo.textPrefix} ${detail.data.toUpperCase()}`,
            );

        case txt.links.citeScoreSource.id:
            return renderExtLink(
                null,
                `${txt.links.citeScoreSource.linkPrefix}${detail.data}`,
                txt.links.citeScoreSource.title,
                txt.links.citeScoreSource.text,
            );

        case txt.entries.ulrTitleLink.id:
            return nodeJoin(
                detail.data.map((ulrichs, index) =>
                    renderExtLink(
                        `journal-ulrichs-${index}-link`,
                        globalLocale.global.ulrichsLink.externalUrl.replace('[id]', ulrichs.ulr_title_id),
                        txt.links.ulrTitleLink.title,
                        ulrichs.ulr_title,
                    ),
                ),
                ', ',
            );

        case txt.entries.srmJournalLink.id:
            return nodeJoin(
                detail.data.map((sherpa, index) =>
                    renderExtLink(
                        `journal-sherpa-${index}-link`,
                        sherpa.srm_journal_link,
                        txt.links.srmJournalLink.title,
                        sherpa.srm_issn,
                    ),
                ),
            );

        case txt.entries.wosCategoryAhci.id:
        case txt.entries.wosCategoryScie.id:
        case txt.entries.wosCategorySsci.id:
        case txt.entries.wosCategoryEsci.id:
            return <WosCategories categoryData={detail.data} />;

        case txt.entries.eraForCode.id:
            return (!!Array.isArray(detail.data) && <EraForCodes forCodes={detail.data} />) || '';

        default:
            return detail.data;
    }
};

/**
 * Common renderer for a row of data. It may be a single piece of data, or an array of multiple pieces of data.
 *
 * @param {Object} detail Title and data to render. Data can be a string, a JSX node, or an array of JSX nodes.
 * @param {String} index Slug for creating test IDs
 * @param {Object} breakpoints Indicates Grid breakpoints for title and data
 */
export const renderJournalDetail = (detail, index, breakpoints) =>
    detail.data &&
    (!Array.isArray(detail.data) || detail.data.length > 0) && (
        <Grid container spacing={2} alignItems="flex-start" key={index}>
            {detail.title && (
                <Grid item component="span" {...breakpoints.title} data-testid={`${index}-label`} id={`${index}-label`}>
                    <Typography component="span" variant="subtitle2">
                        {detail.title}
                    </Typography>
                </Grid>
            )}
            <Grid item component="span" {...breakpoints.data} data-testid={`${index}`} id={`${index}`}>
                {renderData(detail)}
            </Grid>
        </Grid>
    );

const renderSingleColumn = (detailColumn, index, id) =>
    renderJournalDetail(detailColumn, `${id}-${detailColumn.id || `field${index}`}`, {
        title: { xs: 12, sm: 6, md: 3 },
        data: { xs: 'auto' },
    });

export const renderMultiColumn = (detailRow, index, id) => {
    const nonEmptyColumns = detailRow.filter(
        detail => detail.data && (!Array.isArray(detail.data) || detail.data.length > 0),
    );

    switch (nonEmptyColumns.length) {
        case 0:
            return '';
        case 1:
            return renderSingleColumn(nonEmptyColumns[0], index, id);
        default:
            return (
                <Grid container spacing={2} alignItems="flex-start" key={`${id}-row${index}-grid`}>
                    {nonEmptyColumns.map((detailColumn, subIndex) => (
                        <Grid item xs={12} sm key={`${id}-row${index}-column${subIndex}-grid`}>
                            {renderJournalDetail(
                                detailColumn,
                                `${id}-${detailColumn.id || `row${index}-column${subIndex}`}`,
                                {
                                    title: { xs: 12, sm: 6 },
                                    data: { xs: 'auto' },
                                },
                            )}
                        </Grid>
                    ))}
                </Grid>
            );
    }
};

/**
 * Renderer for a card's content area.
 *
 * @param {Array} details Data to render. Each entry holds data for a row.
 * @param {String} id Slug prefix for test ID
 */
export const renderSectionContents = (details, id) =>
    details &&
    details.map((detailRow, index) =>
        Array.isArray(detailRow) ? renderMultiColumn(detailRow, index, id) : renderSingleColumn(detailRow, index, id),
    );

const sectionHasDataArray = sectionDetails =>
    sectionDetails.some(item => !!item.data && Array.isArray(item.data) && item.data.length > 0);

export const JournalView = ({
    actions,
    basicDetails,
    citeScoreDetails,
    indexDetails,
    journalDetailsLoaded,
    journalLoading,
    journalLoadingError,
    journalTitle,
    jscieDetails,
    jssciDetails,
    listedDetails,
    match,
    oaDetails,
}) => {
    React.useEffect(() => {
        !journalDetailsLoaded && !journalLoading && !journalLoadingError && actions.loadJournal(match.params.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (journalLoadingError) {
        return <Alert alertId="journal-load-failure-alert" {...txt.loadFailureAlert} />;
    } else if (journalLoading || !journalDetailsLoaded) {
        return <InlineLoader message={txt.loadingMessage} loaderId="journal-loading" />;
    } else {
        return (
            <StandardPage standardPageId={txt.pageId} title={journalTitle}>
                <Grid container spacing={2}>
                    {basicDetails && (
                        <Grid item xs={12}>
                            <StandardCard standardCardId={txt.entries.basicSection.id} noHeader>
                                {renderSectionContents(basicDetails, txt.entries.basicSection.id)}
                            </StandardCard>
                        </Grid>
                    )}
                    {oaDetails && (
                        <Grid item xs={12}>
                            <StandardCard standardCardId={txt.entries.oaSection.id} title={txt.entries.oaSection.title}>
                                {renderSectionContents(oaDetails, txt.entries.oaSection.id)}
                            </StandardCard>
                        </Grid>
                    )}
                    {jscieDetails && tabbedCardHasContent(jscieDetails.common, jscieDetails.tabs) && (
                        <Grid item xs={12}>
                            <TabbedCard
                                cardId={txt.entries.scieSection.id}
                                cardTitle={txt.entries.scieSection.title}
                                {...jscieDetails}
                                contentRenderer={renderSectionContents}
                            />
                        </Grid>
                    )}
                    {jssciDetails && tabbedCardHasContent(jssciDetails.common, jssciDetails.tabs) && (
                        <Grid item xs={12}>
                            <TabbedCard
                                cardId={txt.entries.ssciSection.id}
                                cardTitle={txt.entries.ssciSection.title}
                                {...jssciDetails}
                                contentRenderer={renderSectionContents}
                            />
                        </Grid>
                    )}
                    {citeScoreDetails && tabbedCardHasContent(citeScoreDetails.common, citeScoreDetails.tabs) && (
                        <Grid item xs={12}>
                            <TabbedCard
                                cardId={txt.entries.citeScoreSection.id}
                                cardTitle={txt.entries.citeScoreSection.title}
                                {...citeScoreDetails}
                                contentRenderer={renderSectionContents}
                            />
                        </Grid>
                    )}
                    {indexDetails && sectionHasDataArray(indexDetails) && (
                        <Grid item xs={12}>
                            <StandardCard
                                standardCardId={txt.entries.indexSection.id}
                                title={txt.entries.indexSection.title}
                            >
                                {renderSectionContents(indexDetails, txt.entries.indexSection.id)}
                            </StandardCard>
                        </Grid>
                    )}
                    {listedDetails && (
                        <Grid item xs={12}>
                            <StandardCard
                                standardCardId={txt.entries.listedSection.title}
                                title={txt.entries.listedSection.title}
                            >
                                {renderSectionContents(listedDetails, txt.entries.listedSection.id)}
                            </StandardCard>
                        </Grid>
                    )}
                </Grid>
            </StandardPage>
        );
    }
};

JournalView.propTypes = {
    actions: PropTypes.object,
    basicDetails: PropTypes.array,
    citeScoreDetails: PropTypes.object,
    indexDetails: PropTypes.array,
    journalDetailsLoaded: PropTypes.bool,
    journalLoading: PropTypes.bool,
    journalLoadingError: PropTypes.bool,
    journalTitle: PropTypes.string,
    jscieDetails: PropTypes.object,
    jssciDetails: PropTypes.object,
    listedDetails: PropTypes.array,
    match: PropTypes.object,
    oaDetails: PropTypes.array,
};

export default JournalView;
