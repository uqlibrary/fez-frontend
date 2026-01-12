import React from 'react';
import PropTypes from 'prop-types';

import DefaultTemplate from './DefaultTemplate';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { formatUrlTextWithWbrTags as formatUrlText } from 'helpers/general';

const classes = {
    wrappableExternalLink: {
        overflow: 'visible !important',
        textOverflow: 'clip !important',
        overflowWrap: 'break-word',
        wordBreak: 'break-word !important',
        whiteSpace: 'normal !important',
        maxWidth: '100% !important',
        minWidth: 0,
        display: 'inline-block',
        verticalAlign: 'bottom',
        cursor: 'pointer',
    },
};

export const LinkTemplate = ({ data, templateProps, fieldId }) => {
    const { href, title, ariaLabel, text, format = false } = templateProps;
    const derivedText = text(data);
    const finalLinkText = format ? formatUrlText(derivedText) : derivedText;
    return (
        <DefaultTemplate
            fieldId={fieldId}
            data={
                !!href(data) ? (
                    <ExternalLink
                        href={href(data)}
                        title={title}
                        aria-label={ariaLabel && ariaLabel(data)}
                        id={`${fieldId}-lookup`}
                        sx={{ ...classes.wrappableExternalLink }}
                    >
                        {finalLinkText}
                    </ExternalLink>
                ) : (
                    derivedText
                )
            }
        />
    );
};

LinkTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
    templateProps: PropTypes.object,
    fieldId: PropTypes.string,
};

export default React.memo(LinkTemplate);
