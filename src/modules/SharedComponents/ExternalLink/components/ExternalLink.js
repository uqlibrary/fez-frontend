import React from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    externalLink: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        overflowWrap: 'break-word',
        wordBreak: 'break-all',
        whiteSpace: 'nowrap',
        maxWidth: '100% !important',
        minWidth: 0,
        display: 'inline-block',
        verticalAlign: 'bottom',
        cursor: 'pointer',
    },
    externalLinkIcon: {
        color: 'inherit',
        fontSize: '0.66rem',
        display: 'inline-block',
        float: 'right',
        marginLeft: '0.25rem',
    },
}));

const ExternalLink = ({ children, className = '', height, openInNewIcon = true, width, ...rest }) => {
    const classes = useStyles();

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
            data-testid={`${rest.id}-link`}
            tabIndex="0"
            title={
                rest.title ||
                (openInNewIcon && locale.global.linkWillOpenInNewWindow.replace('[destination]', rest.href)) ||
                undefined
            }
            className={[className, classes.externalLink].filter(Boolean).join(' ')}
        >
            {openInNewIcon && <OpenInNew className={classes.externalLinkIcon} id={`${rest.id}-link-new-window-icon`} />}
            {!!children && children}
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
};

export default ExternalLink;
