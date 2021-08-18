import React from 'react';
import Grid from '@material-ui/core/Grid';
import ColumnTitle from '../partials/ColumnTitle';
import { default as locale } from 'locale/components';

export const UserDetailsHeader = () => {
    const {
        header: {
            columns: { id, fullName, username, email, status, isAdmin, isSuperAdmin },
        },
    } = locale.components.manageUsers;
    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <ColumnTitle {...id} />
            </Grid>
            <Grid item xs={2}>
                <ColumnTitle {...fullName} />
            </Grid>
            <Grid item xs={2}>
                <ColumnTitle {...username} />
            </Grid>
            <Grid item xs={3}>
                <ColumnTitle {...email} />
            </Grid>
            <Grid item xs={1}>
                <ColumnTitle {...status} />
            </Grid>
            <Grid item xs={1}>
                <ColumnTitle {...isAdmin} />
            </Grid>
            <Grid item xs={1}>
                <ColumnTitle {...isSuperAdmin} />
            </Grid>
        </Grid>
    );
};

export default React.memo(UserDetailsHeader);
