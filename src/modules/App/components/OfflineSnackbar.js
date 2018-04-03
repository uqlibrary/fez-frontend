import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

export default class OfflineSnackbar extends PureComponent {
    static propTypes = {
        locale: PropTypes.object.isRequired
    };

    static defaultProps = {
        locale: {
            open: false,
            message: '',
            autoHideDuration: null
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            online: typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
            hasDisconnected: false
        };
    }

    render() {
        // Setup window listeners for online/offline events
        window.addEventListener('online', () => {
            this.setState({online: true});
        });
        window.addEventListener('offline', () => {
            this.setState({online: false, hasDisconnected: true});
        });

        const locale = this.props.locale;
        const snackbarProps = this.state.online ? {...locale.online} : {...locale.offline};
        return  (
            <div className={`offlineSnackbar ${this.state.online ? 'online' : 'offline'}`}>
                {
                    (!this.state.online || (this.state.online && this.state.hasDisconnected)) &&
                    <Snackbar {...snackbarProps}/>
                }
            </div>
        );
    }
}
