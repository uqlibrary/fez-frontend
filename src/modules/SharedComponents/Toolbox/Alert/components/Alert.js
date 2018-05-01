import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FontIcon from 'material-ui/FontIcon';

export default class Alert extends PureComponent {
    static propTypes = {
        message: PropTypes.string.isRequired,
        title: PropTypes.string,
        type: PropTypes.oneOf(['error', 'error_outline', 'warning', 'info', 'info_outline', 'help', 'help_outline', 'done']),
        action: PropTypes.func,
        actionButtonLabel: PropTypes.string,
        allowDismiss: PropTypes.bool,
        dismissAction: PropTypes.func,
        dismissTitle: PropTypes.string,
        showLoader: PropTypes.bool
    };

    static defaultProps = {
        message: 'Unexpected error',
        type: 'error',
        allowDismiss: false,
        dismissTitle: 'Click to dismiss this alert',
        showLoader: false
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.message !== this.props.message
            || nextProps.title !== this.props.title
            || nextProps.type !== this.props.type
            || nextProps.action !== this.props.action
            || nextProps.actionButtonLabel !== this.props.actionButtonLabel
            || nextProps.allowDismiss !== this.props.allowDismiss
            || nextProps.dismissAction !== this.props.dismissAction;
    }

    render() {
        return (
            <div className={this.props.type + ' alertWrapper '}>
                <div className="columns is-multiline is-mobile">
                    <div className={`column is-narrow alertIcon${this.props.action ? ' linked' : ''}`} onClick={this.props.action}
                        onKeyDown={this.props.action}>
                        {this.props.showLoader ? <CircularProgress className="alertSpinner" size={32} thickness={4} /> : <FontIcon className="material-icons">{this.props.type}</FontIcon>}
                    </div>
                    <div className={`column alertText${this.props.action ? ' linked' : ''}`} onClick={this.props.action} onKeyDown={this.props.action}>
                        <div><b>{this.props.title && `${this.props.title} - `}</b>{this.props.message}</div>
                    </div>
                    {
                        this.props.allowDismiss && this.props.dismissAction &&
                        <div className="column is-narrow is-hidden-tablet">
                            <IconButton onTouchTap={this.props.dismissAction} className="alertDismissButton" title={this.props.dismissTitle} aria-label={this.props.dismissTitle}>
                                <NavigationClose className="alertDismiss"/>
                            </IconButton>
                        </div>
                    }
                    {
                        this.props.action && this.props.actionButtonLabel &&
                        <div
                            className={`column is-narrow-tablet is-12-mobile${(!this.props.allowDismiss && !this.props.dismissAction) ? ' noDismiss' : ''}`}>
                            <FlatButton
                                label={this.props.actionButtonLabel}
                                onTouchTap={this.props.action}
                                fullWidth
                                className="alertAction"/>
                        </div>
                    }
                    {
                        this.props.allowDismiss && this.props.dismissAction &&
                        <div className="column is-narrow is-hidden-mobile">
                            <IconButton onTouchTap={this.props.dismissAction} className="alertDismissButton" title={this.props.dismissTitle} aria-label={this.props.dismissTitle}>
                                <NavigationClose className="alertDismiss"/>
                            </IconButton>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

