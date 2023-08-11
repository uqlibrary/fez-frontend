import React from 'react';
import { PropTypes } from 'prop-types';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Close from '@mui/icons-material/Close';

import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Error from '@mui/icons-material/Error';
import Warning from '@mui/icons-material/Warning';
import Info from '@mui/icons-material/Info';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Help from '@mui/icons-material/Help';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Done from '@mui/icons-material/Done';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

const classNames = require('classnames');

const useStyles = makeStyles(
    theme => ({
        root: {
            padding: 12,
            marginTop: 5,
            '&:first-child': {
                marginTop: 0,
            },
        },
        common: {
            borderRadius: 5,
            boxShadow: theme.shadows[1],
        },
        '@keyframes wiggle': {
            from: { transform: 'rotate(-30deg)', transformOrigin: '40% 50%' },
            to: { transform: 'rotate(15deg)', transformOrigin: '40% 50%' },
        },
        wiggler: {
            animationName: '$wiggle',
            animationDuration: '0.3s',
            animationIterationCount: 20,
            animationDirection: 'alternate',
            animationTimingFunction: 'ease-in-out',
        },
        icon: {
            '& .icon': {
                fontSize: 48,
                marginRight: 16,
                marginBottom: -6,
            },
            '& .spinner': {
                margin: '8px 24px 0 6px',
            },
        },
        text: {
            alignSelf: 'center',
            padding: '6px 0',
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',

            '& ul, & ol': {
                [theme.breakpoints.down('sm')]: {
                    paddingInlineStart: 0,
                },
            },
        },
        actionButton: {
            '& .action': {
                [theme.breakpoints.up('xs')]: {
                    marginTop: 6,
                },
                [theme.breakpoints.down('sm')]: {
                    marginRight: 12,
                },
            },
        },
        dismissButton: {
            '& .dismiss': {
                [theme.breakpoints.up('xs')]: {
                    marginTop: 0,
                },
                [theme.breakpoints.down('sm')]: {
                    marginRight: -12,
                },
            },
        },
        linked: {
            '&:hover': {
                cursor: 'pointer',
            },
        },
        error: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.error.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.error.dark,
            },
            '& .icon': {
                color: theme.palette.error.dark,
            },
            '& .dismiss': {
                color: theme.palette.error.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.error.dark,
            },
        },
        error_outline: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.error.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.error.dark,
            },
            '& .icon': {
                color: theme.palette.error.dark,
            },
            '& .dismiss': {
                color: theme.palette.error.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.error.dark,
            },
        },
        warning: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.warning.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.warning.dark,
            },
            '& .icon': {
                color: theme.palette.warning.dark,
            },
            '& .dismiss': {
                color: theme.palette.warning.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.warning.dark,
            },
        },
        help: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.secondary.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.secondary.dark,
            },
            '& .icon': {
                color: theme.palette.secondary.dark,
            },
            '& .dismiss': {
                color: theme.palette.secondary.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.secondary.dark,
            },
        },
        help_outline: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.secondary.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.secondary.dark,
            },
            '& .icon': {
                color: theme.palette.secondary.dark,
            },
            '& .dismiss': {
                color: theme.palette.secondary.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.secondary.dark,
            },
        },
        info: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.accent.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.accent.dark,
            },
            '& .icon': {
                color: theme.palette.accent.dark,
            },
            '& .dismiss': {
                color: theme.palette.accent.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.accent.dark,
            },
        },
        info_outline: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.accent.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.accent.dark,
            },
            '& .icon': {
                color: theme.palette.accent.dark,
            },
            '& .dismiss': {
                color: theme.palette.accent.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.accent.dark,
            },
        },
        done: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.success.light,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.success.dark,
            },
            '& .icon': {
                color: theme.palette.success.dark,
            },
            '& .dismiss': {
                color: theme.palette.success.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.success.dark,
            },
        },
    }),
    { withTheme: true },
);

