import React from 'react';

import { useTheme } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import RibbonChartContainer from './RibbonChartContainer';
import PieChartContainer from './PieChartContainer';
import VisualisationSystemAlerts from './visualisations/VisualisationSystemAlerts';
import VisualisationWorks from './visualisations/VisualisationWorks';

const Today = () => {
    const theme = useTheme();
    const colours = { today: '#35A9A5', assigned: '#338CFA', remaining: '#B60DCE' };
    const data = [
        { label: 'Total', value: 150 },
        {
            label: 'New today',
            value: 25,
            sx: { borderBottom: `3px solid ${colours.today}`, padding: theme.spacing(1) },
        },
        {
            label: 'Assigned',
            value: 15,
            suffix: '(10%)',
            sx: { borderBottom: `3px solid ${colours.assigned}`, padding: theme.spacing(1) },
        },
        {
            label: 'Unassigned',
            value: 135,
            suffix: '(90%)',
            sx: { borderBottom: `3px solid ${colours.remaining}`, padding: theme.spacing(1) },
        },
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <RibbonChartContainer data={data} label="System Alerts">
                            <VisualisationSystemAlerts today={25} assigned={15} remaining={135} />
                        </RibbonChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PieChartContainer
                            label="Unprocessed Works"
                            subtext={
                                <ExternalLink id={'unprocessed-link'} data-testid={'unprocessed-link'} href={'#'}>
                                    <Typography fontSize={'0.875rem'} paddingInlineEnd={1}>
                                        view
                                    </Typography>
                                </ExternalLink>
                            }
                        >
                            <VisualisationWorks text={'15'} amount={15} />
                        </PieChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PieChartContainer
                            label="Processed Works"
                            subtext={<Typography fontSize={'0.875rem'}>this iteration</Typography>}
                        >
                            <VisualisationWorks text={'82'} amount={15} colour="#35A9A5" />
                        </PieChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PieChartContainer
                            label="OA Status"
                            subtext={<Typography fontSize={'0.875rem'}>of research output</Typography>}
                        >
                            <VisualisationWorks text={'15'} amount={15} />
                        </PieChartContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
                <Typography>Side panel</Typography>
            </Grid>
        </Grid>
    );
};

export default React.memo(Today);
