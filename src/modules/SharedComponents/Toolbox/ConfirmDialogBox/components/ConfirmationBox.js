import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/GridLegacy';

export const ConfirmationBox = ({
    actionButtonColor,
    actionButtonVariant,
    cancelButtonColor,
    classes = {},
    confirmationBoxId,
    InputForm,
    hideActionButton = false,
    hideCancelButton = false,
    isOpen = false,
    locale = {
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
        alternateActionButtonLabel: 'Cancel',
    },
    onAction,
    onAlternateAction,
    onCancelAction,
    onClose,
    showAlternateActionButton = false,
    showInputForm = false,
}) => {
    const _onAction = () => {
        onClose();
        onAction();
    };

    const _onCancelAction = () => {
        onClose();
        !!onCancelAction && onCancelAction();
    };

    const _onAlternateAction = () => {
        onClose();
        !!onAlternateAction && onAlternateAction();
    };

    return (
        <Dialog
            style={{ padding: 6 }}
            open={isOpen}
            id={confirmationBoxId}
            data-testid={confirmationBoxId}
            sx={{ ...classes }}
        >
            <DialogTitle data-testid="message-title">{locale.confirmationTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText data-testid="message-content">{locale.confirmationMessage}</DialogContentText>
                {!!showInputForm && <InputForm />}
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1}>
                    <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />

                    {!hideActionButton && (
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                {...(!!actionButtonVariant ? { variant: actionButtonVariant } : {})}
                                children={locale.confirmButtonLabel}
                                autoFocus
                                color={actionButtonColor || 'primary'}
                                fullWidth
                                onClick={_onAction}
                                id="confirm-action"
                                data-analyticsid={`confirm-${confirmationBoxId}`}
                                data-testid={`confirm-${confirmationBoxId}`}
                            />
                        </Grid>
                    )}
                    {showAlternateActionButton && (
                        // an optional middle button that will display in a warning colour
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                sx={{
                                    color: 'white.main',
                                    backgroundColor: 'warning.main',
                                    '&:hover': {
                                        backgroundColor: 'warning.dark',
                                    },
                                }}
                                children={locale.alternateActionButtonLabel}
                                fullWidth
                                onClick={_onAlternateAction}
                                id="confirm-alternate-action"
                                data-analyticsid={`confirm-alternate-${confirmationBoxId}`}
                                data-testid={`confirm-alternate-${confirmationBoxId}`}
                            />
                        </Grid>
                    )}
                    {!hideCancelButton && (
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={cancelButtonColor || 'primary'}
                                children={locale.cancelButtonLabel}
                                fullWidth
                                onClick={_onCancelAction}
                                id="confirm-cancel-action"
                                data-analyticsid={`cancel-${confirmationBoxId}`}
                                data-testid={`cancel-${confirmationBoxId}`}
                            />
                        </Grid>
                    )}
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

ConfirmationBox.propTypes = {
    actionButtonColor: PropTypes.string,
    actionButtonVariant: PropTypes.string,
    cancelButtonColor: PropTypes.string,
    classes: PropTypes.object,
    confirmationBoxId: PropTypes.string.isRequired,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    InputForm: PropTypes.func,
    isOpen: PropTypes.bool,
    locale: PropTypes.object,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onAlternateAction: PropTypes.func,
    onClose: PropTypes.func,
    showAlternateActionButton: PropTypes.bool,
    showInputForm: PropTypes.bool,
};

export default React.memo(ConfirmationBox);
