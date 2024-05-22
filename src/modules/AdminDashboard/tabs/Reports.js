/* eslint-disable no-unused-vars */
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
// import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import locale from 'locale/components';

import * as actions from 'actions';

import { DEFAULT_DATE_FORMAT } from '../config';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import SectionTitle from '../components/SectionTitle';

const exportReportOptions = [
    {
        value: 1,
        label: 'Wok ID dups',
        subtext:
            'List of records with matching ISI Loc with publication after 2007 where neither are in the dups collection',
    },
    {
        value: 2,
        label: 'Scopus ID Dups',
        subtext:
            'List of records with matching Scopus Id with publication after 2007 where neither are in the dups collection',
    },
    {
        value: 3,
        label: 'DOI Dups',
        subtext:
            'List of records with matching DOI’s with publication after 2007 where neither are in the dups collection',
    },
    {
        value: 4,
        label: 'UQ Incites Authors',
        subtext: 'Data to be uploaded to incites each quarter. Resave csv as xls before uploading.',
    },
];
const displayReportOptions = [
    {
        value: 'workshistory',
        label: 'Works history',
    },
    {
        value: 'systemalertlog',
        label: 'System alert log',
    },
];
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

const columns = (locale, report) => {
    const txt = locale.columns[report];
    switch (report) {
        case 'workshistory':
            return [
                {
                    field: 'date_created',
                    headerName: txt.dateCreated,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                },
                { field: 'pid', headerName: txt.pid, width: 150 },
                { field: 'work_type', headerName: txt.workType, flex: 1 },
                { field: 'user', headerName: txt.user, width: 150 },
                { field: 'topic', headerName: txt.action, flex: 1 },
            ];
        default:
            return [
                {
                    field: 'date_created',
                    headerName: txt.dateCreated,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                },
                { field: 'assigned_to', headerName: txt.assignedTo, width: 150 },
                {
                    field: 'assigned_date',
                    headerName: txt.assignedDate,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                },
                { field: 'title', headerName: txt.title, flex: 1 },
                { field: 'resolved_by', headerName: txt.resolvedBy, width: 150 },
                {
                    field: 'resolved_date',
                    headerName: txt.resolvedDate,
                    width: 150,
                    valueGetter: value => moment(value, 'DD/MM/YYYY hh:mm').format(DEFAULT_DATE_FORMAT),
                },
                { field: 'content', headerName: txt.content, flex: 1 },
                {
                    field: 'link',
                    headerName: txt.link,
                    flex: 1,
                    renderCell: row => (
                        <ExternalLink id={`link_${row.id}`} href={row.value} inline>
                            {row.value}
                        </ExternalLink>
                    ),
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
        adminDashboardDisplayReportSuccess,
        adminDashboardDisplayReportError,
    } = useSelector(state => state.get('adminDashboardDisplayReportReducer'));

    const isValid = React.useMemo(() => {
        if (!!displayReport) {
            setFromDateError('');
            setToDateError('');
            if (!!!fromDate && !!!toDate) return true;
            const mFrom = moment(fromDate);
            const mTo = moment(toDate);
            if (mFrom.isValid() && !mTo.isValid()) {
                setToDateError('Required');
                return false;
            } else if (mTo.isValid() && !mFrom.isValid()) {
                setFromDateError('Required');
                return false;
            } else if (mFrom.isValid() && mTo.isValid()) {
                if (!mFrom.isSameOrBefore(mTo)) {
                    setFromDateError('Must not be after "to" date');
                    return false;
                } else return true;
            }
            return false;
        }
        return false;
    }, [displayReport, fromDate, toDate]);

    const handleExportReportClick = () => {
        dispatch(actions.loadAdminDashboardExportReport({ id: exportReport.value }));
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
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            disablePortal
                            id={reportExportOnlyId}
                            options={exportReportOptions}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            renderOption={optionDoubleRowRender}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Report"
                                    helperText={'Report will download direct to your device'}
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
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            id="report-export-button"
                            data-testid="report-export-button"
                            variant="contained"
                            disabled={!!!exportReport}
                            onClick={handleExportReportClick}
                        >
                            Export Report
                        </Button>
                    </Grid>
                </Grid>
            </StandardCard>
            <Box mt={2}>
                <StandardCard noHeader>
                    <SectionTitle mb={2}>{txt.displayTitle}</SectionTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Autocomplete
                                disablePortal
                                id={reportDisplayExportId}
                                fullWidth
                                variant="standard"
                                options={displayReportOptions}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label={'Report'}
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
                                    label={'System alert ID'}
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
                                    label: 'From',
                                    'aria-label': 'From',
                                    'aria-labelledby': 'report-display-date-from-label',
                                    'data-analyticsid': 'report-display-date-from-input',
                                }}
                                label="From"
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
                                    label: 'To',
                                    'aria-label': 'To',
                                    'aria-labelledby': 'report-display-date-to-label',
                                    'data-analyticsid': 'report-display-date-to-input',
                                }}
                                label="To"
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
                                disabled={!isValid}
                                onClick={handleDisplayReportClick}
                            >
                                Run Report
                            </Button>
                            <Button
                                id="report-display-export-button"
                                data-testid="report-display-export-button"
                                variant="contained"
                                color="secondary"
                                disabled={!!!adminDashboardDisplayReportData}
                                sx={{ marginInlineStart: 1 }}
                            >
                                Export
                            </Button>
                        </Grid>
                    </Grid>
                    {!!displayReport && (
                        <Grid container mt={2}>
                            <Grid item xs={12}>
                                <DataGrid
                                    rows={adminDashboardDisplayReportData ?? []}
                                    columns={displayReport ? columns(txt, displayReport.value) : []}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
                                        },
                                    }}
                                    pageSizeOptions={[10, 25, 50, 100]}
                                    autoHeight
                                    loading={adminDashboardDisplayReportLoading}
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
