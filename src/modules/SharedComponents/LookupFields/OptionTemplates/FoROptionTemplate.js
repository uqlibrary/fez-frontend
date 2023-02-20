import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

export const FoROptionTemplate = ({ option }) => (
    <Typography variant="body2" color="textPrimary">
        {option.value}
    </Typography>
);

FoROptionTemplate.propTypes = {
    option: PropTypes.object,
};

export default React.memo(FoROptionTemplate);
