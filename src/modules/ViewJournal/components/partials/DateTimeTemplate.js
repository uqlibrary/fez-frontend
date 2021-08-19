import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import DefaultTemplate from './DefaultTemplate';

export const DateTimeTemplate = ({ data, templateProps, fieldId }) => {
    const { format } = templateProps;
    return (
        <DefaultTemplate
            fieldId={fieldId}
            data={moment(new Date(String(data))).isValid && moment(new Date(String(data))).format(format)}
        />
    );
};

DateTimeTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
    templateProps: PropTypes.object,
    fieldId: PropTypes.string,
};

export default React.memo(DateTimeTemplate);
