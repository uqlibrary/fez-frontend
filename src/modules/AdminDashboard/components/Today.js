import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import locale from 'locale/components';

import QuickLinkContainer from './QuickLinkContainer';
import RibbonChartContainer from './RibbonChartContainer';
import PieChartContainer from './PieChartContainer';
import GaugeChartContainer from './GaugeChartContainer';
import VisualisationSystemAlerts from './visualisations/VisualisationSystemAlerts';
import VisualisationWorks from './visualisations/VisualisationWorks';
import VisualisationOpenAccess from './visualisations/VisualisationOpenAccess';

const colours = { assigned: '#338CFA', unassigned: '#B60DCE' };

const data = {
    systemalerts: {
        total: 150,
        today: 25,
        assigned: 15,
        unassigned: 135,
    },
    works: {
        processed: 82,
        unprocessed: 15,
    },
    oa: {
        current: 256,
        total: 1256,
    },
};

const Today = () => {
    const txt = locale.components.adminDashboard;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} marginBlockEnd={4}>
                        <RibbonChartContainer
                            data={data.systemalerts}
                            locale={txt.systemalerts}
                            colours={colours}
                            label={txt.systemalerts.title}
                        >
                            <VisualisationSystemAlerts
                                today={data.systemalerts.today}
                                assigned={data.systemalerts.assigned}
                                remaining={data.systemalerts.unassigned}
                            />
                        </RibbonChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PieChartContainer
                            label={txt.works.unprocessed}
                            subtext={
                                <ExternalLink id={'unprocessed-link'} data-testid={'unprocessed-link'} href={'#'}>
                                    <Typography
                                        fontSize={'0.875rem'}
                                        variant="span"
                                        fontWeight={200}
                                        display={'inline-block'}
                                    >
                                        {txt.works.unprocessedSubText}
                                    </Typography>
                                </ExternalLink>
                            }
                        >
                            <VisualisationWorks text={`${data.works.unprocessed}`} amount={data.works.unprocessed} />
                        </PieChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <PieChartContainer
                            label={txt.works.processed}
                            subtext={
                                <Typography fontSize={'0.875rem'} variant="span" fontWeight={200}>
                                    {txt.works.processedSubText}
                                </Typography>
                            }
                        >
                            <VisualisationWorks
                                text={`${data.works.processed}`}
                                amount={data.works.processed}
                                colour="#35A9A5"
                            />
                        </PieChartContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <GaugeChartContainer
                            label={txt.openaccess.researchOutput.title}
                            subtext={
                                <Typography fontSize={'0.875rem'} variant="span" fontWeight={200}>
                                    {txt.openaccess.researchOutput.subText}
                                </Typography>
                            }
                        >
                            <VisualisationOpenAccess
                                text={txt.openaccess.researchOutput.chart.text(data.oa.current, data.oa.total)}
                                subText={txt.openaccess.researchOutput.chart.subtext(data.oa.total)}
                                amount={data.oa.current}
                                maxAmount={data.oa.total}
                            />
                        </GaugeChartContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={5}>
                <QuickLinkContainer locale={txt.quicklinks} />
            </Grid>
        </Grid>
    );
};

export default React.memo(Today);
