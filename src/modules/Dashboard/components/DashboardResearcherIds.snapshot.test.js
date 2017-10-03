jest.dontMock('./DashboardResearcherIds');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {authorDetails} from 'mock/data';

import DashboardResearcherIds from './DashboardResearcherIds';

function setup({values}) {
    const props = {values};
    return shallow(<DashboardResearcherIds {...props} />);
}

describe('Dashboard Rsearcher IDs test', () => {
    it('Render the authors Researcher IDs as expected for a UQ researcher', () => {
        const values = {
            values: {}
        };

        const publons = authorDetails.uqresearcher.publons_id;
        const researcher = authorDetails.uqresearcher.researcher_id;
        const scopus = authorDetails.uqresearcher.scopus_id;
        const google_scholar = authorDetails.uqresearcher.google_scholar_id;
        const orcid = authorDetails.uqresearcher.orcid_id;
        values.values = {publons, researcher, scopus, google_scholar, orcid};
        const wrapper = setup(values);
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
