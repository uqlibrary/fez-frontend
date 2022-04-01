import React from 'react';
import PropTypes from 'prop-types';

import DefaultTemplate from './DefaultTemplate';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { makeStyles } from '@material-ui/core/styles';
import ReactHtmlParser from 'react-html-parser';

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

/**
 * Insert line break opportunities into a URL
 */
const formatUrlText = url => {
    // Split the URL into an array to distinguish double slashes from single slashes
    const doubleSlash = url.split('//');

    // Format the strings on either side of double slashes separately
    const formatted = doubleSlash
        .map(
            str =>
                // Insert a word break opportunity after a colon
                str
                    .replace(/(?<after>:)/giu, '$1<wbr>')
                    // Before a single slash, tilde, period, comma, hyphen,
                    // underline, question mark, number sign, or percent symbol
                    .replace(/(?<before>[/~.,\-_?#%])/giu, '<wbr>$1')
                    // Before and after an equals sign or ampersand
                    .replace(/(?<beforeAndAfter>[=&])/giu, '<wbr>$1<wbr>'),
            // Reconnect the strings with word break opportunities after double slashes
        )
        .join('//<wbr>');

    return ReactHtmlParser(formatted);
};

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
