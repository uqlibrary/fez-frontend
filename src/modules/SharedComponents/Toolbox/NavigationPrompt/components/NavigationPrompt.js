import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/**
 * A replacement component for the react-router `Prompt`.
 * Allows for more flexible dialogs.
 *
 * https://gist.github.com/bummzack/a586533607ece482475e0c211790dd50
 */
export class NavigationPrompt extends PureComponent {
    static propTypes = {
        when: PropTypes.bool.isRequired,
        children: PropTypes.func.isRequired,
        history: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = { nextLocation: null };
        this.confirmationBox = null;
    }

    componentDidMount() {
        this.unblock = this.props.history.block(this.blockNavigation);
    }

    componentWillUnmount() {
        this.unblock();
    }

    blockNavigation = nextLocation => {
        if (this.props.when) {
            this.setState({
                nextLocation: nextLocation,
            });
            this.confirmationBox.showConfirmation();
            return !this.props.when;
        }

        return this.props.when;
    };

    setNavigationConfirmation = ref => {
        this.confirmationBox = ref;
    };

    _onCancel = () => {
        this.setState({ nextLocation: null });
    };

    _onConfirm = () => {
        this.navigateToNextLocation();
    };

    navigateToNextLocation = () => {
        this.unblock();
        this.props.history.push(this.state.nextLocation.pathname);
    };

    render() {
        return <div>{this.props.children(this.setNavigationConfirmation, this._onConfirm, this._onCancel)}</div>;
    }
}
export default withRouter(NavigationPrompt);
