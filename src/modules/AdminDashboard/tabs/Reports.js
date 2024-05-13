/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { useSelector } from 'react-redux';
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

import { DEFAULT_DATE_FORMAT } from '../config';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import SectionTitle from '../components/SectionTitle';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

const adminDashboardReportWorksData = [
    {
        id: 1,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 2,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 3,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 4,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 5,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 6,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
];
const adminDashboardReportSystemAlertsData = [
    {
        id: 1,
        date_created: '9/4/2024 10:44',
        assigned_to: 'Michael Feeney',
        assigned_date: '9/4/2024 10:44',
        resolved_by: 'Elizabeth Alvey',
        resolved_date: '9/4/2024 10:44',
        title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        id: 2,
        date_created: '9/4/2024 10:44',
        assigned_to: 'Michael Feeney',
        assigned_date: '9/4/2024 10:44',
        resolved_by: 'Elizabeth Alvey',
        resolved_date: '9/4/2024 10:44',
        title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        id: 3,
        date_created: '9/4/2024 10:44',
        assigned_to: 'Michael Feeney',
        assigned_date: '9/4/2024 10:44',
        resolved_by: 'Elizabeth Alvey',
        resolved_date: '9/4/2024 10:44',
        title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        id: 4,
        date_created: '9/4/2024 10:44',
        assigned_to: 'Michael Feeney',
        assigned_date: '9/4/2024 10:44',
        resolved_by: 'Elizabeth Alvey',
        resolved_date: '9/4/2024 10:44',
        title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        id: 5,
        date_created: '9/4/2024 10:44',
        assigned_to: 'Michael Feeney',
        assigned_date: '9/4/2024 10:44',
        resolved_by: 'Elizabeth Alvey',
        resolved_date: '9/4/2024 10:44',
        title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        id: 6,
        date_created: '9/4/2024 10:44',
        assigned_to: 'Michael Feeney',
        assigned_date: '9/4/2024 10:44',
        resolved_by: 'Elizabeth Alvey',
        resolved_date: '9/4/2024 10:44',
        title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        id: 7,
        date_created: '9/4/2024 10:44',
        assigned_to: 'Michael Feeney',
        assigned_date: '9/4/2024 10:44',
        resolved_by: 'Elizabeth Alvey',
        resolved_date: '9/4/2024 10:44',
        title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
];

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
    const [exportReport, setExportReport] = React.useState(null);
    const [displayReport, setDisplayReport] = React.useState(null);
    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);

    const handleFilterChange = (action, props) => {
        switch (action) {
            case 'filterDateFrom':
                // eslint-disable-next-line react/prop-types
                setFromDate(props.format());
                break;
            default:
                // eslint-disable-next-line react/prop-types
                setToDate(props.format());
        }
    };

    const isValid = () => {
        if (!!displayReport) {
            if ((!!fromDate && !!toDate) || (!!!fromDate && !!!toDate)) return true;
        }
        return false;
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
                            disabled={!isValid()}
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
                                onChange={(_, value) => setDisplayReport(value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DatePicker
                                inputProps={{
                                    id: 'report-display-date-from-input',
                                    'data-testid': 'report-display-date-from-input',
                                    label: 'From',
                                    'aria-label': 'From',
                                    'aria-labelledby': 'report-display-date-from-label',
                                }}
                                label="From"
                                value={fromDate}
                                renderInput={params => <TextField {...params} variant="standard" fullWidth />}
                                onChange={props => handleFilterChange('filterDateFrom', props)}
                                defaultValue=""
                                disableFuture
                                maxDate={toDate}
                                slotProps={{
                                    textField: {
                                        isRequired: !!toDate && !!!fromDate,
                                        helperText: !!toDate && !!!fromDate ? 'Required' : '',
                                    },
                                }}
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
                                }}
                                label="To"
                                value={toDate}
                                renderInput={params => <TextField {...params} variant="standard" fullWidth />}
                                onChange={props => handleFilterChange('filterDateTo', props)}
                                defaultValue=""
                                disableFuture
                                minDate={fromDate}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                id="report-display-button"
                                data-testid="report-display-button"
                                variant="contained"
                                disabled={!!!displayReport}
                            >
                                Run Report
                            </Button>
                            <Button
                                id="report-display-export-button"
                                data-testid="report-display-export-button"
                                variant="contained"
                                color="secondary"
                                disabled
                                sx={{ marginInlineStart: 1 }}
                            >
                                Export
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container mt={2}>
                        <Grid item xs={12}>
                            <DataGrid
                                rows={adminDashboardReportSystemAlertsData ?? []}
                                columns={displayReport ? columns(txt, displayReport.value) : []}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[10, 25, 50, 100]}
                                autoHeight
                            />
                        </Grid>
                    </Grid>
                </StandardCard>
            </Box>
        </LocalizationProvider>
    );
};

export default React.memo(Reports);
