import React from 'react';
import PropTypes from 'prop-types';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

const ExternalLink = (props) => {
    const {className, children, openInNewIcon, ...rest} = props;

    return (
        <a {...rest} className={className} tabIndex="0">
            {!!children && children}
            {
                openInNewIcon &&
                <ActionOpenInNew className="openExternalUrlIcon"/>
            }
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
