import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

/**
 * A replacement component for the react-router `Prompt`.
 * Allows for more flexible dialogs.
 *
 * https://gist.github.com/bummzack/a586533607ece482475e0c211790dd50
 */
class NavigationPrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {nextLocation: null};
        this.confirmationBox = null;
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    componentDidMount() {
        this.unblock = this.props.history.block((nextLocation) => {
            if (this.props.when) {
                this.setState({
                    nextLocation: nextLocation
                });
                this.confirmationBox.showConfirmation();
                return !this.props.when;
            }

            return this.props.when;
        });
    }

    componentWillUnmount() {
        this.unblock();
    }

    setNavigationConfirmation = (ref) => {
        this.confirmationBox = ref;
    };

    onCancel() {
        this.setState({nextLocation: null});
    }

    onConfirm() {
        this.navigateToNextLocation();
    }

    navigateToNextLocation() {
        this.unblock();
        this.props.history.push(this.state.nextLocation.pathname);
    }

    render() {
        return (
            <div>
                {this.props.children(this.setNavigationConfirmation, this.onConfirm, this.onCancel)}
            </div>
        );
    }
}

NavigationPrompt.propTypes = {
    when: PropTypes.bool.isRequired,
    children: PropTypes.func.isRequired,
    history: PropTypes.object
};

export default withRouter(NavigationPrompt);
