import React from 'react';
import Grid from '@material-ui/core/Grid';
import ColumnTitle from '../partials/ColumnTitle';

export const AuthorHeader = () => {
    return (
        <Grid container>
            <Grid item xs={6}>
                <ColumnTitle title="Display Name" />
            </Grid>
            <Grid item xs={6}>
                <ColumnTitle title="UQ Username" />
            </Grid>
        </Grid>
    );
};

export default React.memo(AuthorHeader);
