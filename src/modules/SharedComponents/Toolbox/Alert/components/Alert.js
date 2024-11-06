import React from 'react';
import { PropTypes } from 'prop-types';
import { styled } from '@mui/material/styles';

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

const icon = {
    '& .icon': {
        fontSize: '48px',
        marginRight: '16px',
        marginBottom: '-6px',
    },
    '& .spinner': {
        margin: '8px 24px 0 6px',
    },
};
const paletteIndex = {
    error: 'error',
    error_outline: 'error',
    warning: 'warning',
    help: 'secondary',
    help_outline: 'secondary',
    info: 'accent',
    info_outline: 'accent',
    done: 'success',
};

const StyledGridWiggler = styled(Grid, {
    shouldForwardProp: prop => prop !== 'wiggle',
})(({ wiggle }) => ({
    '@keyframes wiggle': {
        from: { transform: 'rotate(-30deg)', transformOrigin: '40% 50%' },
        to: { transform: 'rotate(15deg)', transformOrigin: '40% 50%' },
    },
    ...(!!wiggle
        ? {
              animation: 'wiggle 0.3s 20 alternate ease-in-out',
          }
        : {}),
}));

const StyledGridWithIcon = styled(Grid, {
    shouldForwardProp: prop => prop !== 'type',
})(({ theme, type }) => {
    const _type = paletteIndex[type] ?? 'error';
    return {
        borderRadius: '5px',
        boxShadow: theme.shadows[1],
        padding: '12px',
        marginTop: '5px',
        '&:first-of-type': {
            marginTop: 0,
        },

        '& a:link, & a:hover, & a:visited': {
            color: theme.palette.white.main,
            textDecoration: 'underline',
        },

        color: theme.palette.white.main,
        backgroundColor: type !== 'done' ? theme.palette[_type].main : theme.palette[_type].light,

        '& .spinner, & .icon, & button.dismiss': {
            color: theme.palette[_type].dark,
        },
        '& button.action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette[_type].dark,
        },
    };
});

const StyledGridTitle = styled(Grid)(({ theme }) => ({
    alignSelf: 'center',
    padding: '6px 0',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',

    '& ul, & ol': {
        [theme.breakpoints.down('sm')]: {
            paddingInlineStart: 0,
        },
    },
}));

const StyledGridActionButton = styled(Grid)(({ theme }) => ({
    '& .action': {
        [theme.breakpoints.up('xs')]: {
            marginTop: '6px',
        },
        [theme.breakpoints.down('sm')]: {
            marginRight: '12px',
        },
    },
}));

const StyledGridDismissButton = styled(Grid)(({ theme }) => ({
    '& .dismiss': {
        [theme.breakpoints.up('xs')]: {
            marginTop: 0,
        },
        [theme.breakpoints.down('sm')]: {
            marginRight: '-12px',
        },
    },
}));

export const renderIcon = type => {
    switch (type) {
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

export const Alert = ({
    action,
    actionButtonLabel,
    allowDismiss = false,
    customIcon = null,
    customType = null,
    disableAlertClick = false,
    dismissAction,
    dismissTitle = 'Click to dismiss this alert',
    message = 'Unexpected error',
    showLoader = false,
    alertId,
    title,
    type = 'error',
    wiggle = null,
}) => {
    const renderedIcon = type !== 'custom' ? renderIcon(type) : customIcon;
    return (
        <div data-testid="alert" style={{ marginTop: '5px' }}>
            <StyledGridWithIcon
                container
                type={!!customIcon ? customType : type}
                justifyContent="center"
                alignItems="flex-start"
                alignContent="center"
                id={alertId}
                data-analyticsid={alertId}
                data-testid={alertId}
                sx={{}}
            >
                <Grid
                    item
                    xs={12}
                    sm
                    sx={{
                        ...(action && !disableAlertClick
                            ? {
                                  '&:hover': {
                                      cursor: 'pointer',
                                  },
                              }
                            : {}),
                    }}
                >
                    <Grid container justifyContent="center" alignItems="flex-start" alignContent="center">
                        <StyledGridWiggler
                            item
                            sx={{ ...icon }}
                            className={'alert-icon'}
                            wiggle={!!wiggle ? 'true' : null}
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
                                renderedIcon
                            )}
                        </StyledGridWiggler>
                        <StyledGridTitle
                            item
                            xs
                            className={'alert-text'}
                            onClick={(!disableAlertClick && action) || undefined}
                            onKeyDown={(!disableAlertClick && action) || undefined}
                        >
                            <b>{title && `${title} - `}</b>
                            <span data-testid="alert-message">{message}</span>
                        </StyledGridTitle>
                        {allowDismiss && dismissAction && (
                            <StyledGridDismissButton item sx={{ display: { xs: 'block', sm: 'none' } }}>
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
                            </StyledGridDismissButton>
                        )}
                    </Grid>
                </Grid>
                {action && actionButtonLabel && (
                    <StyledGridActionButton item xs sm="auto">
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
                    </StyledGridActionButton>
                )}
                {allowDismiss && dismissAction && (
                    <StyledGridDismissButton item sx={{ display: { xs: 'none', sm: 'block' } }}>
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
                    </StyledGridDismissButton>
                )}
            </StyledGridWithIcon>
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

export default Alert;
