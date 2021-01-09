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

import pagesLocale from 'locale/pages';
import { CREATIVE_COMMONS_LICENCES, getCreativeCommonsUrl } from 'config/general';
const txt = pagesLocale.pages.journal.view;

export const renderBoolean = isTrue => (isTrue ? txt.booleanTrue : txt.booleanFalse);
export const renderDateTime = (dateTimeString, format) =>
    moment(dateTimeString).isValid && moment(dateTimeString).format(format);
export const renderExtLink = (key, href, title, text) => <ExternalLink {...{ key, href, title }}>{text}</ExternalLink>;

export const getLicenceAttrs = ({ by, nd, nc, sa }) => {
    const conditions = [];
    by && conditions.push('by');
    nd && conditions.push('nd');
    nc && conditions.push('nc');
    sa && conditions.push('sa');
    const licence = conditions.join('-');
    return [`cc-${licence}`, getCreativeCommonsUrl(licence), CREATIVE_COMMONS_LICENCES[licence]];
};

export const renderLicence = (className, url, text) => (
    <ExternalLink href={url} id="journal-oa-licence" data-testid="journal-oa-licence">
        <div data-testid="journal-oa-licence-lookup" style={{ paddingRight: '1rem' }}>
            {text}
        </div>
        <div className={`fez-icon license ${className}`} />
    </ExternalLink>
);

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
                {detail.data}
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
                    {indexDetails && (
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
