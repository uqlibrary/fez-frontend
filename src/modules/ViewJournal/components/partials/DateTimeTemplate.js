import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';

export const DateTimeTemplate = ({ data, templateProps, fieldId }) => {
    const { format } = templateProps;
    return (
        <Typography variant="body2" id={fieldId} data-testid={fieldId}>
            {moment(String(data)).isValid && moment(String(data)).format(format)}
        </Typography>
    );
};

DateTimeTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
    templateProps: PropTypes.object,
    fieldId: PropTypes.string,
};

export default React.memo(DateTimeTemplate);
