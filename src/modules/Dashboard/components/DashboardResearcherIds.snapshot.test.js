jest.dontMock('./DashboardResearcherIds');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import DashboardResearcherIds from './DashboardResearcherIds';

function setup({values}) {
    const props = {
        values: {
            'publons': '1',
            'researcher': '2',
            'scopus': '3',
            'google_scholar': '4',
            'orcid': '5'
        }
    };
    return shallow(<DashboardResearcherIds {...props} />);
}

describe('Alert snapshots test', () => {
    it('Render the researcher IDs', () => {
        const values = {
            values: {
                'publons': '1',
                'researcher': '2',
                'scopus': '3',
                'google_scholar': '4',
                'orcid': '5'
            }
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
