import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { TabbedCard } from 'modules/SharedComponents/Toolbox/TabbedCard';

import pagesLocale from 'locale/pages';

const renderJournalDetail = (detail, index, sizes) =>
    detail.data &&
    (!Array.isArray(detail.data) || detail.data.length > 0) && (
        <Grid container spacing={2} alignItems="flex-start" key={index}>
            {detail.title && (
                <Grid item component="span" {...sizes.title} data-testid={`${index}-label`}>
                    <Typography component="span" variant="body2">
                        {detail.title}
                        {': '}
                    </Typography>
                </Grid>
            )}
            <Grid item component="span" {...sizes.data} data-testid={`${index}`}>
                {detail.data}
            </Grid>
        </Grid>
    );

const titleToId = (title = '') =>
    title
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase()
        .replace(/ /g, '-');

export const renderSectionContents = (details, id) =>
    details.map((detailRow, index) => {
        if (Array.isArray(detailRow)) {
            return (
                <Grid container spacing={0} alignItems="flex-start" key={`${id}-row-${index}-grid`}>
                    {detailRow.map((detailColumn, subIndex) => (
                        <Grid
                            item
                            xs={12}
                            sm
                            style={{ padding: '8px 8px 8px 0' }}
                            key={`${id}-row-${index}-column-${subIndex}-grid`}
                        >
                            {renderJournalDetail(
                                detailColumn,
                                `${id}-${titleToId(detailColumn.title) || `-row-${index}-column-${subIndex}`}`,
                                {
                                    title: { xs: 'auto' },
                                    data: { xs: 'auto' },
                                },
                            )}
                        </Grid>
                    ))}
                </Grid>
            );
        }
        return renderJournalDetail(detailRow, `${id}-${titleToId(detailRow.title) || `field-${index}`}`, {
            title: { xs: 12, sm: 6, md: 3 },
            data: { xs: 'auto' },
        });
    });

export const JournalView = ({
    actions,
    basicDetails,
    citeScoreDetails,
    journalDetails,
    journalDetailsLoaded,
    journalLoading,
    journalLoadingError,
    journalTitle,
    jscieDetails,
    jssciDetails,
    match,
    oaDetails,
}) => {
    React.useEffect(() => {
        !journalDetailsLoaded && !journalLoading && !journalLoadingError && actions.loadJournal(match.params.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = pagesLocale.pages.journal.view;
    if (journalLoadingError) {
        return <Alert {...txt.loadFailureAlert} />;
    } else if (journalLoading || !journalDetailsLoaded) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else {
        return (
            <StandardPage standardPageId="journal-view" title={journalTitle}>
                <StandardCard standardCardId="journal-basic-details" noHeader>
                    {renderSectionContents(basicDetails, 'journal-basic-details')}
                </StandardCard>
                <br />
                <StandardCard
                    standardCardId="journal-open-access"
                    title="Open Access (Directory of Open Access Journals - DOAJ)"
                >
                    {renderSectionContents(oaDetails, 'journal-open-access')}
                </StandardCard>
                <br />
                <TabbedCard
                    cardId="journal-scie"
                    cardTitle="Clarivate Journal Citation Reports - Science Citation Index"
                    {...jscieDetails}
                    contentRenderer={renderSectionContents}
                />
                <br />
                <TabbedCard
                    cardId="journal-ssci"
                    cardTitle="Clarivate Journal Citation Reports - Social Science Citation Index"
                    {...jssciDetails}
                    contentRenderer={renderSectionContents}
                />
                <br />
                <TabbedCard
                    cardId="journal-citescore"
                    cardTitle="Elsevier CiteScore"
                    {...citeScoreDetails}
                    contentRenderer={renderSectionContents}
                />
                <br />
                <h3>Raw API response output</h3>
                <pre>{JSON.stringify(journalDetails, null, 2)}</pre>
            </StandardPage>
        );
    }
};

JournalView.propTypes = {
    actions: PropTypes.object,
    basicDetails: PropTypes.array,
    citeScoreDetails: PropTypes.object,
    journalDetails: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    journalDetailsLoaded: PropTypes.bool,
    journalLoading: PropTypes.bool,
    journalLoadingError: PropTypes.bool,
    journalTitle: PropTypes.string,
    jscieDetails: PropTypes.object,
    jssciDetails: PropTypes.object,
    match: PropTypes.object,
    oaDetails: PropTypes.array,
};

export default JournalView;
