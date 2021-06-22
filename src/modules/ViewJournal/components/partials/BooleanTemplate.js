import React from 'react';
import PropTypes from 'prop-types';
import DefaultTemplate from './DefaultTemplate';

export const BooleanTemplate = ({ data, fieldId }) => (
    <DefaultTemplate fieldId={fieldId} data={data === '1' || data === true ? 'Yes' : 'No'} />
);

BooleanTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    fieldId: PropTypes.string,
};

export default React.memo(BooleanTemplate);
