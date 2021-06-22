import React from 'react';
import PropTypes from 'prop-types';
import DefaultTemplate from './DefaultTemplate';

export const MultiValueTemplate = ({ data, templateProps, fieldId }) => {
    return data.map((item, index) => (
        <DefaultTemplate data={templateProps.getData(item)} key={index} fieldId={`${fieldId}-${index}`} />
    ));
};

MultiValueTemplate.propTypes = {
    data: PropTypes.array,
    fieldId: PropTypes.string,
    templateProps: PropTypes.object,
};

export default MultiValueTemplate;
