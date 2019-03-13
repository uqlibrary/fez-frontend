import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { withStyles } from '@material-ui/core/styles';

const styles = {
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
    },
    externalLinkIcon: {
        color: 'inherit',
        fontSize: '0.66rem',
        display: 'inline-block',
        float: 'right',
        marginLeft: '0.25rem'
    }
};

export class ExternalLink extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        openInNewIcon: PropTypes.bool,
        children: PropTypes.any,
        classes: PropTypes.object.isRequired
    };

    static defaultProps = {
        className: '',
        target: '_blank',
        rel: 'noopener noreferrer',
        openInNewIcon: true,
        classes: {}
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { className, children, openInNewIcon, classes, ...rest } = this.props;
        return (
            <a {...rest}
                tabIndex="0"
                title={
                    rest.title ||
                    (
                        openInNewIcon &&
                        locale.global.linkWillOpenInNewWindow.replace('[destination]', rest.href)
                    ) ||
                    undefined
                }
                className={`${className} ${classes.externalLink}`}
            >
                {openInNewIcon &&
                    <OpenInNew className={classes.externalLinkIcon} />
                }
                {!!children && children}
            </a>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ExternalLink);
