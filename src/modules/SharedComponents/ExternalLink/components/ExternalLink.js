import React from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

const ExternalLink = (props) => {
    const {className, children, openInNewIcon, ...rest} = props;
    return (
        <a {...rest}
            className={className + (openInNewIcon && ' showIcon') + ' externalLink'}
            tabIndex="0"
            title={openInNewIcon && locale.components.externalLink.openInNew}
        >
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
