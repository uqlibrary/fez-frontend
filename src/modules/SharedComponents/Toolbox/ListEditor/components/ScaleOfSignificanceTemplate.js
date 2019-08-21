import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { SIGNIFICANCE_MAP } from 'config/general';
export const ScaleOfSignificanceTemplate = ({ item }) => (
    <React.Fragment>
        <Grid container>
            <Grid item xs={12} md={3}>
                <Typography variant="body2">{SIGNIFICANCE_MAP[item.key] || 'Missing'}</Typography>
            </Grid>
            <Grid item xs={12} md={9}>
                <Typography variant="body2">{item.value.plainText}</Typography>
            </Grid>
        </Grid>
    </React.Fragment>
);

ScaleOfSignificanceTemplate.propTypes = {
    item: PropTypes.object,
};
