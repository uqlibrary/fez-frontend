import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import locale from 'locale/components';
import * as actions from 'actions';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import RibbonChartContainer from './RibbonChartContainer';
import PieChartContainer from './PieChartContainer';
import GaugeChartContainer from './GaugeChartContainer';
import QuickLinkContainer from './QuickLinkContainer';
import VisualisationSystemAlerts from './visualisations/VisualisationSystemAlerts';
import VisualisationWorks from './visualisations/VisualisationWorks';
import VisualisationOpenAccess from './visualisations/VisualisationOpenAccess';

const colours = { assigned: '#338CFA', unassigned: '#B60DCE' };

const Today = () => {
    const txt = locale.components.adminDashboard;
    const dispatch = useDispatch();
    const { adminDashboardTodayData, adminDashboardTodayLoading, adminDashboardTodaySuccess } = useSelector(state =>
        state.get('adminDashboardReducer'),
    );

    useEffect(() => {
        dispatch(actions.loadAdminDashboardToday());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
                {!!adminDashboardTodayLoading && (
                    <InlineLoader loaderId="childControlledVocab-page-loading" message={txt.loading.message} />
                )}
                {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} marginBlockEnd={4}>
                            <RibbonChartContainer
                                data={adminDashboardTodayData.systemalerts}
                                locale={txt.systemalerts}
                                colours={colours}
                                label={txt.systemalerts.title}
                            >
                                <VisualisationSystemAlerts
                                    today={adminDashboardTodayData.systemalerts.today}
                                    assigned={adminDashboardTodayData.systemalerts.assigned}
                                    remaining={adminDashboardTodayData.systemalerts.unassigned}
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
                                <VisualisationWorks
                                    text={`${adminDashboardTodayData.works.unprocessed}`}
                                    amount={adminDashboardTodayData.works.unprocessed}
                                />
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
                                    text={`${adminDashboardTodayData.works.processed}`}
                                    amount={adminDashboardTodayData.works.processed}
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
                                    text={txt.openaccess.researchOutput.chart.text(
                                        adminDashboardTodayData.oa.current,
                                        adminDashboardTodayData.oa.total,
                                    )}
                                    subText={txt.openaccess.researchOutput.chart.subtext(
                                        adminDashboardTodayData.oa.total,
                                    )}
                                    amount={adminDashboardTodayData.oa.current}
                                    maxAmount={adminDashboardTodayData.oa.total}
                                />
                            </GaugeChartContainer>
                        </Grid>
                    </Grid>
                )}
                {!!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                    <Typography fontSize={'1rem'} fontWeight={400} textAlign={'center'}>
                        {txt.loading.nodata}
                    </Typography>
                )}
            </Grid>
            <Grid item xs={12} md={5}>
                <QuickLinkContainer locale={txt.quicklinks} />
            </Grid>
        </Grid>
    );
};

export default React.memo(Today);
