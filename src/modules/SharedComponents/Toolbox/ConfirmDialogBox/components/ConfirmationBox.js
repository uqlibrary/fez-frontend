import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export const useStyles = makeStyles(theme => ({
    alternateActionButtonClass: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.warning.main,
        '&:hover': {
            backgroundColor: theme.palette.warning.dark,
        },
    },
}));

export const ConfirmationBox = ({
    actionButtonColor,
    actionButtonVariant,
    cancelButtonColor,
    confirmationBoxId,
    InputForm,
    hideCancelButton,
    isOpen,
    locale,
    onAction,
    onAlternateAction,
    onCancelAction,
    onClose,
    showAlternateActionButton,
    showInputForm,
}) => {
    const classes = useStyles();

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
        <Dialog style={{ padding: 6 }} open={isOpen}>
            <DialogTitle data-testid="message-title">{locale.confirmationTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText data-testid="message-content">{locale.confirmationMessage}</DialogContentText>
                {!!showInputForm && <InputForm />}
            </DialogContent>
            <DialogActions>
                <Grid container spacing={1}>
                    <Hidden xsDown>
                        <Grid item xs />
                    </Hidden>
                    <Grid item xs={12} sm={'auto'}>
                        <Button
                            {...(!!actionButtonVariant ? { variant: actionButtonVariant } : {})}
                            children={locale.confirmButtonLabel}
                            autoFocus
                            color={actionButtonColor || 'primary'}
                            fullWidth
                            onClick={_onAction}
                            id="confirm-action"
                            data-testid={`confirm-${confirmationBoxId}`}
                        />
                    </Grid>
                    {showAlternateActionButton && (
                        // an optional middle button that will display in a warning colour
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                className={classes.alternateActionButtonClass}
                                children={locale.alternateActionButtonLabel}
                                fullWidth
                                onClick={_onAlternateAction}
                                id="confirm-alternate-action"
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
    confirmationBoxId: PropTypes.string.isRequired,
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

ConfirmationBox.defaultProps = {
    hideCancelButton: false,
    isOpen: false,
    locale: {
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
        alternateActionButtonLabel: 'Cancel',
    },
    showAlternateActionButton: false,
    showInputForm: false,
};

export default ConfirmationBox;
