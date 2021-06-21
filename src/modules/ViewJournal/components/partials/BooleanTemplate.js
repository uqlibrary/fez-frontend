import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export const BooleanTemplate = ({ data }) => (
    <Typography variant="body2">{data === '1' || data === true ? 'Yes' : 'No'}</Typography>
);

BooleanTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default React.memo(BooleanTemplate);
