import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Person from '@material-ui/icons/Person';
import PersonOutline from '@material-ui/icons/PersonOutline';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    iconButton: {
        color: theme.palette.white.main,
    },
});

export class AuthButton extends Component {
    static propTypes = {
        isAuthorizedUser: PropTypes.bool.isRequired,
        signOutTooltipText: PropTypes.string,
        ariaLabel: PropTypes.string,
        signInTooltipText: PropTypes.string,
        hoveredStyle: PropTypes.object,
        onClick: PropTypes.func,
        classes: PropTypes.object,
    };

    render() {
        const { classes, isAuthorizedUser, signOutTooltipText, signInTooltipText, ariaLabel, onClick } = this.props;
        return (
            <div className="auth-button-wrapper">
                <Tooltip
                    title={isAuthorizedUser ? signOutTooltipText : signInTooltipText}
                    placement="bottom-start"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 300 }}
                >
                    <IconButton
                        aria-label={ariaLabel}
                        onClick={onClick}
                        className={isAuthorizedUser ? 'log-out-button' : 'log-in-button'}
                    >
                        {isAuthorizedUser ? (
                            <Person className={classes.iconButton} />
                        ) : (
                            <PersonOutline className={classes.iconButton} />
                        )}
                    </IconButton>
                </Tooltip>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AuthButton);
