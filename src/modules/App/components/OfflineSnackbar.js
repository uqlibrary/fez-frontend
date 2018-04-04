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
                open: true,
                message: 'Your connection is back online',
                autoHideDuration: 5000
            },
            offline: {
                open: true,
                message: 'Your connection is offline',
                autoHideDuration: null
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            online: typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
            hasDisconnected: false
        };
    }

    componentDidMount() {
        window.addEventListener('online', () => {this.setState({online: true});});
        window.addEventListener('offline', () => {this.setState({online: false, hasDisconnected: true});});
    }

    componentWillUnmount() {
        window.removeEventListener('online', () => {this.setState({online: true});});
        window.removeEventListener('offline', () => {this.setState({online: true, hasDisconnected: false});});
    }

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

    render() {
        const locale = this.props.locale;
        const snackbarProps = this.state.online ?
            {...locale.online, message: this.renderMessage(locale.online.message, <ActionCheckCircle/>)} :
            {...locale.offline, message: this.renderMessage(locale.offline.message, <AlertError/>)};
        return  (
            <div className="offlineSnackbar">
                {
                    (!this.state.online || (this.state.online && this.state.hasDisconnected)) &&
                    <Snackbar {...snackbarProps} />
                }
            </div>
        );
    }
}
