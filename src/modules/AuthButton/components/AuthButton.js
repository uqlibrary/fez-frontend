import React from 'react';
import IconButton from 'material-ui/IconButton';
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline';
import SocialPerson from 'material-ui/svg-icons/social/person';
import PropTypes from 'prop-types';

import './AuthButton.scss';

class AuthButton extends React.Component {

    static propTypes = {
        isAuthorizedUser: PropTypes.bool.isRequired,
        loginUrl: PropTypes.string.isRequired,
        logoutUrl: PropTypes.string.isRequired,
        signOutTooltipText: PropTypes.string,
        signInTooltipText: PropTypes.string
    };

    redirectUser = () => {
        const redirectUrl = this.props.isAuthorizedUser ? this.props.logoutUrl : this.props.loginUrl;
        const returnUrl = window.btoa(window.location.href);
        window.location.href = `${redirectUrl}?return=${returnUrl}`;
    }

    render() {
        return (
            <div className="auth-button-wrapper">
                <IconButton tooltipPosition="bottom-left" onClick={this.redirectUser}
                    tooltip={this.props.isAuthorizedUser ? this.props.signOutTooltipText : this.props.signInTooltipText}
                    className={this.props.isAuthorizedUser ? 'log-out-button' : 'log-in-button'}>
                    {this.props.isAuthorizedUser ? <SocialPerson /> : <SocialPersonOutline />}
                </IconButton>
            </div>
        );
    }
}

AuthButton.defaultProps = {
    signOutTooltipText: 'Log out',
    signInTooltipText: 'Log in'
};

export default AuthButton;
