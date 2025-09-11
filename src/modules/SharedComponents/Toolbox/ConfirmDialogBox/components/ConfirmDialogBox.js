import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/GridLegacy';
import Box from '@mui/material/Box';

export const createConfirmDialogBoxRefAssigner = refObject => ref => {
    refObject.current = ref;
};

export class ConfirmDialogBox extends Component {
    static propTypes = {
        className: PropTypes.string,
        confirmDialogBoxId: PropTypes.string,
        hideCancelButton: PropTypes.bool,
        locale: PropTypes.object,
        onAction: PropTypes.func,
        onCancelAction: PropTypes.func,
        onAlternateAction: PropTypes.func,
        onRef: PropTypes.func,
        showAlternateActionButton: PropTypes.bool,
        isOpen: PropTypes.bool,
    };

    static defaultProps = {
        hideCancelButton: false,
        locale: {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
        showAlternateActionButton: false,
        confirmDialogBoxId: 'dialog-box',
        isOpen: false,
    };

    constructor(props) {
        super(props);

        this._onCancelAction = this._onCancelAction.bind(this);
        this._onAlternateAction = this._onAlternateAction.bind(this);
        this._hideConfirmation = this._hideConfirmation.bind(this);
        this._onAction = this._onAction.bind(this);

        this.state = {
            isDialogOpen: this.props.isOpen,
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
        this.props.onAction && this.props.onAction();
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
            <Box data-testid="confirmDialogBox" component={'span'}>
                <Dialog style={{ padding: 6 }} open={this.state.isDialogOpen}>
                    <DialogTitle data-testid="message-title">{this.props.locale.confirmationTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText data-testid="message-content" component="div">
                            {this.props.locale.confirmationMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Grid container spacing={1}>
                            <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />

                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    children={this.props.locale.confirmButtonLabel}
                                    autoFocus
                                    color={'primary'}
                                    fullWidth
                                    onClick={this._onAction}
                                    data-analyticsid={`confirm-${this.props.confirmDialogBoxId}`}
                                    data-testid={`confirm-${this.props.confirmDialogBoxId}`}
                                />
                            </Grid>
                            {this.props.showAlternateActionButton && (
                                // an optional middle button that will display in a warning colour
                                <Grid item xs={12} sm={'auto'}>
                                    <Button
                                        variant={'contained'}
                                        data-analyticsid={`alternate-${this.props.confirmDialogBoxId}`}
                                        data-testid={`alternate-${this.props.confirmDialogBoxId}`}
                                        sx={{
                                            color: 'white.main',
                                            backgroundColor: 'warning.main',
                                            '&:hover': {
                                                backgroundColor: 'warning.dark',
                                            },
                                        }}
                                        children={this.props.locale.alternateActionButtonLabel}
                                        fullWidth
                                        onClick={this._onAlternateAction}
                                    />
                                </Grid>
                            )}
                            {!this.props.hideCancelButton && (
                                <Grid item xs={12} sm={'auto'}>
                                    <Button
                                        variant={'contained'}
                                        color={'primary'}
                                        data-analyticsid={`cancel-${this.props.confirmDialogBoxId}`}
                                        data-testid={`cancel-${this.props.confirmDialogBoxId}`}
                                        children={this.props.locale.cancelButtonLabel}
                                        fullWidth
                                        onClick={this._onCancelAction}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}

export default ConfirmDialogBox;
