jest.dontMock('./DashboardAuthorAvatar');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';

function setup({authorDetails}) {
    const props = {
        authorDetails: {
            'uqr_id': 410,
            title: 'title',
            given_name: 'given name',
            family_name: 'family name'
        }
    };
    return shallow(<DashboardAuthorAvatar {...props} />);
}

describe('Alert snapshots test', () => {
    it('Render the logged in users profile photo or fallback avatar', () => {
    const authorDetails = {
        'uqr_id': 410,
        title: 'title',
        given_name: 'given name',
        family_name: 'family name'
    };

    const wrapper = setup(authorDetails);
    expect(toJson(wrapper)).toMatchSnapshot();
});
});