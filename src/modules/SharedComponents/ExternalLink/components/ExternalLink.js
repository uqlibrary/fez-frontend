import React from 'react';
import PropTypes from 'prop-types';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';

class ExternalLink extends React.Component {
    static propTypes = {
        linkText: PropTypes.string,
        linkUrl: PropTypes.string.isRequired,
        children: PropTypes.any,
        className: PropTypes.string,
        linkTooltip: PropTypes.string,
        target: PropTypes.string,
        rel: PropTypes.string,
        ariaLabel: PropTypes.string,
        externalLinkIcon: PropTypes.bool
    };

    static defaultProps = {
        className: 'externalLink',
        target: '_blank',
        rel: 'noopener noreferrer',
        externalLinkIcon: true
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {linkText, linkUrl, linkTooltip, className, target, rel, ariaLabel, children, externalLinkIcon} = this.props;

        return (
            <a
                href={linkUrl}
                className={className}
                target={target}
                rel={rel}
                title={linkTooltip}
                aria-label={ariaLabel}
            >
                {
                    linkText !== '' && linkText !== null && linkText !== undefined &&
                    linkText
                }
                {
                    !linkText && children && children
                }
                {
                    externalLinkIcon &&
                    <ActionOpenInNew className="openExternalUrlIcon"/>
                }
            </a>
        );
    }
}

export default ExternalLink;
