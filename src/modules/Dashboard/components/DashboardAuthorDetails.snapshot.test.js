jest.dontMock('./DashboardAuthorDetails');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardAuthorDetails from './DashboardAuthorDetails';
import {authorDetails} from '../../../mock/data/authors/';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardAuthorDetails {...props} />);
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
