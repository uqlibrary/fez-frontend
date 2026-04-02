import React from 'react';
import { useSelector } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import * as actions from 'actions';
import locale from 'locale/components';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { LINK_UNPROCESSED_WORKS, COLOURS } from '../config';
import { useAlertStatus } from '../hooks';
import { transformUrlToPlatform, transformOaCategories } from '../transformers';

import RibbonChartContainer from '../components/RibbonChartContainer';
import ChartContainer from '../components/ChartContainer';
import QuickLinkContainer from '../components/QuickLinkContainer';
import VisualisationSystemAlerts from '../components/visualisations/VisualisationSystemAlerts';
import VisualisationWorks from '../components/visualisations/VisualisationWorks';
import VisualisationOpenAccess from '../components/visualisations/VisualisationOpenAccess';
import { getTotalDocCount } from '../utils';
import ChartBlock from '../components/ChartBlock';

const Today = () => {
    const txt = locale.components.adminDashboard.tabs.today;
    const { adminDashboardTodayData, adminDashboardTodayLoading, adminDashboardTodaySuccess } = useSelector(state =>
        state.get('adminDashboardTodayReducer'),
    );
    const { adminDashboardQuickLinksUpdateFailed } = useSelector(state => state.get('adminDashboardQuickLinksReducer'));

    const [alertIsVisible, hideAlert] = useAlertStatus({
        message: adminDashboardQuickLinksUpdateFailed,
        hideAction: actions.adminDashboardQuickLinkUpdateClear,
    });

    return (
        <StandardCard noHeader>
            {alertIsVisible && (
                <Grid item xs={12} sx={{ mb: 1 }}>
                    <Alert
                        type="error_outline"
                        title={txt.quicklinks.error.title}
                        message={txt.quicklinks.error.updating}
                        allowDismiss
                        dismissAction={() => {
                            hideAlert();
                        }}
                    />
                </Grid>
            )}
            <Grid container spacing={2} minHeight={300}>
                <Grid item xs={12} lg={7}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} marginBlockEnd={4}>
                            {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                                <RibbonChartContainer
                                    data={adminDashboardTodayData?.systemalerts}
                                    locale={txt.systemalerts}
                                    colours={COLOURS}
                                    label={txt.systemalerts.title}
                                    id="system-alerts"
                                >
                                    <VisualisationSystemAlerts
                                        assigned={
                                            adminDashboardTodayData.systemalerts.assigned +
                                                adminDashboardTodayData.systemalerts.unassigned ===
                                            0
                                                ? /* istanbul ignore next */ 1
                                                : adminDashboardTodayData.systemalerts.assigned
                                        }
                                        remaining={adminDashboardTodayData.systemalerts.unassigned}
                                        {...(adminDashboardTodayData.systemalerts.assigned +
                                            adminDashboardTodayData.systemalerts.unassigned ===
                                        0
                                            ? /* istanbul ignore next */ { colours: { assigned: '#e0e0e0' } }
                                            : {})}
                                    />
                                </RibbonChartContainer>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ChartBlock
                                loading={adminDashboardTodayLoading}
                                success={adminDashboardTodaySuccess}
                                hasData={!!adminDashboardTodayData?.works}
                                id="admin-dashboard-unprocessed-works"
                                render={() => (
                                    <ChartContainer
                                        label={txt.works.unprocessed.title}
                                        subtext={
                                            <ExternalLink
                                                id={'unprocessed'}
                                                data-testid={'unprocessed'}
                                                href={transformUrlToPlatform(LINK_UNPROCESSED_WORKS)}
                                            >
                                                <Typography
                                                    variant="span"
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: 200,
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {txt.works.unprocessed.subText}
                                                </Typography>
                                            </ExternalLink>
                                        }
                                        tooltip={txt.works.unprocessed.tooltip}
                                        id="unprocessed-works"
                                    >
                                        <VisualisationWorks
                                            id="unprocessed-works"
                                            text={`${adminDashboardTodayData.works.unprocessed}`}
                                            data={[
                                                {
                                                    id: 0,
                                                    value:
                                                        adminDashboardTodayData.works.unprocessed === 0
                                                            ? /* istanbul ignore next */ 100
                                                            : adminDashboardTodayData.works.unprocessed,
                                                    color: '#B60DCE',
                                                },
                                            ]}
                                        />
                                    </ChartContainer>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ChartBlock
                                loading={adminDashboardTodayLoading}
                                success={adminDashboardTodaySuccess}
                                hasData={!!adminDashboardTodayData?.works}
                                id={'admin-dashboard-processed-works'}
                                render={() => {
                                    const { from, to } = adminDashboardTodayData.works.iteration;
                                    const processedInfo = txt.works.processed.subTextAndTooltip(from, to);
                                    return (
                                        <ChartContainer
                                            label={txt.works.processed.title}
                                            subtext={processedInfo.text}
                                            tooltip={processedInfo.tooltip}
                                            id="processed-works"
                                        >
                                            <VisualisationWorks
                                                id="processed-works"
                                                text={`${adminDashboardTodayData.works.processed}`}
                                                data={[
                                                    {
                                                        id: 0,
                                                        value:
                                                            adminDashboardTodayData.works.processed === 0
                                                                ? /* istanbul ignore next */ 100
                                                                : adminDashboardTodayData.works.processed,
                                                        color: '#35A9A5',
                                                    },
                                                ]}
                                            />
                                        </ChartContainer>
                                    );
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container rowSpacing={4} spacing={5} sx={{ pt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <ChartBlock
                                loading={adminDashboardTodayLoading}
                                success={adminDashboardTodaySuccess}
                                hasData={!!adminDashboardTodayData}
                                id={'admin-dashboard-open-access'}
                                render={() => (
                                    <ChartContainer
                                        label={txt.openaccess.researchOutput.title}
                                        subtext={txt.openaccess.researchOutput.subText}
                                        tooltip={txt.openaccess.researchOutput.tooltip}
                                        id="open-access"
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
                                    </ChartContainer>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ChartBlock
                                loading={adminDashboardTodayLoading}
                                success={adminDashboardTodaySuccess}
                                hasData={!!adminDashboardTodayData?.oa_categories}
                                id={'admin-dashboard-open-access-categories'}
                                render={() => (
                                    <ChartContainer
                                        label={txt.openAccessCategories.title}
                                        subtext={txt.openAccessCategories.subText}
                                        tooltip={txt.openAccessCategories.tooltip}
                                        id="open-access-categories-container"
                                    >
                                        <VisualisationWorks
                                            id="open-access-categories"
                                            text={`${getTotalDocCount(adminDashboardTodayData.oa_categories)}`}
                                            data={transformOaCategories(adminDashboardTodayData.oa_categories)}
                                            showTooltips
                                        />
                                    </ChartContainer>
                                )}
                            />
                        </Grid>
                    </Grid>

                    {!!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 400,
                                textAlign: 'center',
                            }}
                        >
                            {txt.loading.nodata}
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} lg={5}>
                    <QuickLinkContainer locale={txt.quicklinks} />
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(Today);
