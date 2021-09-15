import React from 'react';
import PropTypes from 'prop-types';

import DefaultTemplate from './DefaultTemplate';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const LinkTemplate = ({ data, templateProps, fieldId }) => {
    const { href, title, text } = templateProps;
    return (
        <DefaultTemplate
            fieldId={fieldId}
            data={
                <ExternalLink href={href(data)} title={title} id={`${fieldId}-lookup`}>
                    {text(data)}
                </ExternalLink>
            }
        />
    );
};

LinkTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    templateProps: PropTypes.object,
    fieldId: PropTypes.string,
};

export default React.memo(LinkTemplate);
