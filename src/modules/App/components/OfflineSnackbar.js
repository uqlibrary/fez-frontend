import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import AlertError from 'material-ui/svg-icons/alert/error';

export default class OfflineSnackbar extends PureComponent {
    static propTypes = {
        locale: PropTypes.object
    };

    static defaultProps = {
        locale: {
            online: {
                message: 'Your connection is back online',
                autoHideDuration: 5000
            },
            offline: {
                message: 'Your connection is offline',
                autoHideDuration: null
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            online: typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
            hasDisconnected: false
        };
    }

    componentDidMount() {
        window.addEventListener('online', () => {this.updateOnlineState(true, true);});
        window.addEventListener('offline', () => {this.updateOnlineState(false, true);});
    }

    componentWillUnmount() {
        window.removeEventListener('online', () => {this.updateOnlineState(true, false);});
        window.removeEventListener('offline', () => {this.updateOnlineState(false, false);});
    }

    updateOnlineState = (online, hasDisconnected) => {
        this.setState({open: true, online: online, hasDisconnected: hasDisconnected});
    };

    renderMessage = (message, icon) => {
        return (
            <div className={`columns is-gapless connectionStatus is-mobile ${this.state.online ? 'online' : 'offline'}`}>
                <div className="column"/>
                <div className="column is-narrow">{icon}</div>
                <div className="column is-narrow">{message}</div>
                <div className="column"/>
            </div>
        );
    };

    handleRequestClose = (reason) => {
        // MUI hack to prevent the snackbar from being hidden by clicking/touchTapping away
        console.log('PING');
        if (reason !== 'clickaway') {
            console.log('PONG');
            this.setState({open: false});
        }
    };

    render() {
        const locale = this.props.locale;
        const snackbarProps = this.state.online ?
            {...locale.online, message: this.renderMessage(locale.online.message, <ActionCheckCircle/>)} :
            {...locale.offline, message: this.renderMessage(locale.offline.message, <AlertError/>)};
        return  (
            <div className="offlineSnackbar">
                <Snackbar
                    {...snackbarProps}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                    onActionTouchTap={this.handleRequestClose}
                />
            </div>
        );
    }
}
