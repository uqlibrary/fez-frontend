import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import OpenInNew from '@mui/icons-material/OpenInNew';
import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(() => ({
    externalLink: inline => ({
        ...(!inline && {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            display: 'inline-block',
        }),
        maxWidth: '100% !important',
        minWidth: 0,
        verticalAlign: 'bottom',
        cursor: 'pointer',
    }),
    externalLinkIcon: {
        color: 'inherit',
        fontSize: '0.66rem',
        display: 'inline-block',
        float: 'right',
        marginLeft: '0.25rem',
    },
}));

const ExternalLink = ({ children, className = '', height, openInNewIcon = true, width, inline = false, ...rest }) => {
    const classes = useStyles(inline);

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
        <a
            {...{
                ...rest,
                id: `${rest.id}-link`,
            }}
            data-analyticsid={`${rest.id}-link`}
            data-testid={`${rest.id}-link`}
            tabIndex={0}
            title={
                rest.title ||
                (openInNewIcon && locale.global.linkWillOpenInNewWindow.replace('[destination]', rest.href)) ||
                undefined
            }
            className={[className, classes.externalLink].filter(Boolean).join(' ')}
        >
            {!!inline ? (
                <>
                    {!!children && children}
                    {openInNewIcon && (
                        <OpenInNew className={classes.externalLinkIcon} id={`${rest.id}-link-new-window-icon`} />
                    )}
                </>
            ) : (
                <>
                    {openInNewIcon && (
                        <OpenInNew className={classes.externalLinkIcon} id={`${rest.id}-link-new-window-icon`} />
                    )}
                    {!!children && children}
                </>
            )}
        </a>
    );
};

ExternalLink.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    height: PropTypes.number,
    openInNewIcon: PropTypes.bool,
    rel: PropTypes.string,
    width: PropTypes.number,
    id: PropTypes.string.isRequired,
    inline: PropTypes.bool,
};

export default ExternalLink;
