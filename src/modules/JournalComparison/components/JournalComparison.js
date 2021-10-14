import React from 'react';
import Grid from '@material-ui/core/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import locale from 'locale/components';
import JournalComparisonList from './JournalComparisonList';
import { useHistory, useLocation } from 'react-router';
import { pathConfig } from '../../../config';
import { BackToSearchButton } from '../../SharedComponents/JournalsCommonButtons';

export const JournalComparison = () => {
    const history = useHistory();
    const location = useLocation();
    const txt = locale.components.journalComparison;
    const handleReturnToResultsClick = () =>
        location.state?.journals ? history.goBack() : history.push(pathConfig.journals.search);
    return (
        <StandardPage title={txt.title} id="journal-search-page" data-testid="journal-search-page">
            <Grid container spacing={3}>
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item xs sm md={12}>
                            <StandardCard noHeader>
                                <Grid container spacing={2}>
                                    <JournalComparisonList journals={location.state?.journals} />
                                </Grid>
                                <Grid style={{ paddingTop: 20 }} item xs={12}>
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid item xs="auto">
                                            <BackToSearchButton
                                                children={txt.buttons.returnToSearch.title}
                                                aria-label={txt.buttons.returnToSearch.aria}
                                                onClick={handleReturnToResultsClick}
                                            />
                                        </Grid>
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
