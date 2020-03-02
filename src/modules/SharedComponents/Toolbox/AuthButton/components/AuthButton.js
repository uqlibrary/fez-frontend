import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Person from '@material-ui/icons/Person';
import PersonOutline from '@material-ui/icons/PersonOutline';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
    theme => ({
        iconButton: {
            color: theme.palette.white.main,
        },
    }),
    { withTheme: true },
);

export const AuthButton = ({ isAuthorizedUser, signOutTooltipText, ariaLabel, signInTooltipText, onClick }) => {
    const classes = useStyles();
    return (
        <div className="auth-button-wrapper">
            <Tooltip
                id="auth-button"
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
                        <Person id="logged-in-icon" className={classes.iconButton} />
                    ) : (
                        <PersonOutline id="logged-out-icon" className={classes.iconButton} />
                    )}
                </IconButton>
            </Tooltip>
        </div>
    );
};

AuthButton.propTypes = {
    isAuthorizedUser: PropTypes.bool.isRequired,
    signOutTooltipText: PropTypes.string,
    ariaLabel: PropTypes.string,
    signInTooltipText: PropTypes.string,
    onClick: PropTypes.func,
};

export default AuthButton;
