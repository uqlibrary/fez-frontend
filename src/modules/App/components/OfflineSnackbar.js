import React, {PureComponent} from 'react';
import Snackbar from 'material-ui/Snackbar';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import AlertError from 'material-ui/svg-icons/alert/error';
import {locale} from 'locale';

export default class OfflineSnackbar extends PureComponent {
    static defaultProps = {
        locale: {
            online: {
                message: 'Your connection is online',
                autoHideDuration: 5000
            },
            offline: {
                message: 'Your connection is offline',
                autoHideDuration: 0
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            open: !navigator.onLine,
            online: navigator.onLine,
            hasDisconnected: false
        };
    }

    componentDidMount() {
        window.addEventListener('online', this.updateOnlineState);
        window.addEventListener('offline', this.updateOnlineState);
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.updateOnlineState);
        window.removeEventListener('offline', this.updateOnlineState);
    }

    updateOnlineState = () => {
        this.setState({open: true, online: navigator.onLine, hasDisconnected: true});
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
        if (reason !== 'clickaway') {
            this.setState({open: false});
        }
    };

    render() {
        const txt = locale.global.offlineSnackbar;
        const snackbarProps = this.state.online ?
            {...txt.online, message: this.renderMessage(txt.online.message, <ActionCheckCircle/>)} :
            {...txt.offline, message: this.renderMessage(txt.offline.message, <AlertError/>)};
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
