import React from 'react';
import IconButton from 'material-ui/IconButton';
import SocialPersonOutline from 'material-ui/svg-icons/social/person-outline';
import SocialPerson from 'material-ui/svg-icons/social/person';
import './AuthButton.scss';
import PropTypes from 'prop-types';

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

        if (isAuthorizedUser) {
            return (
                <div className="AuthButtonWrapper">
                    <IconButton tooltip={signOutMsg} tooltipPosition="bottom-left" className="LogOutButton">
                        <SocialPerson />
                    </IconButton>
                </div>
            )
                ;
        } else {
            return (
                <div className="AuthButtonWrapper">
                    <IconButton tooltip="Sign in" tooltipPosition="bottom-left" className="LogInButton">
                        <SocialPersonOutline />
                    </IconButton>
                </div>
            )
                ;
        }
    }
}

export default AuthButton;
