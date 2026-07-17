import React from 'react';
import Grid from '@mui/material/GridLegacy';
import Paper from '@mui/material/Paper';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Manager from 'modules/JournalUserLists/Manager';
import { locale } from 'locale';

const JournalUserLists = () => {
    return (
        <StandardPage title={locale.pages.journalUserLists.title}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <div style={{ width: '100%' }}>
                        <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ flexGrow: 1 }}>
                                <Manager />
                            </div>
                        </Paper>
                    </div>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(JournalUserLists);
