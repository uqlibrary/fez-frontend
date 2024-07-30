import React, { useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import * as actions from 'actions';
import locale from 'locale/components';
import { getFileName } from 'actions/exportPublicationsDataTransformers';

import { getDisplayReportColumns, defaultLegacyReportOption, getReportTypeFromValue } from '../config';
import { useAlertStatus } from '../hooks';
import { exportReportToExcel } from '../utils';
import { transformReportRequest } from '../transformers';
import { emptyReportActionState as emptyActionState, reportActionReducer as actionReducer } from '../reducers';

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

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const {
        // eslint-disable-next-line camelcase
        adminDashboardConfigData: { legacy_reports: legacyReports },
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

    const [exportAlertIsVisible, hideExportAlert] = useAlertStatus({
        message: adminDashboardExportReportFailed?.errorMessage,
        hideAction: actions.clearAdminDashboardExportReport,
    });

    const [displayAlertIsVisible, hideDisplayAlert] = useAlertStatus({
        message: adminDashboardDisplayReportFailed?.errorMessage,
        hideAction: actions.clearAdminDashboardDisplayReport,
    });

    const handleExportReportChange = React.useCallback((_, value) => {
        actionDispatch({ type: 'exportReport', value });
    }, []);

    const handleExportReportClick = React.useCallback(
        exportReportValue => {
            dispatch(
                actions.loadAdminDashboardExportReport({
                    id: exportReportValue,
                    export_to: 'excel',
                }),
            ).catch(
                /* istanbul ignore next */ error => {
                    /* istanbul ignore next */
                    console.error(error);
                },
            );
        },
        [dispatch],
    );

    const handleExportDisplayReportClick = () => {
        const fname = getFileName('xlsx');

        const colHeaders = columns.sort((a, b) => a.exportOrder > b.exportOrder).map(col => col.headerName);

        const sheetLabel = actionState.displayReport.label;

        exportReportToExcel({ filename: fname, sheetLabel, colHeaders, data: adminDashboardDisplayReportData });
    };

    const handleDisplayReportClick = () => {
        const newColumns = getDisplayReportColumns({
            locale: txt,
            actionState,
        });

        !!newColumns && setColumns(newColumns);

        const request = transformReportRequest(actionState);
        dispatch(actions.loadAdminDashboardDisplayReport(request));
    };

    const handleDisplayReportChange = changes => {
        actionDispatch(changes);
    };

    const getRowId = row => {
        const report =
            actionState?.displayReport?.value ||
            getReportTypeFromValue(adminDashboardDisplayReportDataParams?.report_type);

        return report === 'workshistory' ? row.pre_id : row.sat_id;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-au">
            <StandardCard noHeader>
                <SectionTitle mb={2}>{txt.exportTitle}</SectionTitle>
                <Grid container spacing={2}>
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
                </Grid>
                <LegacyReportInterface
                    id={reportLegacyId}
                    exportReport={actionState.exportReport || defaultLegacyReportOption}
                    loading={adminDashboardExportReportLoading}
                    disabled={adminDashboardExportReportLoading || adminDashboardDisplayReportLoading}
                    items={legacyReports || []}
                    onReportChange={handleExportReportChange}
                    onExportClick={handleExportReportClick}
                />
            </StandardCard>
            <Box mt={2}>
                <StandardCard noHeader>
                    <SectionTitle mb={2}>{txt.displayTitle}</SectionTitle>
                    <Grid container spacing={2}>
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
                        state={actionState}
                        onReportClick={handleDisplayReportClick}
                        onExportClick={handleExportDisplayReportClick}
                        onChange={handleDisplayReportChange}
                    />

                    {!!adminDashboardDisplayReportData && (
                        <Grid container mt={2}>
                            <Grid item xs={12}>
                                <DataGrid
                                    getRowId={getRowId}
                                    rows={adminDashboardDisplayReportData}
                                    columns={
                                        columns
                                            .filter(column => !!!column.exportOnly)
                                            .sort((a, b) => a.order > b.order) ?? /* istanbul ignore next */ []
                                    }
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                        columns: {
                                            columnVisibilityModel: {
                                                id: false,
                                            },
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
