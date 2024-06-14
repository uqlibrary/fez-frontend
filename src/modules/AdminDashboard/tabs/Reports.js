import React, { useReducer } from 'react';
// import PropTypes from 'prop-types';

import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import locale from 'locale/components';
import { emptyReportActionState as emptyActionState, reportActionReducer as actionReducer } from '../reducers';

import * as actions from 'actions';
import { getFileName } from 'actions/exportPublicationsDataTransformers';

import { getDisplayReportColumns, optionDoubleRowRender } from '../config';
import { useValidateReport, useAlertStatus } from '../hooks';
import { exportReportToExcel } from '../utils';

import SectionTitle from '../components/SectionTitle';

const reportExportOnlyId = 'report-export-only';
const reportDisplayExportId = 'report-display-export';

const Reports = () => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const dispatch = useDispatch();

    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const {
        adminDashboardDisplayReportData,
        adminDashboardDisplayReportDataType,
        adminDashboardDisplayReportLoading,
        adminDashboardDisplayReportFailed,
    } = useSelector(state => state.get('adminDashboardDisplayReportReducer'));
    const { adminDashboardExportReportLoading, adminDashboardExportReportFailed } = useSelector(state =>
        state.get('adminDashboardExportReportReducer'),
    );

    const [exportAlertIsVisible, hideExportAlert] = useAlertStatus({
        message: adminDashboardExportReportFailed?.errorMessage,
        hideAction: actions.clearAdminDashboardExportReport,
    });
    const [displayAlertIsVisible, hideDisplayAlert] = useAlertStatus({
        message: adminDashboardDisplayReportFailed?.errorMessage,
        hideAction: actions.clearAdminDashboardDisplayReport,
    });

    const { isValid, fromDateError, toDateError, systemAlertError } = useValidateReport({
        locale: txt.error,
        displayReport: actionState.displayReport?.value,
        fromDate: actionState.fromDate,
        toDate: actionState.toDate,
        systemAlertId: actionState.systemAlertId,
    });

    const columns = React.useMemo(() => {
        if (!!actionState.displayReport) {
            return getDisplayReportColumns(txt, actionState.displayReport.value);
        } else if (!!adminDashboardDisplayReportDataType) {
            // retain the view of the last report that was displayed
            return getDisplayReportColumns(txt, adminDashboardDisplayReportDataType);
        }
        return [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionState.displayReport]);

    const handleExportReportClick = () => {
        dispatch(
            actions.loadAdminDashboardExportReport({
                id: actionState.exportReport.value,
                export_to: 'excel',
            }),
        )
            .then(() => {
                //! adminDashboardExportReportFailed && dispatch(actions.clearAdminDashboardExportReport());
            })
            .catch(error => {
                /* istanbul ignore next */
                console.error(error);
            });
    };

    const handleExportDisplayReportClick = () => {
        const fname = getFileName('xlsx');
        const colHeaders = columns.sort((a, b) => a.order > b.order).map(col => col.headerName);
        const sheetLabel = actionState.displayReport.label;

        exportReportToExcel({ filename: fname, sheetLabel, colHeaders, data: adminDashboardDisplayReportData });
    };

    const handleDisplayReportClick = () => {
        /* istanbul ignore else */
        if (isValid) {
            const request = {
                id: actionState.displayReport.value,
                ...(!!actionState.fromDate ? { dateFrom: actionState.fromDate } : {}),
                ...(!!actionState.toDate ? { dateTo: actionState.toDate } : {}),
                ...(actionState.displayReport.value === 'systemalertlog' && !!actionState.systemAlertId
                    ? { alertId: actionState.systemAlertId }
                    : {}),
            };
            dispatch(actions.loadAdminDashboardDisplayReport(request));
        }
    };

    const handleDisplayReportChange = value => {
        actionDispatch({ type: 'displayReport', value });
        dispatch(actions.clearAdminDashboardDisplayReport());
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
                                alertId={`alert-${reportExportOnlyId}`}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            disablePortal
                            id={reportExportOnlyId}
                            options={txt.options.export}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            renderOption={optionDoubleRowRender}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label={txt.label.report}
                                    helperText={txt.label.helperText}
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${reportExportOnlyId}-input`,
                                        'data-analyticsid': `${reportExportOnlyId}-input`,
                                        'data-testid': `${reportExportOnlyId}-input`,
                                        'aria-describedby': `${reportExportOnlyId}-label`,
                                    }}
                                    InputLabelProps={{
                                        'data-testid': `${reportExportOnlyId}-label`,
                                        for: `${reportExportOnlyId}-input`,
                                    }}
                                />
                            )}
                            ListboxProps={{
                                id: `${reportExportOnlyId}-listbox`,
                                'data-analyticsid': `${reportExportOnlyId}-listbox`,
                                'data-testid': `${reportExportOnlyId}-listbox`,
                            }}
                            value={actionState.exportReport}
                            onChange={(_, value) => actionDispatch({ type: 'exportReport', value })}
                            disabled={adminDashboardExportReportLoading || adminDashboardDisplayReportLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            id="report-export-button"
                            data-testid="report-export-button"
                            variant="contained"
                            onClick={handleExportReportClick}
                            disabled={
                                !!!actionState.exportReport ||
                                adminDashboardExportReportLoading ||
                                adminDashboardDisplayReportLoading
                            }
                        >
                            {adminDashboardExportReportLoading && (
                                <CircularProgress
                                    color="inherit"
                                    size={20}
                                    id={'export-report-progress'}
                                    data-testid={'export-report-progress'}
                                    sx={{ mr: 1 }}
                                />
                            )}
                            {txt.label.exportReport}
                        </Button>
                    </Grid>
                </Grid>
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
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                disablePortal
                                id={reportDisplayExportId}
                                fullWidth
                                variant="standard"
                                options={txt.options.display}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label={txt.label.report}
                                        variant="standard"
                                        inputProps={{
                                            ...params.inputProps,
                                            id: `${reportDisplayExportId}-input`,
                                            'data-analyticsid': `${reportDisplayExportId}-input`,
                                            'data-testid': `${reportDisplayExportId}-input`,
                                        }}
                                        InputLabelProps={{
                                            'data-testid': `${reportDisplayExportId}-label`,
                                            for: `${reportDisplayExportId}-input`,
                                        }}
                                    />
                                )}
                                ListboxProps={{
                                    id: `${reportDisplayExportId}-listbox`,
                                    'data-analyticsid': `${reportDisplayExportId}-listbox`,
                                    'data-testid': `${reportDisplayExportId}-listbox`,
                                }}
                                value={actionState.displayReport}
                                onChange={(_, value) => handleDisplayReportChange(value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box data-testid="report-display-date-from">
                                <DatePicker
                                    inputProps={{
                                        id: 'report-display-date-from-input',
                                        'data-testid': 'report-display-date-from-input',
                                        label: txt.label.dateFrom,
                                        'aria-label': txt.label.dateFrom,
                                        'aria-labelledby': `${reportDisplayExportId}-input`,
                                        'data-analyticsid': 'report-display-date-from-input',
                                    }}
                                    label={txt.label.dateFrom}
                                    value={actionState.fromDate}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            fullWidth
                                            error={!!fromDateError}
                                            required={!!fromDateError}
                                            helperText={fromDateError}
                                        />
                                    )}
                                    // eslint-disable-next-line react/prop-types
                                    onChange={props =>
                                        actionDispatch({
                                            type: 'fromDate',
                                            value: !!props ? moment(props).format() : null,
                                        })
                                    }
                                    defaultValue=""
                                    disableFuture
                                    maxDate={actionState.toDate}
                                    disabled={!!!actionState.displayReport}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box data-testid="report-display-date-to">
                                <DatePicker
                                    inputProps={{
                                        id: 'report-display-date-to-input',
                                        'data-testid': 'report-display-date-to-input',
                                        label: txt.label.dateTo,
                                        'aria-label': txt.label.dateTo,
                                        'aria-labelledby': 'report-display-date-to-label',
                                        'data-analyticsid': 'report-display-date-to-input',
                                    }}
                                    label={txt.label.dateTo}
                                    value={actionState.toDate}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            fullWidth
                                            error={!!toDateError}
                                            required={!!actionState.fromDate}
                                            helperText={toDateError}
                                        />
                                    )}
                                    // eslint-disable-next-line react/prop-types
                                    onChange={props =>
                                        actionDispatch({
                                            type: 'toDate',
                                            value: !!props ? moment(props).format() : null,
                                        })
                                    }
                                    defaultValue=""
                                    disableFuture
                                    minDate={actionState.fromDate}
                                    disabled={!!!actionState.displayReport}
                                />
                            </Box>
                        </Grid>
                        {actionState.displayReport?.value === 'systemalertlog' && (
                            <Grid item xs={12} sm={4}>
                                <Box data-testid="report-display-system-alert-id">
                                    <TextField
                                        label={txt.label.systemId}
                                        variant="standard"
                                        fullWidth
                                        inputProps={{
                                            id: 'report-display-system-alert-id-input',
                                            'data-analyticsid': 'report-display-system-alert-id-input',
                                            'data-testid': 'report-display-system-alert-id-input',
                                        }}
                                        InputLabelProps={{
                                            'data-testid': 'report-display-system-alert-id-label',
                                            for: 'report-display-system-alert-id-input',
                                        }}
                                        sx={{ mt: 1 }}
                                        onChange={props =>
                                            // eslint-disable-next-line react/prop-types
                                            actionDispatch({ type: 'systemAlertId', value: props.target.value })
                                        }
                                        value={actionState.systemAlertId}
                                        helperText={systemAlertError}
                                        error={!!systemAlertError}
                                    />
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button
                                id="report-display-button"
                                data-testid="report-display-button"
                                variant="contained"
                                disabled={
                                    !isValid || adminDashboardDisplayReportLoading || adminDashboardExportReportLoading
                                }
                                onClick={handleDisplayReportClick}
                            >
                                {adminDashboardDisplayReportLoading && (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                        id={'display-report-progress'}
                                        data-testid={'display-report-progress'}
                                        sx={{ mr: 1 }}
                                    />
                                )}
                                {txt.label.runReport}
                            </Button>
                            <Button
                                id="report-display-export-button"
                                data-testid="report-display-export-button"
                                variant="contained"
                                color="secondary"
                                disabled={!!!adminDashboardDisplayReportData}
                                sx={{ marginInlineStart: 1 }}
                                onClick={handleExportDisplayReportClick}
                            >
                                {txt.label.export}
                            </Button>
                        </Grid>
                    </Grid>
                    {!!adminDashboardDisplayReportData && (
                        <Grid container mt={2}>
                            <Grid item xs={12}>
                                <DataGrid
                                    rows={adminDashboardDisplayReportData}
                                    columns={columns ?? /* istanbul ignore next */ []}
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
