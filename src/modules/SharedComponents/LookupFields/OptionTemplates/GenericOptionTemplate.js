import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';

export const GenericOptionTemplate = ({ option: { value: primaryText, id: secondaryText } }) => (
    <Grid container>
        <Grid item xs={12}>
            <Typography variant="body1" color="textPrimary">
                {primaryText}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
                {secondaryText}
            </Typography>
        </Grid>
    </Grid>
);

GenericOptionTemplate.propTypes = {
    option: PropTypes.object,
};

export default React.memo(GenericOptionTemplate);
