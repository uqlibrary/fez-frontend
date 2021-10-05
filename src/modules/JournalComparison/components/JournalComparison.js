import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import locale from 'locale/components';
import JournalComparisonList from './JournalComparisonList';
import { useHistory, useLocation } from 'react-router';

export const JournalComparison = () => {
    const history = useHistory();
    const location = useLocation();
    const txt = locale.components.journalComparison;
    const handleReturnToResultsClick = () => history.goBack();
    return (
        <StandardPage
            title={txt.journalComparisonInterface.title}
            id="journal-search-page"
            data-testid="journal-search-page"
        >
            <Grid container spacing={3}>
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item xs sm md={12}>
                            <StandardCard noHeader>
                                <JournalComparisonList journals={location.state.journals} />
                                <Grid container spacing={2} justify="flex-end" style={{ paddingTop: 20 }}>
                                    <Grid item xs="auto">
                                        <Button
                                            variant="contained"
                                            children={txt.journalComparisonInterface.buttons.returnToSearch.title}
                                            aria-label={txt.journalComparisonInterface.buttons.returnToSearch.aria}
                                            type="submit"
                                            color="primary"
                                            onClick={handleReturnToResultsClick}
                                            id="journal-search-button"
                                            data-testid="journal-search-button"
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(JournalComparison);
