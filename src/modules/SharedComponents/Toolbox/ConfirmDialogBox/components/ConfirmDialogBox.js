import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';

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
        /* istanbul ignore else */
        if (this.props.onCancelAction) {
            this.props.onCancelAction();
        }
    }

    render() {
        return (
            <Dialog style={{padding: 6}} open={this.state.isDialogOpen}>
                <DialogTitle>{this.props.locale.confirmationTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{this.props.locale.confirmationMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        children={this.props.locale.confirmButtonLabel}
                        autoFocus
                        color={'primary'}
                        onClick={this._onAction}/>
                    {
                        !this.props.hideCancelButton &&
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            children={this.props.locale.cancelButtonLabel}
                            onClick={this._onCancelAction}/>
                    }
                </DialogActions>
            </Dialog>
        );
    }
}
