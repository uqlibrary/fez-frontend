jest.dontMock('./DashboardAuthorDetails');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardAuthorDetails from './DashboardAuthorDetails';

function setup({title, familyName, givenName, orgUnits, positions}) {
    const props = {
        title: 'title',
        familyName: 'family name',
        givenName: 'given name',
        orgUnits: ['1', '2', '3'],
        positions: ['1', '2', '3'],
    };
    return shallow(<DashboardAuthorDetails {...props} />);
}

describe('Alert snapshots test', () => {
    it('Render the logged in users details', () => {
        const title = 'title';
        const familyName = 'given name';
        const givenName = 'family name';
        const orgUnits = ['1', '2', '3'];
        const positions = ['1', '2', '3'];

        const wrapper = setup(title, familyName, givenName, orgUnits, positions);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
