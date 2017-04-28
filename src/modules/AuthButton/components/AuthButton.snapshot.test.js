jest.dontMock('../components/AuthButton');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import AuthButton from '../components/AuthButton';

function setup(isAuthorizedUser) {
    return shallow(<AuthButton isAuthorizedUser={isAuthorizedUser} name="Test Name" />);
}

describe('AuthButton snapshots test', () => {
    it('renders a solid login icon', () => {
        const wrapper = setup(true);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders a outlined logout icon', () => {
        const wrapper = setup(false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});