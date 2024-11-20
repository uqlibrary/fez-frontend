import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import * as actions from 'actions';
import locale from 'locale/components';
import { getFileName } from 'actions/exportPublicationsDataTransformers';

import { getDisplayReportColumns, getReportTypeFromValue, getDefaultSorting } from '../config';
import { useAlertStatus } from '../hooks';
import { exportReportToExcel } from '../utils';
import { transformExportReportRequest, transformDisplayReportRequest } from '../transformers';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import SectionTitle from '../components/SectionTitle';
import LegacyReportInterface from '../components/LegacyReportInterface';
import DisplayReportInterface from '../components/DisplayReportInterface';

const reportLegacyId = 'report-export-only';
const reportDisplayExportId = 'report-display-export';

const Reports = () => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const dispatch = useDispatch();

    const {
        // eslint-disable-next-line camelcase
        adminDashboardConfigData: { export_reports: exportReports },
    } = useSelector(state => state.get('adminDashboardConfigReducer'));

    const {
        adminDashboardDisplayReportData,
        adminDashboardDisplayReportDataParams,
        adminDashboardDisplayReportLoading,
        adminDashboardDisplayReportFailed,
    } = useSelector(state => state.get('adminDashboardDisplayReportReducer'));

    const { adminDashboardExportReportLoading, adminDashboardExportReportFailed } = useSelector(state =>
        state.get('adminDashboardExportReportReducer'),
    );

    const initColumns = () => {
        if (!!adminDashboardDisplayReportDataParams) {
            // retain the view of the last report that was displayed
            return getDisplayReportColumns({
                locale: txt,
                params: adminDashboardDisplayReportDataParams,
            });
        }
        return null;
    };

    const [columns, setColumns] = React.useState(initColumns);

    const [
        exportReportAlertIsVisible,
        hideExportReportAlert,
        showExportReportAlert,
        exportReportAlertProps,
    ] = useAlertStatus({});

    const [exportAlertIsVisible, hideExportAlert] = useAlertStatus({
        message: adminDashboardExportReportFailed?.errorMessage,
        hideAction: actions.clearAdminDashboardExportReport,
    });

    const [displayAlertIsVisible, hideDisplayAlert] = useAlertStatus({
        message: adminDashboardDisplayReportFailed?.errorMessage,
        hideAction: actions.clearAdminDashboardDisplayReport,
    });

    const handleExportReportClick = React.useCallback(
        actionState => {
            const request = transformExportReportRequest(actionState);

            dispatch(
                actions.loadAdminDashboardExportReport(request, { export_to: 'csv', job: actionState.report?.sel_job }),
            )
                .then(response => {
                    if (typeof response === 'object') {
                        const action =
                            response.data.success === true
                                ? txt.alert.jobQueued(actionState.report?.sel_title)
                                : txt.alert.noResults(actionState.report?.sel_title);

                        action.dismissAction = () => {
                            hideExportReportAlert();
                        };
                        showExportReportAlert(action);
                    }
                })
                .catch(
                    /* istanbul ignore next */ error => {
                        /* istanbul ignore next */
                        console.error(error);
                    },
                );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, showExportReportAlert],
    );

    const handleExportDisplayReportClick = actionState => {
        const fname = getFileName('xlsx');

        const colHeaders = columns.sort((a, b) => a.exportOrder > b.exportOrder).map(col => col.headerName);

        const sheetLabel = actionState.report.label;

        exportReportToExcel({ filename: fname, sheetLabel, colHeaders, data: adminDashboardDisplayReportData });
    };

    const handleDisplayReportClick = actionState => {
        const newColumns = getDisplayReportColumns({
            locale: txt,
            actionState,
        });

        !!newColumns && setColumns(newColumns);

        const request = transformDisplayReportRequest(actionState);
        dispatch(actions.loadAdminDashboardDisplayReport(request));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-au">
            <StandardCard noHeader>
                <SectionTitle mb={2}>{txt.exportTitle}</SectionTitle>
                <Grid container spacing={2} mb={2}>
                    {exportAlertIsVisible && (
                        <Grid item xs={12}>
                            <Alert
                                type="error_outline"
                                title={txt.error.title}
                                message={txt.error.general}
                                allowDismiss
                                dismissAction={() => {
                                    hideExportAlert();
                                }}
                                alertId={`alert-${reportLegacyId}`}
                            />
                        </Grid>
                    )}
                    {exportReportAlertIsVisible && !!exportReportAlertProps?.message && (
                        <Grid item xs={12}>
                            <Alert {...exportReportAlertProps} />
                        </Grid>
                    )}
                </Grid>
                <LegacyReportInterface
                    id={reportLegacyId}
                    loading={adminDashboardExportReportLoading}
                    disabled={adminDashboardExportReportLoading || adminDashboardDisplayReportLoading}
                    items={exportReports || /* istanbul ignore next */ []}
                    onExportClick={handleExportReportClick}
                />
            </StandardCard>
            <Box mt={2}>
                <StandardCard noHeader>
                    <SectionTitle mb={2}>{txt.displayTitle}</SectionTitle>
                    <Grid container spacing={2} mb={2}>
                        {displayAlertIsVisible && (
                            <Grid item xs={12}>
                                <Alert
                                    type="error_outline"
                                    title={txt.error.title}
                                    message={txt.error.general}
                                    allowDismiss
                                    dismissAction={() => {
                                        hideDisplayAlert();
                                    }}
                                    alertId={`alert-${reportDisplayExportId}`}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <DisplayReportInterface
                        id={reportDisplayExportId}
                        disabled={adminDashboardDisplayReportLoading || adminDashboardExportReportLoading}
                        exportDisabled={!!!adminDashboardDisplayReportData}
                        loading={adminDashboardDisplayReportLoading}
                        onReportClick={handleDisplayReportClick}
                        onExportClick={handleExportDisplayReportClick}
                    />

                    {!!adminDashboardDisplayReportData && (
                        <Grid container mt={2}>
                            <Grid item xs={12}>
                                <DataGrid
                                    getRowId={row => row.pre_id || row.sat_id || /* istanbul ignore next */ ''}
                                    rows={adminDashboardDisplayReportData}
                                    columns={
                                        columns
                                            .filter(column => !!!column.exportOnly)
                                            .sort((a, b) => a.order > b.order) ?? /* istanbul ignore next */ []
                                    }
                                    sortingOrder={['asc', 'desc']}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                        columns: {
                                            columnVisibilityModel: {
                                                id: false,
                                            },
                                        },
                                        sorting: {
                                            sortModel: getDefaultSorting(
                                                getReportTypeFromValue(
                                                    adminDashboardDisplayReportDataParams?.report_type,
                                                ),
                                            ),
                                        },
                                    }}
                                    pageSizeOptions={[10, 25, 50, 100]}
                                    autoHeight
                                    loading={adminDashboardDisplayReportLoading}
                                    autosizeOptions={{
                                        columns: ['title', 'content', 'link'],
                                        includeOutliers: true,
                                        includeHeaders: true,
                                    }}
                                    disableColumnMenu
                                    getRowHeight={() => 'auto'}
                                    sx={{
                                        [`& .${gridClasses.cell}`]: {
                                            py: 1,
                                        },
                                    }}
                                    forwardedProps={{ 'data-testid': 'report-display-data-grid' }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </StandardCard>
            </Box>
        </LocalizationProvider>
    );
};

export default React.memo(Reports);
