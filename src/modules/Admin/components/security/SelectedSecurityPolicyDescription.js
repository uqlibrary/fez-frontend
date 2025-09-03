import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import PolicyDescription from './PolicyDescription';

export const SelectedSecurityPolicyDescription = ({ title, selectedPolicyKey }) => (
    <Grid
        xs={12}
        style={{
            marginTop: 12,
            padding: 24,
            backgroundColor: 'rgba(0,0,0,0.05)',
        }}
    >
        <Typography variant="h6" style={{ marginTop: -8 }}>
            {title}
        </Typography>
        <Grid container spacing={1} style={{ marginTop: 8 }}>
            <Grid xs={2}>
                <b>Name (ID):</b>
            </Grid>
            <Grid xs={10}>
                <PolicyDescription selectedPolicyKey={selectedPolicyKey} />
            </Grid>
        </Grid>
    </Grid>
);

SelectedSecurityPolicyDescription.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    selectedPolicyKey: PropTypes.number,
};

export default React.memo(SelectedSecurityPolicyDescription);
