import React from 'react';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import locale from 'locale/components';
import JournalComparisonList from './JournalComparisonList';
import { useLocation } from 'react-router-dom';
import { BackToSearchButton } from '../../SharedComponents/JournalsCommonButtons';

const StyledBackToSearchButton = styled(BackToSearchButton)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

export const JournalComparison = () => {
    const location = useLocation();
    const txt = locale.components.journalComparison;
    return (
        <StandardPage title={txt.title} id="journal-search-page" data-testid="journal-search-page">
            <Grid container spacing={3}>
                <Grid item xs>
                    <Grid container spacing={2}>
                        <Grid item xs sm md={12}>
                            <StandardCard noHeader>
                                <Grid container spacing={2}>
                                    <JournalComparisonList journals={location?.state?.journals} />
                                </Grid>
                                <Grid style={{ paddingTop: location?.state?.journals ? 20 : 25 }} item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm="auto">
                                            <StyledBackToSearchButton
                                                children={txt.buttons.returnToSearch.title}
                                                aria-label={txt.buttons.returnToSearch.aria}
                                                prevLocation={location?.state?.prevLocation}
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
