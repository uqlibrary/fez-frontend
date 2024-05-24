/* eslint-disable no-unused-vars */
import React, { useReducer } from 'react';
// import PropTypes from 'prop-types';

import moment from 'moment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import locale from 'locale/components';

import * as actions from 'actions';
import { getFileName } from 'actions/exportPublicationsDataTransformers';

import { DEFAULT_DATE_FORMAT } from '../config';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import SectionTitle from '../components/SectionTitle';

const reportExportOnlyId = 'report-export-only';
const reportDisplayExportId = 'report-display-export';

const optionDoubleRowRender = (props, option) => (
    <li
        {...props}
        style={{
            flexDirection: 'column',
            justifyContent: 'left',
            alignItems: 'flex-start',
            fontWeight: 400,
        }}
    >
        <Typography variant="body1" color="textPrimary">
            {option.label}
        </Typography>
        <Typography variant="body1" color="textSecondary">
            {option.subtext}
        </Typography>
    </li>
);

const getColumns = (locale, report) => {
    const txt = locale.columns[report];
    switch (report) {
        case 'workshistory':
            return [
                { field: 'id', order: 0 },
                {
                    field: 'date_created',
                    headerName: txt.dateCreated,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                    order: 2,
                },
                { field: 'pid', headerName: txt.pid, width: 150, order: 1 },
                { field: 'work_type', headerName: txt.workType, minWidth: 300, flex: 1, order: 3 },
                { field: 'user', headerName: txt.user, width: 150, order: 4 },
                { field: 'topic', headerName: txt.action, minWidth: 400, flex: 1, order: 5 },
            ];
        default:
            return [
                { field: 'id', order: 0 },
                {
                    field: 'date_created',
                    headerName: txt.dateCreated,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                    order: 1,
                },
                { field: 'assigned_to', headerName: txt.assignedTo, width: 150, order: 2 },
                {
                    field: 'assigned_date',
                    headerName: txt.assignedDate,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                    order: 3,
                },
                { field: 'title', headerName: txt.title, minWidth: 400, flex: 1, order: 6 },
                { field: 'resolved_by', headerName: txt.resolvedBy, width: 150, order: 4 },
                {
                    field: 'resolved_date',
                    headerName: txt.resolvedDate,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                    order: 5,
                },
                { field: 'content', headerName: txt.content, minWidth: 400, flex: 1, order: 8 },
                {
                    field: 'link',
                    headerName: txt.link,
                    minWidth: 400,
                    flex: 1,
                    renderCell: row => (
                        <ExternalLink id={`link_${row.id}`} href={row.value} inline>
                            {row.value}
                        </ExternalLink>
                    ),
                    order: 9,
                },
            ];
    }
};

