jest.dontMock('./DashboardAuthorDetails');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardAuthorDetails from './DashboardAuthorDetails';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardAuthorDetails {...props} />);
}

describe('Dashboard Author Details test', () => {
    it('Render the authors details as expected for a UQ researcher)', () => {
        const props = {
            values: {
                given_name: 'J',
                family_name: 'Researcher',
                title: 'Professor',
                org_units: ['Institute for Molecular Bioscience', 'School of Chemistry and Molecular Biosciences', 'The University of Queensland Diamantina Institute'],
                positions: ['Affiliate Professor', 'Affiliate Professorial Res Fellow', 'ARC Australian Laureate Fellow'],
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
