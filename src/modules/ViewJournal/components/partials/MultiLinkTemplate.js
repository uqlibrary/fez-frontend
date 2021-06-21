import React from 'react';
import PropTypes from 'prop-types';

import LinkTemplate from './LinkTemplate';

export const MultiLinkTemplate = ({ data, templateProps, fieldId }) => {
    return data.map(externalLink => {
        const { uniqueKey } = templateProps;
        return (
            <LinkTemplate
                key={`${fieldId}-link-${uniqueKey(externalLink)}`}
                fieldId={fieldId}
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
