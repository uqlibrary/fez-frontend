import React from 'react';
import PropTypes from 'prop-types';

import DefaultTemplate from './DefaultTemplate';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { makeStyles } from '@material-ui/core/styles';
import { formatUrlTextWithWbrTags as formatUrlText } from 'helpers/general';

export const useStyles = makeStyles(() => ({
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
}));

export const LinkTemplate = ({ data, templateProps, fieldId }) => {
    const classes = useStyles();
    const { href, title, text, format = false } = templateProps;
    const derivedText = text(data);
    const finalLinkText = format ? formatUrlText(derivedText) : derivedText;
    return (
        <DefaultTemplate
            fieldId={fieldId}
            data={
                <ExternalLink
                    href={href(data)}
                    title={title}
                    id={`${fieldId}-lookup`}
                    className={classes.wrappableExternalLink}
                >
                    {finalLinkText}
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
