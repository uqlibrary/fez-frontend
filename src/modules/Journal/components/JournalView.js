import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import pagesLocale from 'locale/pages';

export const JournalView = ({ journalDetails, journalLoading, journalLoadingError, actions, match }) => {
    React.useEffect(() => {
        !journalDetails && !journalLoading && !journalLoadingError && actions.loadJournal(match.params.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const txt = pagesLocale.pages.journal.view;
    if (journalLoadingError) {
        return <Alert {...txt.loadFailureAlert} />;
    } else if (journalLoading || !journalDetails) {
        return <InlineLoader message={txt.loadingMessage} />;
    } else {
        const basicDetails = [
            {
                title: 'ISO abbrev title',
                data:
                    journalDetails.fez_journal_jcr_scie.jnl_jcr_scie_abbrev_title ||
                    journalDetails.fez_journal_jcr_ssci.jnl_jcr_ssci_abbrev_title ||
                    (journalDetails.fez_journal_issn &&
                        journalDetails.fez_journal_issn[0] &&
                        journalDetails.fez_journal_issn[0].fez_ulrichs &&
                        journalDetails.fez_journal_issn[0].fez_ulrichs.ulr_abbrev_title),
            },
        ];
        return (
            <StandardPage standardPageId="journal-view" title={journalDetails.jnl_title || ''}>
                <StandardCard standardCardId="journal-basic-details" noHeader>
                    <Grid container spacing={2} alignItems="flex-start">
                        {basicDetails.map((detail, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="body2">{detail.title}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={9}>
                                        {detail.data}
                                    </Grid>
                                </React.Fragment>
                            );
                        })}
                    </Grid>
                </StandardCard>
                <pre>{JSON.stringify(journalDetails, null, 2)}</pre>
            </StandardPage>
        );
    }
};

JournalView.propTypes = {
    journalDetails: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    journalLoading: PropTypes.bool,
    journalLoadingError: PropTypes.bool,
    actions: PropTypes.object,
    match: PropTypes.object,
};

export default JournalView;
