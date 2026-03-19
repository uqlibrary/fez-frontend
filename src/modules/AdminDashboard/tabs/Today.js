import React from 'react';
import { useSelector } from 'react-redux';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

import * as actions from 'actions';
import locale from 'locale/components';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { LINK_UNPROCESSED_WORKS, COLOURS } from '../config';
import { useAlertStatus } from '../hooks';
import { transformUrlToPlatform, transformOaCategoriesToChartData } from '../transformers';

import RibbonChartContainer from '../components/RibbonChartContainer';
import PieChartContainer from '../components/PieChartContainer';
import GaugeChartContainer from '../components/GaugeChartContainer';
import QuickLinkContainer from '../components/QuickLinkContainer';
import VisualisationSystemAlerts from '../components/visualisations/VisualisationSystemAlerts';
import VisualisationWorks from '../components/visualisations/VisualisationWorks';
import VisualisationOpenAccess from '../components/visualisations/VisualisationOpenAccess';
import { getTotalDocCount, transformBucketsToChartData } from '../utils';
import { DOCUMENT_TYPES_LOOKUP } from 'config/general';

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
                            {!!adminDashboardTodayLoading && (
                                <Skeleton
                                    animation="wave"
                                    height={225}
                                    width={'100%'}
                                    id={'admin-dashboard-systemalerts-skeleton'}
                                    data-testid={'admin-dashboard-systemalerts-skeleton'}
                                />
                            )}
                            {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                                <PieChartContainer
                                    label={txt.works.unprocessed}
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
                                                {txt.works.unprocessedSubText}
                                            </Typography>
                                        </ExternalLink>
                                    }
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
                                </PieChartContainer>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {!!adminDashboardTodayLoading && (
                                <Skeleton
                                    animation="wave"
                                    height={225}
                                    width={'100%'}
                                    id={'admin-dashboard-systemalerts-skeleton'}
                                    data-testid={'admin-dashboard-systemalerts-skeleton'}
                                />
                            )}
                            {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                                <PieChartContainer
                                    label={txt.works.processed}
                                    subtext={
                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontSize: '0.875rem',
                                                fontWeight: 200,
                                            }}
                                        >
                                            {txt.works.processedSubText(
                                                adminDashboardTodayData.works.iteration.from,
                                                adminDashboardTodayData.works.iteration.to,
                                            )}
                                        </Typography>
                                    }
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
                                </PieChartContainer>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container rowSpacing={4} spacing={5} sx={{ pt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            {!!adminDashboardTodayLoading && (
                                <Skeleton
                                    animation="wave"
                                    height={225}
                                    width={'100%'}
                                    data-testid={'admin-dashboard-systemalerts-skeleton'}
                                />
                            )}
                            {!!adminDashboardTodayData && adminDashboardTodaySuccess && (
                                <GaugeChartContainer
                                    label={txt.openaccess.researchOutput.title}
                                    subtext={
                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontSize: '0.875rem',
                                                fontWeight: 200,
                                            }}
                                        >
                                            {txt.openaccess.researchOutput.subText}
                                        </Typography>
                                    }
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
                                </GaugeChartContainer>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {!!adminDashboardTodayLoading && (
                                <Skeleton
                                    animation="wave"
                                    height={225}
                                    width={'100%'}
                                    id={'admin-dashboard-open-access-categories-skeleton'}
                                    data-testid={'admin-dashboard-open-access-categories-skeleton'}
                                />
                            )}
                            {adminDashboardTodaySuccess && adminDashboardTodayData?.oa_categories && (
                                <PieChartContainer
                                    label={txt.openAccessCategories.title}
                                    subtext={
                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontSize: '0.875rem',
                                                fontWeight: 200,
                                            }}
                                        >
                                            {txt.openaccess.researchOutput.subText}
                                        </Typography>
                                    }
                                    id="open-access-categories-container"
                                >
                                    <VisualisationWorks
                                        id="open-access-categories"
                                        text={`${getTotalDocCount(adminDashboardTodayData.oa_categories)}`}
                                        data={transformOaCategoriesToChartData(adminDashboardTodayData.oa_categories)}
                                        showTooltips
                                    />
                                </PieChartContainer>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container rowSpacing={4} spacing={5} sx={{ pt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            {!!adminDashboardTodayLoading && (
                                <Skeleton
                                    animation="wave"
                                    height={225}
                                    width={'100%'}
                                    id={'admin-dashboard-doi-populated-doc-types-skeleton'}
                                    data-testid={'admin-dashboard-doi-populated-doc-types-skeleton'}
                                />
                            )}
                            {adminDashboardTodaySuccess && adminDashboardTodayData?.doi_populated_doc_type_counts && (
                                <PieChartContainer
                                    label={txt.doiPopulateDocTypes.title}
                                    subtext={
                                        <Typography
                                            variant="span"
                                            sx={{
                                                fontSize: '0.875rem',
                                                fontWeight: 200,
                                            }}
                                        >
                                            {txt.doiPopulateDocTypes.subText}
                                        </Typography>
                                    }
                                    id="doi-populated-doc-types-container"
                                >
                                    <VisualisationWorks
                                        id="doi-populated-doc-types"
                                        text={`${getTotalDocCount(adminDashboardTodayData.doi_populated_doc_type_counts)}`}
                                        data={transformBucketsToChartData(
                                            adminDashboardTodayData.doi_populated_doc_type_counts,
                                            DOCUMENT_TYPES_LOOKUP,
                                        )}
                                        showTooltips
                                    />
                                </PieChartContainer>
                            )}
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
