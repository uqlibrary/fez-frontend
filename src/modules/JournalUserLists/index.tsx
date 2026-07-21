import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { locale } from 'locale';
import Manager from './Manager';

const JournalUserLists = () => (
    <StandardPage title={locale.pages.journalUserLists.title}>
        <Grid container spacing={2}>
            <div style={{ width: '100%' }}>
                <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flexGrow: 1 }}>
                        <Manager />
                    </div>
                </Paper>
            </div>
        </Grid>
    </StandardPage>
);

export default React.memo(JournalUserLists);
