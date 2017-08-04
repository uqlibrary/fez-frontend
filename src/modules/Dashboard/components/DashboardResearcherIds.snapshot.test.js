jest.dontMock('./DashboardResearcherIds');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardResearcherIds from './DashboardResearcherIds';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardResearcherIds {...props} />);
}

describe('Dashboard Rsearcher IDs test', () => {
    it('Render the authors Researcher IDs as expected for a UQ researcher', () => {
        const props = {
            values: {
                scopus: '',
                google_scholar: '',
                researcher: 'G-111-1111',
                orcid: '0000-0001-1111-1111',
                publons: ''
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the authors Researcher IDs with weird values as expected for a UQ researcher', () => {
        const props = {
            values: {
                anId: 'This is an edge case example'
            }
        };
        const wrapper = setup(props);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
