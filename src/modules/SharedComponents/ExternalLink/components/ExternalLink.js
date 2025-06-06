import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { locale } from 'locale';
import OpenInNew from '@mui/icons-material/OpenInNew';

const StyledLink = styled('a', {
    shouldForwardProp: prop => prop !== 'inline' && prop !== 'sx',
})(({ inline }) => ({
    ...(!inline && {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflowWrap: 'break-word',
        wordBreak: 'break-all',
        display: 'inline-block',
    }),
    maxWidth: '100%',
    minWidth: 0,
    verticalAlign: 'bottom',
    cursor: 'pointer',
}));

const internalClasses = {
    externalLinkIcon: {
        color: 'inherit',
        fontSize: '0.66rem',
        display: 'inline-block',
        float: 'right',
        marginLeft: '0.25rem',
    },
};

const ExternalLink = ({
    children,
    className = '',
    openInNewIcon = true,
    height = null,
    width = null,
    inline = false,
    ...rest
}) => {
    const openInSizedWindow = (link, width, height) => () =>
        window.open(
            link,
            'targetWindow',
            'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=yes,' +
                ` width=${width}, height=${height}, top=100, left=100`,
        );

    delete rest.theme;
    if (!!height && !!width) {
        rest.onClick = openInSizedWindow(rest.href, width, height);
        delete rest.href;
        delete rest.target;
        delete rest.rel;
    } else {
        rest.rel ||= 'noopener noreferrer';
        rest.target ||= '_blank';
    }

    return (
        <StyledLink
            {...rest}
            tabIndex={0}
            title={
                rest.title ||
                (openInNewIcon && locale.global.linkWillOpenInNewWindow.replace('[destination]', rest.href)) ||
                undefined
            }
            inline={inline}
            className={className}
            id={`${rest.id}-link`}
            data-analyticsid={`${rest.id}-link`}
            data-testid={`${rest.id}-link`}
        >
            {!!inline ? (
                <>
                    {!!children && children}
                    {openInNewIcon && (
                        <OpenInNew
                            sx={{ ...internalClasses.externalLinkIcon }}
                            id={`${rest.id}-link-new-window-icon`}
                        />
                    )}
                </>
            ) : (
                <>
                    {openInNewIcon && (
                        <OpenInNew
                            sx={{ ...internalClasses.externalLinkIcon }}
                            id={`${rest.id}-link-new-window-icon`}
                        />
                    )}
                    {!!children && children}
                </>
            )}
        </StyledLink>
    );
};

ExternalLink.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    openInNewIcon: PropTypes.bool,
    rel: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    id: PropTypes.string.isRequired,
    inline: PropTypes.bool,
};

export default ExternalLink;
