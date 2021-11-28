import React from 'react';
import PropTypes from 'prop-types';

import DefaultTemplate from './DefaultTemplate';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const PrefixedLinkTemplate = ({ data, templateProps, fieldId }) => {
    const { href, title, text, prefix } = templateProps;
    return (
        <DefaultTemplate
            fieldId={fieldId}
            data={
                <React.Fragment>
                    {typeof prefix === 'function' && (
                        <span data-testid={`${fieldId}-link-prefix`} id={`${fieldId}-link-prefix`}>
                            {prefix(data)}
                            &nbsp;
                        </span>
                    )}
                    {text(data) && href(data) && (
                        <ExternalLink href={href(data)} title={title} id={`${fieldId}-lookup`}>
                            {text(data)}
                        </ExternalLink>
                    )}
                </React.Fragment>
            }
        />
    );
};

PrefixedLinkTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    templateProps: PropTypes.object,
    fieldId: PropTypes.string,
};

export default React.memo(PrefixedLinkTemplate);
