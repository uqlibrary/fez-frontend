import React from 'react';
import IconButton from 'material-ui/IconButton';
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline';
import SocialPerson from 'material-ui/svg-icons/social/person';
import './AuthButton.scss';
import PropTypes from 'prop-types';
import {AUTH_URL_LOGIN, AUTH_URL_LOGOUT} from '../../config/general';

class AuthButton extends React.Component {

    static propTypes = {
        account: PropTypes.object,
        loaded: PropTypes.bool.isRequired,
    };

    render() {
        const {
            account,
            loaded
        } = this.props;

        const isAuthorizedUser = loaded === true && account !== null && account.get('mail');
        const signOutMsg = 'Sign out - ' + account.get('name');

        /**
         * Logs in user into the application
         * @void redirects to login url
         */

        function login() {
            const returnUrl = window.btoa(window.location.href);
            window.location.href = `${AUTH_URL_LOGIN}?return=${returnUrl}`;
        }

        /**
         * Logs user out
         * @void redirects to logout url
         */
        function logout() {
            const returnUrl = window.btoa(window.location.href);
            window.location.href = `${AUTH_URL_LOGOUT}?return=${returnUrl}`;
        }

        if (isAuthorizedUser) {
            return (
                <div className="AuthButtonWrapper">
                    <IconButton tooltip={signOutMsg} tooltipPosition="bottom-left" className="LogOutButton"
                                onClick={logout}>
                        <SocialPerson />
                    </IconButton>
                </div>
            )
                ;
        } else {
            return (
                <div className="AuthButtonWrapper">
                    <IconButton tooltip="Sign in" tooltipPosition="bottom-left" className="LogInButton"
                                onClick={login}>
                        <SocialPersonOutline />
                    </IconButton>
                </div>
            )
                ;
        }
    }
}

export default AuthButton;
