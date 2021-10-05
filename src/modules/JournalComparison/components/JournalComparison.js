import React from 'react';
import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from 'locale/components';
import JournalComparisonInterface from './JournalComparisonInterface';
import JournalComparisonList from './JournalComparisonList';
import { useLocation } from 'react-router';

export const JournalComparison = () => {
    const location = useLocation();
    const txt = locale.components.journalComparison;
    return (
        <StandardPage
            title={txt.journalComparisonInterface.title}
            id="journal-search-page"
            data-testid="journal-search-page"
        >
            <Grid container spacing={3}>
                <Grid item xs>
                    <JournalComparisonList journals={location.state.journals} />
                </Grid>
                <Grid item xs={12}>
                    <JournalComparisonInterface />
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(JournalComparison);
