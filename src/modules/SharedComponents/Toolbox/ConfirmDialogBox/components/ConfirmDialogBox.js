import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export default class ConfirmDialogBox extends Component {
    static propTypes = {
        locale: PropTypes.object,
        onAction: PropTypes.func,
        onCancelAction: PropTypes.func,
        hideCancelButton: PropTypes.bool,
        onRef: PropTypes.func
    };

    static defaultProps = {
        hideCancelButton: false,
        locale: {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes'
        }
    };

    constructor(props) {
        super(props);

        this._onCancelAction = this._onCancelAction.bind(this);
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

    _onCancelAction() {
        this._hideConfirmation();
        if (this.props.onCancelAction) {
            this.props.onCancelAction();
        }
    }

    render() {
        const actions = [
            <div className="columns dialog-actions ConfirmDialogBox-actions">
                <div className="column is-hidden-mobile"/>
                {
                    !this.props.hideCancelButton &&
                    <div className="column is-narrow">
                        <RaisedButton
                            label={this.props.locale.cancelButtonLabel}
                            fullWidth
                            className="ConfirmDialogBox-actions-cancel"
                            onTouchTap={this._onCancelAction}/>
                    </div>
                }
                <div className="column is-narrow">
                    <RaisedButton
                        label={this.props.locale.confirmButtonLabel}
                        fullWidth
                        className="ConfirmDialogBox-actions-confirm"
                        secondary
                        keyboardFocused
                        onTouchTap={this._onAction}/>
                </div>
                <div className="is-clearfix"/>
            </div>
        ];

        return (
            <Dialog
                title={this.props.locale.confirmationTitle}
                actions={actions}
                modal
                open={this.state.isDialogOpen}>
                {this.props.locale.confirmationMessage}
            </Dialog>
        );
    }
}
