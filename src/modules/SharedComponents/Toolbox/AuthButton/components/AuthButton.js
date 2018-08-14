import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Person from '@material-ui/icons/Person';
import PersonOutline from '@material-ui/icons/PersonOutline';

const AuthButton = ({ariaLabel, isAuthorizedUser, signOutTooltipText = 'Log out', signInTooltipText = 'Log in', hoveredStyle, onClick}) => {
    return (
        <div className="auth-button-wrapper">
            <Tooltip title={isAuthorizedUser ? signOutTooltipText : signInTooltipText}>
                <IconButton
                    aria-label={ariaLabel}
                    onClick={onClick}
                    hoveredStyle={hoveredStyle}
                    className={isAuthorizedUser ? 'log-out-button' : 'log-in-button'}>
                    {isAuthorizedUser ? <Person/> : <PersonOutline/>}
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
    hoveredStyle: PropTypes.object,
    onClick: PropTypes.func
};

export default AuthButton;