export const Alert = ({
    action,
    actionButtonLabel,
    allowDismiss,
    customIcon,
    customType,
    disableAlertClick,
    dismissAction,
    dismissTitle,
    message,
    showLoader,
    alertId,
    title,
    type,
    wiggle,
}) => {
    const classes = useStyles();
    const renderIcon = type => {
        switch (type) {
            case 'custom':
                return customIcon;
            case 'error':
                return <Error id="error-icon" className="icon" />;
            case 'error_outline':
                return <ErrorOutline id="error-outline-icon" className="icon" />;
            case 'warning':
                return <Warning id="warning-icon" className="icon" />;
            case 'info':
                return <Info id="info-icon" className="icon" />;
            case 'info_outline':
                return <InfoOutlined id="info-outline-icon" className="icon" />;
            case 'help':
                return <Help id="help-icon" className="icon" />;
            case 'help_outline':
                return <HelpOutline id="help-outline-icon" className="icon" />;
            case 'done':
                return <Done id="done-icon" className="icon" />;
            default:
                return <Error id="error-icon" className="icon" />;
        }
    };

    return (
        <div data-testid="alert" style={{ marginTop: '5px' }}>
            <Grid
                container
                className={classNames(classes[!!customIcon ? customType : type], classes.common)}
                justifyContent="center"
                alignItems="flex-start"
                alignContent="center"
                id={alertId}
                data-analyticsid={alertId}
                data-testid={alertId}
                classes={{ root: classes.root }}
            >
                <Grid item xs={12} sm className={(action && !disableAlertClick && classes.linked) || ''}>
                    <Grid container justifyContent="center" alignItems="flex-start" alignContent="center">
                        <Grid
                            item
                            className={`${classes.icon} alert-icon ${wiggle ? classes.wiggler : ''}`}
                            onClick={(!disableAlertClick && action) || undefined}
                            onKeyDown={(!disableAlertClick && action) || undefined}
                        >
                            {showLoader ? (
                                <CircularProgress
                                    id="spinner"
                                    data-testid="spinner"
                                    className="spinner"
                                    size={38}
                                    thickness={3}
                                />
                            ) : (
                                renderIcon(type)
                            )}
                        </Grid>
                        <Grid
                            item
                            xs
                            className={`${classes.text} alert-text`}
                            onClick={(!disableAlertClick && action) || undefined}
                            onKeyDown={(!disableAlertClick && action) || undefined}
                        >
                            <b>{title && `${title} - `}</b>
                            {message}
                        </Grid>
                        {allowDismiss && dismissAction && (
                            <Grid item className={classes.dismissButton} sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <IconButton
                                    onClick={dismissAction}
                                    title={dismissTitle}
                                    aria-label={dismissTitle}
                                    id="dismiss-mobile"
                                    data-analyticsid="dismiss-mobile"
                                    data-testid="dismiss-mobile"
                                    size="large"
                                >
                                    <Close className="dismiss" />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {action && actionButtonLabel && (
                    <Grid item xs sm="auto" className={classes.actionButton}>
                        <Button
                            variant="text"
                            children={actionButtonLabel}
                            onClick={action}
                            fullWidth
                            className="action alert-button"
                            id="action-button"
                            data-analyticsid="action-button"
                            data-testid="action-button"
                            disabled={showLoader}
                        />
                    </Grid>
                )}
                {allowDismiss && dismissAction && (
                    <Grid item className={classes.dismissButton} sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <IconButton
                            onClick={dismissAction}
                            title={dismissTitle}
                            aria-label={dismissTitle}
                            id="dismiss"
                            data-analyticsid="dismiss"
                            data-testid="dismiss"
                            size="large"
                        >
                            <Close className="dismiss" />
                        </IconButton>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

Alert.propTypes = {
    action: PropTypes.func,
    actionButtonLabel: PropTypes.string,
    allowDismiss: PropTypes.bool,
    customIcon: PropTypes.any,
    customType: PropTypes.oneOf([
        null,
        'error',
        'error_outline',
        'warning',
        'info',
        'info_outline',
        'help',
        'help_outline',
        'done',
        'custom',
    ]),
    disableAlertClick: PropTypes.bool,
    dismissAction: PropTypes.func,
    dismissTitle: PropTypes.string,
    message: PropTypes.any.isRequired,
    showLoader: PropTypes.bool,
    alertId: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.oneOf([
        'error',
        'error_outline',
        'warning',
        'info',
        'info_outline',
        'help',
        'help_outline',
        'done',
        'custom',
    ]),
    wiggle: PropTypes.bool,
};

Alert.defaultProps = {
    allowDismiss: false,
    customIcon: null,
    customType: null,
    disableAlertClick: false,
    dismissTitle: 'Click to dismiss this alert',
    message: 'Unexpected error',
    showLoader: false,
    type: 'error',
    wiggle: null,
};

export default Alert;
