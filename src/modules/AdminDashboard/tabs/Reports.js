/* eslint-disable no-unused-vars */
import React from 'react';

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

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import locale from 'locale/components';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

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
        value: 1,
        label: 'Works history',
    },
    {
        value: 2,
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

const Reports = () => {
    const txt = locale.components.adminDashboard.reports;
    const [exportReport, setExportReport] = React.useState(null);
    const [displayReport, setDisplayReport] = React.useState(null);
    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);

    const handleFilterChange = (action, props) => {
        console.log(action, props);
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
                </StandardCard>
            </Box>
        </LocalizationProvider>
    );
};

export default React.memo(Reports);
