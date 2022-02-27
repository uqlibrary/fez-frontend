import React from 'react';
import PropTypes from 'prop-types';

import DefaultTemplate from './DefaultTemplate';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const EnclosedLinkTemplate = ({ data, templateProps, fieldId }) => {
    const { href, title, text, prefix, postfix } = templateProps;
    return (
        <DefaultTemplate
            fieldId={fieldId}
            data={
                <React.Fragment>
                    {typeof prefix === 'function' && prefix(data) && (
                        <span data-testid={`${fieldId}-link-prefix`} id={`${fieldId}-link-prefix`}>
                            {prefix(data)}
                        </span>
                    )}
                    {text(data) && href(data) && (
                        <ExternalLink href={href(data)} title={title} id={`${fieldId}-lookup`}>
                            {text(data)}
                        </ExternalLink>
                    )}
                    {typeof postfix === 'function' && postfix(data) && (
                        <span data-testid={`${fieldId}-link-postfix`} id={`${fieldId}-link-postfix`}>
                            {postfix(data)}
                        </span>
                    )}
                </React.Fragment>
            }
        />
    );
};

EnclosedLinkTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
    templateProps: PropTypes.object,
    fieldId: PropTypes.string,
};

export default React.memo(EnclosedLinkTemplate);
