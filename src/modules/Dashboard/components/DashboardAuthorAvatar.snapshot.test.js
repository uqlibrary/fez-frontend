jest.dontMock('./DashboardAuthorAvatar');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardAuthorAvatar from './DashboardAuthorAvatar';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardAuthorAvatar {...props} />);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const props = {
            values: {
                uqr_id: '14',
                given_name: 'J',
                family_name: 'Researcher',
                title: 'Professor'
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
