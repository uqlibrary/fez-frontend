import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Close from '@material-ui/icons/Close';

import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Error from '@material-ui/icons/Error';
import Warning from '@material-ui/icons/Warning';
import Info from '@material-ui/icons/Info';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Help from '@material-ui/icons/Help';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Done from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';

const classNames = require('classnames');

export const styles = theme => ({
    common: {
        borderRadius: 5,
        boxShadow: theme.shadows[1],
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
    },
    actionButton: {
        '& .action': {
            [theme.breakpoints.up('xs')]: {
                marginTop: 6,
            },
            [theme.breakpoints.down('xs')]: {
                marginRight: 12,
            },
            [theme.breakpoints.up('md')]: {
                width: 'auto',
            },
        },
        '& .action + .action': {
            [theme.breakpoints.up('md')]: {
                marginLeft: 12,
            },
        },
    },
    dismissButton: {
        '& .dismiss': {
            [theme.breakpoints.up('xs')]: {
                marginTop: 0,
            },
            [theme.breakpoints.down('xs')]: {
                marginRight: -12,
            },
        },
        '& #dismiss': {
            marginLeft: -12,
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
});

export class Alert extends PureComponent {
    static propTypes = {
        message: PropTypes.any.isRequired,
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
        ]),
        action: PropTypes.func,
        actionButtonLabel: PropTypes.string,
        alternateAction: PropTypes.func,
        alternateActionButtonLabel: PropTypes.string,
        allowDismiss: PropTypes.bool,
        dismissAction: PropTypes.func,
        dismissTitle: PropTypes.string,
        showLoader: PropTypes.bool,
        classes: PropTypes.object,
        pushToTop: PropTypes.bool,
    };

    static defaultProps = {
        message: 'Unexpected error',
        type: 'error',
        allowDismiss: false,
        dismissTitle: 'Click to dismiss this alert',
        showLoader: false,
    };

    constructor(props) {
        super(props);
    }

    renderIcon = type => {
        switch (type) {
            case 'error':
                return <Error className={'icon'} />;
            case 'error_outline':
                return <ErrorOutline className={'icon'} />;
            case 'warning':
                return <Warning className={'icon'} />;
            case 'info':
                return <Info className={'icon'} />;
            case 'info_outline':
                return <InfoOutlined className={'icon'} />;
            case 'help':
                return <Help className={'icon'} />;
            case 'help_outline':
                return <HelpOutline className={'icon'} />;
            case 'done':
                return <Done className={'icon'} />;
            default:
                return <Error className={'icon'} />;
        }
    };

    render() {
        const { classes } = this.props;
        const wholeAlertAction = (!this.props.alternateAction && this.props.action) || undefined;
        return (
            <div style={{ padding: 12 }} className="Alert">
                <Grid
                    alignContent={'center'}
                    alignItems={'flex-start'}
                    className={classNames(classes[this.props.type], classes.common)}
                    container
                    justify={'center'}
                    spacing={24}
                >
                    <Grid
                        className={(this.props.action && !this.props.alternateAction && classes.linked) || ''}
                        item
                        sm
                        xs={12}
                    >
                        <Grid container justify={'center'} alignItems={'flex-start'} alignContent={'center'}>
                            <Grid
                                className={`${classes.icon} alert-icon`}
                                item
                                onClick={wholeAlertAction}
                                onKeyDown={wholeAlertAction}
                            >
                                {this.props.showLoader ? (
                                    <CircularProgress className={'spinner'} size={38} thickness={3} />
                                ) : (
                                    this.renderIcon(this.props.type)
                                )}
                            </Grid>
                            <Grid
                                className={`${classes.text} alert-text`}
                                item
                                onClick={wholeAlertAction}
                                onKeyDown={wholeAlertAction}
                                xs
                            >
                                <b>{this.props.title && `${this.props.title} - `}</b>
                                {this.props.message}
                            </Grid>
                            {this.props.allowDismiss && this.props.dismissAction && (
                                <Hidden smUp>
                                    <Grid item className={classes.dismissButton}>
                                        <IconButton
                                            aria-label={this.props.dismissTitle}
                                            id={'dismiss'}
                                            onClick={this.props.dismissAction}
                                            title={this.props.dismissTitle}
                                        >
                                            <Close className="dismiss" />
                                        </IconButton>
                                    </Grid>
                                </Hidden>
                            )}
                        </Grid>
                    </Grid>
                    {((this.props.action && this.props.actionButtonLabel) ||
                        (this.props.alternateAction && this.props.alternateActionButtonLabel)) && (
                        <Grid item xs sm={4} md={'auto'} className={classes.actionButton}>
                            {this.props.action && this.props.actionButtonLabel && (
                                <Button
                                    children={this.props.actionButtonLabel}
                                    className="action alert-button"
                                    fullWidth
                                    onClick={this.props.action}
                                    variant={'text'}
                                />
                            )}
                            {this.props.alternateAction && this.props.alternateActionButtonLabel && (
                                <Button
                                    children={this.props.alternateActionButtonLabel}
                                    className="action alert-button"
                                    fullWidth
                                    onClick={this.props.alternateAction}
                                    variant={'text'}
                                />
                            )}
                        </Grid>
                    )}
                    {this.props.allowDismiss && this.props.dismissAction && (
                        <Hidden xsDown>
                            <Grid item className={classes.dismissButton}>
                                <IconButton
                                    aria-label={this.props.dismissTitle}
                                    id={'dismiss'}
                                    onClick={this.props.dismissAction}
                                    title={this.props.dismissTitle}
                                >
                                    <Close className="dismiss" />
                                </IconButton>
                            </Grid>
                        </Hidden>
                    )}
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Alert);
