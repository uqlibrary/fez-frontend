import React from 'react';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';

const JournalsListHeaderCol3 = () => {
    return (
        <Grid container spacing={1} id="journal-list-header-1" alignItems="center">
            <Grid item xs id="journal-list-header-title">
                <InputLabel shrink>Actions</InputLabel>
            </Grid>
        </Grid>
    );
};

export default React.memo(JournalsListHeaderCol3);
