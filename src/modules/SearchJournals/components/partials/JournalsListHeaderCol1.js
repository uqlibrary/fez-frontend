import React from 'react';
import Grid from '@material-ui/core/Grid';
import { JournalFieldsMap } from './JournalFieldsMap';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';

const JournalsListHeaderCol1 = () => {
    return (
        <Grid
            container
            spacing={1}
            id="journal-list-header-1"
            alignItems="center"
            style={{ width: JournalFieldsMap[0].size }}
        >
            <Grid item xs="auto" id="journal-list-header-select">
                <Checkbox disabled style={{ padding: 2 }} />
            </Grid>
            <Grid item xs id="journal-list-header-title">
                <InputLabel shrink>{JournalFieldsMap[0].label}</InputLabel>
            </Grid>
        </Grid>
    );
};

export default React.memo(JournalsListHeaderCol1);
