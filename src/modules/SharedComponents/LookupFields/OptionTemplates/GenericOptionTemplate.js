import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