const Reports = () => {
    const txt = locale.components.adminDashboard.reports;

    const dispatch = useDispatch();

    const [exportReport, setExportReport] = React.useState(null);
    const [displayReport, setDisplayReport] = React.useState(null);
    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);
    const [fromDateError, setFromDateError] = React.useState('');
    const [toDateError, setToDateError] = React.useState('');
    const [systemAlertId, setSystemAlertId] = React.useState('');

    const {
        adminDashboardDisplayReportData,
        adminDashboardDisplayReportLoading,
        adminDashboardDisplayReportError,
    } = useSelector(state => state.get('adminDashboardDisplayReportReducer'));
    const { adminDashboardExportReportLoading, adminDashboardExportReportError } = useSelector(state =>
        state.get('adminDashboardExportReportReducer'),
    );

    const isValid = React.useMemo(() => {
        if (!!displayReport) {
            setFromDateError('');
            setToDateError('');
            if (!!!fromDate && !!!toDate) return true;
            const mFrom = moment(fromDate);
            const mTo = moment(toDate);
            if (mFrom.isValid() && !mTo.isValid()) {
                setToDateError(txt.error.required);
                return false;
            } else if (mTo.isValid() && !mFrom.isValid()) {
                setFromDateError(txt.error.required);
                return false;
            } else if (mFrom.isValid() && mTo.isValid()) {
                if (!mFrom.isSameOrBefore(mTo)) {
                    setFromDateError(txt.error.dateNotAfter);
                    return false;
                } else return true;
            }
            return false;
        }
        return false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayReport, fromDate, toDate]);

    const columns = React.useMemo(() => {
        return !!displayReport ? getColumns(txt, displayReport.value) : [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayReport]);

    const handleExportReportClick = () => {
        dispatch(
            actions.loadAdminDashboardExportReport({
                id: exportReport.value,
                export_to: 'excel',
            }),
        )
            .then(() => {
                //! adminDashboardExportReportError && dispatch(actions.clearAdminDashboardExportReport());
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleExportDisplayReportClick = () => {
        const worksheet = XLSX.utils.json_to_sheet(adminDashboardDisplayReportData);
        const workbook = XLSX.utils.book_new();
        const colHeaders = columns.sort((a, b) => a.order > b.order).map(col => col.headerName);
        XLSX.utils.sheet_add_aoa(worksheet, [colHeaders], {
            origin: 'A1',
        });
        XLSX.utils.book_append_sheet(workbook, worksheet, displayReport.label);

        const fname = getFileName('xlsx');
        XLSX.writeFileXLSX(workbook, fname);
    };

    const handleDisplayReportClick = () => {
        if (isValid) {
            const request = {
                id: displayReport.value,
                ...(!!fromDate ? { dateFrom: fromDate } : {}),
                ...(!!toDate ? { dateTo: toDate } : {}),
                ...(displayReport.value === 'systemalertlog' && !!systemAlertId ? { alertId: systemAlertId } : {}),
            };
            dispatch(actions.loadAdminDashboardDisplayReport(request));
        }
    };

    const handleDisplayReportChange = value => {
        setDisplayReport(value);
        dispatch(actions.clearAdminDashboardDisplayReport());
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-au">
            <StandardCard noHeader>
                <SectionTitle mb={2}>{txt.exportTitle}</SectionTitle>

                <Grid container spacing={2}>
                    {adminDashboardExportReportError && (
                        <Grid item xs={12}>
                            <Alert type="error_outline" title={txt.error.title} message={txt.error.general} />
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
                                    }}
                                    InputLabelProps={{
                                        'data-testid': `${reportExportOnlyId}-label`,
                                    }}
                                />
                            )}
                            ListboxProps={{
                                id: `${reportExportOnlyId}-options`,
                                'data-analyticsid': `${reportExportOnlyId}-options`,
                                'data-testid': `${reportExportOnlyId}-options`,
                            }}
                            value={exportReport}
                            onChange={(_, value) => setExportReport(value)}
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
                                !!!exportReport ||
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
                        {adminDashboardDisplayReportError && (
                            <Grid item xs={12}>
                                <Alert type="error_outline" title={txt.error.title} message={txt.error.general} />
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
                                        }}
                                    />
                                )}
                                ListboxProps={{
                                    id: `${reportDisplayExportId}-options`,
                                    'data-analyticsid': `${reportDisplayExportId}-options`,
                                    'data-testid': `${reportDisplayExportId}-options`,
                                }}
                                value={displayReport}
                                onChange={(_, value) => handleDisplayReportChange(value)}
                            />
                            {displayReport?.value === 'systemalertlog' && (
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
                                    }}
                                    sx={{ mt: 1 }}
                                    // eslint-disable-next-line react/prop-types
                                    onChange={props => setSystemAlertId(props.target.value)}
                                    value={systemAlertId}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                inputProps={{
                                    id: 'report-display-date-from-input',
                                    'data-testid': 'report-display-date-from-input',
                                    label: txt.label.dateFrom,
                                    'aria-label': txt.label.dateFrom,
                                    'aria-labelledby': 'report-display-date-from-label',
                                    'data-analyticsid': 'report-display-date-from-input',
                                }}
                                label={txt.label.dateFrom}
                                value={fromDate}
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
                                onChange={props => setFromDate(!!props ? moment(props).format() : null)}
                                defaultValue=""
                                disableFuture
                                maxDate={toDate}
                                disabled={!!!displayReport}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                                value={toDate}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        fullWidth
                                        error={!!toDateError}
                                        required={!!fromDate}
                                        helperText={toDateError}
                                    />
                                )}
                                // eslint-disable-next-line react/prop-types
                                onChange={props => setToDate(!!props ? moment(props).format() : null)}
                                defaultValue=""
                                disableFuture
                                minDate={fromDate}
                                disabled={!!!displayReport}
                            />
                        </Grid>
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
                                    columns={columns ?? []}
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
