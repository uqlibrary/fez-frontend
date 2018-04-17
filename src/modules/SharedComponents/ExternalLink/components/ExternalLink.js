import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

const ExternalLink = (props) => {
    const {className, children, openInNewIcon, ...rest} = props;
    const showIcon = openInNewIcon && ' showIcon';
    return (
        <a {...rest}
            className={className + ' externalLink ' + showIcon}
            tabIndex="0"
            title={rest.title || (openInNewIcon && locale.components.externalLink.openInNew)}>
            {!!children && children}
        </a>
    );
};

ExternalLink.propTypes = {
    className: PropTypes.string,
    openInNewIcon: PropTypes.bool,
    children: PropTypes.any,
};

ExternalLink.defaultProps = {
    className: 'externalLink',
    target: '_blank',
    rel: 'noopener noreferrer',
    openInNewIcon: true
};

export default ExternalLink;
