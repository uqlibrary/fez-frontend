import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

export const DefaultTemplate = ({ data, fieldId }) => {
    return (
        <Typography variant="body2" id={`${fieldId}-value`} data-testid={`${fieldId}-value`}>
            {data}
        </Typography>
    );
};

DefaultTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fieldId: PropTypes.string,
};

export default DefaultTemplate;
