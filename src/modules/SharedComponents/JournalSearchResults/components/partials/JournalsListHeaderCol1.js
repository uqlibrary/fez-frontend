import React from 'react';
import Grid from '@material-ui/core/Grid';
import { JournalFieldsMap } from './JournalFieldsMap';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';

const JournalsListHeaderCol1 = () => {
    return (
        <Grid
            container
            spacing={0}
            id="journal-list-header-1"
            alignItems="center"
            style={{
                width: '101%',
                height: 32,
                borderBottom: '1px solid #CCC',
                marginBottom: 6,
            }}
        >
            <Grid item xs="auto" id="journal-list-header-select" style={{ height: 32 }}>
                <Checkbox disabled style={{ padding: 2, paddingTop: 0, marginTop: -6, opacity: 0 }} />
            </Grid>
            <Grid item xs id="journal-list-header-title" style={{ height: 32, paddingLeft: 4 }}>
                <InputLabel shrink style={{ fontWeight: 600 }}>
                    {JournalFieldsMap[0].label}
                </InputLabel>
            </Grid>
        </Grid>
    );
};

export default React.memo(JournalsListHeaderCol1);
