import React from 'react';

import { useTheme } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import QuickLinkContainer from './QuickLinkContainer';
import RibbonChartContainer from './RibbonChartContainer';
import PieChartContainer from './PieChartContainer';
import GaugeChartContainer from './GaugeChartContainer';
import VisualisationSystemAlerts from './visualisations/VisualisationSystemAlerts';
import VisualisationWorks from './visualisations/VisualisationWorks';
import VisualisationOpenAccess from './visualisations/VisualisationOpenAccess';

const Today = () => {
    const theme = useTheme();
    const colours = { today: '#35A9A5', assigned: '#338CFA', remaining: '#B60DCE' };
    const data = [
        { label: 'Total', value: 150 },
        {
            label: 'New today',
            value: 25,
            sx: { padding: theme.spacing(1) },
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
    const oaData = {
        current: 256,
        total: 1256,
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} marginBlockEnd={4}>
                        <RibbonChartContainer data={data} label="System Alerts">
                            <VisualisationSystemAlerts today={25} assigned={15} remaining={135} />
                        </RibbonChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PieChartContainer
                            label="Unprocessed Works"
                            subtext={
                                <ExternalLink id={'unprocessed-link'} data-testid={'unprocessed-link'} href={'#'}>
                                    <Typography
                                        fontSize={'0.875rem'}
                                        variant="span"
                                        fontWeight={200}
                                        display={'inline-block'}
                                    >
                                        view
                                    </Typography>
                                </ExternalLink>
                            }
                        >
                            <VisualisationWorks text={'185'} amount={15} />
                        </PieChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PieChartContainer
                            label="Processed Works"
                            subtext={
                                <Typography fontSize={'0.875rem'} variant="span" fontWeight={200}>
                                    this iteration
                                </Typography>
                            }
                        >
                            <VisualisationWorks text={'8898'} amount={82} colour="#35A9A5" />
                        </PieChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <GaugeChartContainer
                            label="OA Status"
                            subtext={
                                <Typography fontSize={'0.875rem'} variant="span" fontWeight={200}>
                                    of research output
                                </Typography>
                            }
                        >
                            <VisualisationOpenAccess
                                text={`${oaData.current} (${Math.round((oaData.current / oaData.total) * 100)}%)`}
                                subText={`of ${oaData.total} records`}
                                amount={oaData.current}
                                maxAmount={oaData.total}
                            />
                        </GaugeChartContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
                <QuickLinkContainer />
            </Grid>
        </Grid>
    );
};

export default React.memo(Today);
