/* eslint-disable no-unused-vars */
import React from 'react';

import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import CircularProgress from '@mui/material/CircularProgress';
// import Typography from '@mui/material/Typography';

import locale from 'locale/components';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import SectionTitle from '../components/SectionTitle';

const reportData = [
    {
        id: 1,
        title: 'Wok ID dups',
        subtext:
            'List of records with matching ISI Loc with publication after 2007 where neither are in the dups collection',
    },
    {
        id: 2,
        title: 'Scopus ID Dups',
        subtext:
            'List of records with matching Scopus Id with publication after 2007 where neither are in the dups collection',
    },
    {
        id: 3,
        title: 'DOI Dups',
        subtext:
            'List of records with matching DOI’s with publication after 2007 where neither are in the dups collection',
    },
    {
        id: 4,
        title: 'UQ Incites Authors',
        subtext: 'Data to be uploaded to incites each quarter. Resave csv as xls before uploading.',
    },
];

const Reports = () => {
    const txt = locale.components.adminDashboard.reports;

    return (
        <>
            <StandardCard noHeader>
                <SectionTitle mb={2}>Export-only reports</SectionTitle>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            disablePortal
                            id="report-export-only"
                            options={reportData}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Report"
                                    data-testid="report-export-only"
                                    helperText={'Report will download direct to your device'}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li
                                    {...props}
                                    style={{
                                        flexDirection: 'column',
                                        justifyContent: 'left',
                                        alignItems: 'flex-start',
                                        fontWeight: 400,
                                    }}
                                >
                                    {option.title}
                                    <span style={{ fontSize: '14px', fontWeight: 200 }}>{option.subtext}</span>
                                </li>
                            )}
                            getOptionLabel={option => option.title}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button id="report-export-button" data-testid="report-export-button" variant="contained">
                            Export Report
                        </Button>
                    </Grid>
                </Grid>
            </StandardCard>
            <Box mt={2}>
                <StandardCard noHeader>
                    <SectionTitle mb={2}>Display reports</SectionTitle>
                    <Grid container>content</Grid>
                </StandardCard>
            </Box>
        </>
    );
};

export default React.memo(Reports);
