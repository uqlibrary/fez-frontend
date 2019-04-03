import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { PolicyDescription } from './PolicyDescription';

export const InheritedSecurityDetails = () => (
    <Grid item xs={12} style={{
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.05)'
    }}>
        <Typography variant="h6" style={{ marginTop: -8 }}>
            Inherited security policy details
        </Typography>
        <Grid container spacing={8} style={{ marginTop: 8 }}>
            <Grid item xs={2}><b>Collection:</b></Grid>
            <Grid item xs={5}>UQ:12345</Grid>
            <Grid item xs={5}>UQ:67890</Grid>
            <Grid item xs={2}><b>Policy:</b></Grid>
            <Grid item xs={5}><PolicyDescription selectedPolicyKey={2} /></Grid>
            <Grid item xs={5}><PolicyDescription selectedPolicyKey={3} /></Grid>
        </Grid>
    </Grid>
);

export default InheritedSecurityDetails;

