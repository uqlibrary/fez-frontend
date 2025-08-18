import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

export const DefaultTemplate = ({ data, fieldId }) => {
    return (
        <Typography variant="body2" component={'div'} id={`${fieldId}-value`} data-testid={`${fieldId}-value`}>
            {data}
        </Typography>
    );
};

DefaultTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
    fieldId: PropTypes.string,
};

export default DefaultTemplate;
