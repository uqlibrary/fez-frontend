import React from 'react';
import Grid from '@mui/material/Grid';
import ColumnTitle from '../partials/ColumnTitle';
import { default as locale } from 'locale/components';

export const AuthorHeader = () => {
    const {
        header: {
            columns: { displayName, uqUsername },
        },
    } = locale.components.manageAuthors;
    return (
        <Grid container>
            <Grid item xs={6}>
                <ColumnTitle {...displayName} />
            </Grid>
            <Grid item xs={6}>
                <ColumnTitle {...uqUsername} />
            </Grid>
        </Grid>
    );
};

export default React.memo(AuthorHeader);
