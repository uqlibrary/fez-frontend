jest.dontMock('./DashboardAuthorAvatar');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {authorDetails} from '../../../mock/data/authors/';

import DashboardAuthorAvatar from './DashboardAuthorAvatar';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardAuthorAvatar {...props} />);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const values = {
            values: {}
        };
        values.values = authorDetails.uqresearcher;
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
