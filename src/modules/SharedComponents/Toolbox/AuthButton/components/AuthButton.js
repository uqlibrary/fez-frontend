import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Person from '@mui/icons-material/Person';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Fade from '@mui/material/Fade';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(
    theme => ({
        iconButton: {
            color: theme.palette.white.main,
        },
    }),
    { withTheme: true },
);

export const AuthButton = ({ isAuthorizedUser, signOutTooltipText, signInTooltipText, onClick }) => {
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
                    onClick={onClick}
                    className={isAuthorizedUser ? 'log-out-button' : 'log-in-button'}
                    size="large"
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
    signInTooltipText: PropTypes.string,
    onClick: PropTypes.func,
};

export default AuthButton;
