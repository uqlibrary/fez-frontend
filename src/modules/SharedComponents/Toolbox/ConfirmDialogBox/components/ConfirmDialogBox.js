import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { mui2theme } from 'config/theme2';

export default class ConfirmDialogBox extends Component {
    static propTypes = {
        hideCancelButton: PropTypes.bool,
        locale: PropTypes.object,
        onAction: PropTypes.func,
        onCancelAction: PropTypes.func,
        onAlternateAction: PropTypes.func,
        onRef: PropTypes.func,
        showAlternateActionButton: PropTypes.func,
    };

    static defaultProps = {
        hideCancelButton: false,
        locale: {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
    };

    constructor(props) {
        super(props);

        this._onCancelAction = this._onCancelAction.bind(this);
        this._onAlternateAction = this._onAlternateAction.bind(this);
        this._hideConfirmation = this._hideConfirmation.bind(this);
        this._onAction = this._onAction.bind(this);

        this.state = {
            isDialogOpen: false,
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
            isDialogOpen: true,
        });
    }

    _hideConfirmation() {
        this.setState({
            isDialogOpen: false,
        });
    }

    _onAction() {
        this._hideConfirmation();
        this.props.onAction();
    }

    _onCancelAction() {
        this._hideConfirmation();
        !!this.props.onCancelAction && this.props.onCancelAction();
    }

    _onAlternateAction() {
        this._hideConfirmation();
        !!this.props.onAlternateAction && this.props.onAlternateAction();
    }

    render() {
        return (
            <MuiThemeProvider theme={mui2theme}>
                <Dialog style={{ padding: 6 }} open={this.state.isDialogOpen}>
                    <DialogTitle>{this.props.locale.confirmationTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{this.props.locale.confirmationMessage}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            children={this.props.locale.confirmButtonLabel}
                            autoFocus
                            color={'primary'}
                            onClick={this._onAction}
                        />
                        // an optional middle button that will display in a warning colour
                        {this.props.showAlternateActionButton && (
                            <Button
                                variant={'contained'}
                                color={'secondary'}
                                children={this.props.locale.alternateActionButtonLabel}
                                onClick={this._onAlternateAction}
                            />
                        )}
                        {!this.props.hideCancelButton && (
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                children={this.props.locale.cancelButtonLabel}
                                onClick={this._onCancelAction}
                            />
                        )}
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}
