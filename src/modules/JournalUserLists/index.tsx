import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { locale } from 'locale';
import Manager from './Manager';

const JournalUserLists = () => (
    <StandardPage title={locale.pages.journalUserLists.title}>
        <Grid container spacing={2}>
            <Grid size="grow">
                <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                    <Grid flexGrow={1}>
                        <Manager />
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    </StandardPage>
);

export default React.memo(JournalUserLists);
