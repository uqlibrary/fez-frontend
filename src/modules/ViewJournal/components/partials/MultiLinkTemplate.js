import React from 'react';
import PropTypes from 'prop-types';

import LinkTemplate from './LinkTemplate';

export const MultiLinkTemplate = ({ data, templateProps, fieldId }) => {
    return data.map((externalLink, index) => {
        return (
            <LinkTemplate
                key={`${fieldId}-${index}`}
                fieldId={`${fieldId}-${index}`}
                data={externalLink}
                templateProps={templateProps}
            />
        );
    });
};

MultiLinkTemplate.propTypes = {
    data: PropTypes.any,
};

export default MultiLinkTemplate;
