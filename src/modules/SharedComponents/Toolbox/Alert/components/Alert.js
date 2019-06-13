import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
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
import {withStyles} from '@material-ui/core/styles';

const classNames = require('classnames');

const styles = theme => ({
    common: {
        borderRadius: 5,
        boxShadow: theme.shadows[1]
    },
    icon: {
        '& .icon': {
            fontSize: 48,
            marginRight: 16,
            marginBottom: -6
        },
        '& .spinner': {
            margin: '8px 24px 0 6px'
        }
    },
    text: {
        alignSelf: 'center',
        padding: '6px 0',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)'
    },
    actionButton: {
        '& .action': {
            [theme.breakpoints.up('xs')]: {
                marginTop: 6,
            },
            [theme.breakpoints.down('xs')]: {
                marginRight: 12
            }
        }
    },
    dismissButton: {
        '& .dismiss': {
            [theme.breakpoints.up('xs')]: {
                marginTop: 0,
            },
            [theme.breakpoints.down('xs')]: {
                marginRight: -12
            }
        }
    },
    linked: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    error: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.error.main,
        '& .spinner': {
            color: theme.palette.error.dark
        },
        '& .icon': {
            color: theme.palette.error.dark
        },
        '& .dismiss': {
            color: theme.palette.error.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.error.dark
        }
    },
    error_outline: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.error.main,
        '& .spinner': {
            color: theme.palette.error.dark
        },
        '& .icon': {
            color: theme.palette.error.dark
        },
        '& .dismiss': {
            color: theme.palette.error.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.error.dark
        }
    },
    warning: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.warning.main,
        '& .spinner': {
            color: theme.palette.warning.dark
        },
        '& .icon': {
            color: theme.palette.warning.dark
        },
        '& .dismiss': {
            color: theme.palette.warning.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.warning.dark
        }
    },
    help: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.secondary.main,
        '& .spinner': {
            color: theme.palette.secondary.dark
        },
        '& .icon': {
            color: theme.palette.secondary.dark
        },
        '& .dismiss': {
            color: theme.palette.secondary.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.secondary.dark
        }
    },
    help_outline: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.secondary.main,
        '& .spinner': {
            color: theme.palette.secondary.dark
        },
        '& .icon': {
            color: theme.palette.secondary.dark
        },
        '& .dismiss': {
            color: theme.palette.secondary.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.secondary.dark
        }
    },
    info: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.accent.main,
        '& .spinner': {
            color: theme.palette.accent.dark
        },
        '& .icon': {
            color: theme.palette.accent.dark
        },
        '& .dismiss': {
            color: theme.palette.accent.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.accent.dark
        }
    },
    info_outline: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.accent.main,
        '& .spinner': {
            color: theme.palette.accent.dark
        },
        '& .icon': {
            color: theme.palette.accent.dark
        },
        '& .dismiss': {
            color: theme.palette.accent.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.accent.dark
        }
    },
    done: {
        color: theme.palette.white.main,
        backgroundColor: theme.palette.success.light,
        '& .spinner': {
            color: theme.palette.success.dark
        },
        '& .icon': {
            color: theme.palette.success.dark
        },
        '& .dismiss': {
            color: theme.palette.success.dark
        },
        '& .action': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.success.dark
        }
    },
});

export class Alert extends PureComponent {
    static propTypes = {
        message: PropTypes.any.isRequired,
        title: PropTypes.string,
        type: PropTypes.oneOf(['error', 'error_outline', 'warning', 'info', 'info_outline', 'help', 'help_outline', 'done']),
        action: PropTypes.func,
        actionButtonLabel: PropTypes.string,
        allowDismiss: PropTypes.bool,
        dismissAction: PropTypes.func,
        dismissTitle: PropTypes.string,
        showLoader: PropTypes.bool,
        classes: PropTypes.object,
        pushToTop: PropTypes.bool
    };

    static defaultProps = {
        message: 'Unexpected error',
        type: 'error',
        allowDismiss: false,
        dismissTitle: 'Click to dismiss this alert',
        showLoader: false
    };

    constructor(props) {
        super(props);
    }

    renderIcon = (type) => {
        switch(type) {
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
        const {classes} = this.props;
        return (
            <div style={{padding: 12}} className="Alert">
                <Grid container spacing={24} className={classNames(classes[this.props.type], classes.common)} justify={'center'} alignItems={'flex-start'} alignContent={'center'}>
                    <Grid item xs={12} sm className={this.props.action && classes.linked}>
                        <Grid container justify={'center'} alignItems={'flex-start'} alignContent={'center'}>
                            <Grid item className={`${classes.icon} alert-icon`} onClick={this.props.action} onKeyDown={this.props.action}>
                                {this.props.showLoader ? <CircularProgress className={'spinner'} size={38} thickness={3} /> : this.renderIcon(this.props.type)}
                            </Grid>
                            <Grid item xs className={`${classes.text} alert-text`} onClick={this.props.action} onKeyDown={this.props.action}>
                                <b>{this.props.title && `${this.props.title} - `}</b>{this.props.message}
                            </Grid>
                            {
                                this.props.allowDismiss && this.props.dismissAction &&
                                <Hidden smUp>
                                    <Grid item className={classes.dismissButton}>
                                        <IconButton onClick={this.props.dismissAction} title={this.props.dismissTitle}
                                            aria-label={this.props.dismissTitle} id={'dismiss'}>
                                            <Close className="dismiss"/>
                                        </IconButton>
                                    </Grid>
                                </Hidden>
                            }
                        </Grid>
                    </Grid>
                    {
                        this.props.action && this.props.actionButtonLabel &&
                        <Grid item xs sm={'auto'} className={classes.actionButton}>
                            <Button
                                variant={'text'}
                                children={this.props.actionButtonLabel}
                                onClick={this.props.action}
                                fullWidth
                                className="action alert-button"/>
                        </Grid>
                    }
                    {
                        this.props.allowDismiss && this.props.dismissAction &&
                        <Hidden xsDown>
                            <Grid item className={classes.dismissButton}>
                                <IconButton onClick={this.props.dismissAction} title={this.props.dismissTitle}
                                    aria-label={this.props.dismissTitle} id={'dismiss'}>
                                    <Close className="dismiss"/>
                                </IconButton>
                            </Grid>
                        </Hidden>
                    }
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Alert);
