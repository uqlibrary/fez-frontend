jest.dontMock('../components/AuthButton');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthButton from '../components/AuthButton';

function setup({
        isAuthorizedUser = false,
        loginUrl = 'https://login',
        logoutUrl = 'https://logout',
        loginText = 'login into the system',
        logoutText = 'logout'
    }) {
    const props = {isAuthorizedUser, loginUrl, logoutUrl, loginText, logoutText};
    return shallow(<AuthButton {...props} />);
}

describe('AuthButton snapshots test', () => {
    it('renders logged out status', () => {
        const wrapper = setup({isAuthorizedUser : false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders logged in user status', () => {
        const wrapper = setup({isAuthorizedUser : true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});