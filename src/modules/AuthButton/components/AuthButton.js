import React from 'react';
import IconButton from 'material-ui/IconButton';
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline';
import SocialPerson from 'material-ui/svg-icons/social/person';
import PropTypes from 'prop-types';
import {AUTH_URL_LOGIN, AUTH_URL_LOGOUT} from '../../../config/general';

import './AuthButton.scss';

class AuthButton extends React.Component {

    static propTypes = {
        account: PropTypes.object,
        loaded: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            isAuthorizedUser: false
        };
    }

    redirectUser = () => {
        const redirectUrl = this.state.isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
        const returnUrl = window.btoa(window.location.href);
        window.location.href = `${redirectUrl}?return=${returnUrl}`;
    }

    render() {
        const {
            account,
            loaded
        } = this.props;

        this.setState({
            isAuthorizedUser: loaded === true && account !== null && account.get('mail')
        });

        const signOutMsg = `Sign out - ${account.get('name')}`;

        if (this.state.isAuthorizedUser) {
            return (
                <div className="AuthButtonWrapper">
                    <IconButton tooltip={signOutMsg} tooltipPosition="bottom-left" className="LogOutButton"
                                onClick={this.redirectUser}>
                        <SocialPerson />
                    </IconButton>
                </div>
            );
        } else {
            return (
                <div className="AuthButtonWrapper">
                    <IconButton tooltip="Sign in" tooltipPosition="bottom-left" className="LogInButton"
                                onClick={this.redirectUser}>
                        <SocialPersonOutline />
                    </IconButton>
                </div>
            );
        }
    }
}

export default AuthButton;
