import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FontIcon from 'material-ui/FontIcon';

// MUI 1
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import jss from 'jss';
import nested from 'jss-nested';
jss.use(nested());

const styles = theme => ({
    // General styles
    alertWrapper: {
        border: '2px dashed red',
        padding: 20
    },
    alertIcon: {
        padding: 16,
    },
    alertText: {
        lineHeight: 1.3
    },
    linked: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    // Type specific styles
    help: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.white.main,
    },
    warning: {
        backgroundColor: theme.palette.warning.main,
    }
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
        classes: PropTypes.object
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

    render() {
        const {classes} = this.props;
        return (
            <Grid className={classes.alertWrapper}>
                <Grid container spacing={40} wrap={'nowrap'} direction={'row'} className={classes[this.props.type]}>

                    <Grid item xs={3} className={`${classes.alertIcon} ${this.props.action && classes.linked}`} onClick={this.props.action} onKeyDown={this.props.action}>
                        {this.props.showLoader ? <CircularProgress className="alertSpinner" size={32} thickness={4} /> : <FontIcon className="material-icons">{this.props.type}</FontIcon>}
                    </Grid>

                    <Grid item className={`${classes.alertText} ${this.props.action && classes.linked}`} onClick={this.props.action} onKeyDown={this.props.action} style={{flexGrow: 1}}>
                        <Typography component={'body1'} style={{color: 'white'}}><b>{this.props.title && `${this.props.title} - `}</b>{this.props.message}</Typography>
                    </Grid>

                    {
                        this.props.allowDismiss && this.props.dismissAction &&
                        <Grid item xs={3}>
                            <IconButton onClick={this.props.dismissAction} className="alertDismissButton" title={this.props.dismissTitle} aria-label={this.props.dismissTitle}>
                                <NavigationClose className="alertDismiss"/>
                            </IconButton>
                        </Grid>
                    }

                    {
                        this.props.action && this.props.actionButtonLabel &&
                        <Grid item xs={3}>
                            <FlatButton
                                label={this.props.actionButtonLabel}
                                onClick={this.props.action}
                                fullWidth
                                className="alertAction"/>
                        </Grid>
                    }

                    {
                        this.props.allowDismiss && this.props.dismissAction &&
                        <Grid item xs={3}>
                            <IconButton onClick={this.props.dismissAction} className="alertDismissButton" title={this.props.dismissTitle} aria-label={this.props.dismissTitle}>
                                <NavigationClose className="alertDismiss"/>
                            </IconButton>
                        </Grid>
                    }

                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Alert);
