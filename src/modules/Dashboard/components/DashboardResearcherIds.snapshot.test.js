jest.dontMock('./DashboardResearcherIds');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {currentAuthor} from 'mock/data';

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

        const publons = currentAuthor.uqresearcher.publons_id;
        const researcher = currentAuthor.uqresearcher.researcher_id;
        const scopus = currentAuthor.uqresearcher.scopus_id;
        const google_scholar = currentAuthor.uqresearcher.google_scholar_id;
        const orcid = currentAuthor.uqresearcher.orcid_id;
        values.values = {publons, researcher, scopus, google_scholar, orcid};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
