import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

export const LinkInfoTemplate = ({ item }) => (
    <React.Fragment>
        <Typography variant="body2">
            <strong>{'Link: '}</strong>
            {item.key}
        </Typography>
        <Typography variant="caption">
            <strong>{'Description: '}</strong>
            {item.value}
        </Typography>
    </React.Fragment>
);

LinkInfoTemplate.propTypes = {
    item: PropTypes.object,
};
