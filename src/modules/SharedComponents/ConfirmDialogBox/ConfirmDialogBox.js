import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export default class ConfirmDialogBox extends Component {

    static propTypes = {
        locale: PropTypes.object,
        onAction: PropTypes.func,
        onRef: PropTypes.func
    };

    static defaultProps = {
        locale: {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'Cancel',
            confirmButtonLabel: 'OK'
        }
    };

    constructor(props) {
        super(props);

        this._hideConfirmation = this._hideConfirmation.bind(this);
        this._onAction = this._onAction.bind(this);

        this.state = {
            isDialogOpen: false
        };
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    showConfirmation() {
        this.setState({
            isDialogOpen: true
        });
    }

    _hideConfirmation() {
        this.setState({
            isDialogOpen: false
        });
    }

    _onAction() {
        this._hideConfirmation();
        this.props.onAction();
    }

    render() {
        return (
            <Dialog
                title={this.props.locale.confirmationTitle}
                actions={[
                    <RaisedButton
                        label={this.props.locale.cancelButtonLabel}
                        onTouchTap={this._hideConfirmation}
                    />,
                    <RaisedButton
                        label={this.props.locale.confirmButtonLabel}
                        secondary
                        keyboardFocused
                        onTouchTap={this._onAction}
                    />
                ]}
                modal
                open={this.state.isDialogOpen}
            >
                {this.props.locale.confirmationMessage}
            </Dialog>
        );
    }
}

