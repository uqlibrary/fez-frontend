import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline';
import SocialPerson from 'material-ui/svg-icons/social/person';

const AuthButton = ({isAuthorizedUser, signOutTooltipText = 'Log out', signInTooltipText = 'Log in', hoveredStyle, onClick}) => {
    return (
        <div className="auth-button-wrapper">
            <IconButton
                tooltipPosition="bottom-left"
                onClick={onClick}
                hoveredStyle={hoveredStyle}
                tooltip={isAuthorizedUser ? signOutTooltipText : signInTooltipText}
                className={isAuthorizedUser ? 'log-out-button' : 'log-in-button'}>
                {isAuthorizedUser ? <SocialPerson/> : <SocialPersonOutline/>}
            </IconButton>
        </div>
    );
};

AuthButton.propTypes = {
    isAuthorizedUser: PropTypes.bool.isRequired,
    signOutTooltipText: PropTypes.string,
    signInTooltipText: PropTypes.string,
    hoveredStyle: PropTypes.object,
    onClick: PropTypes.func
};

export default AuthButton;

