jest.dontMock('./DashboardResearcherIds');

import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import {currentAuthor} from 'mock/data';

import DashboardResearcherIds from './DashboardResearcherIds';

function setup({values, authenticated}) {
    const props = {values, authenticated};
    return shallow(<DashboardResearcherIds {...props} />);
}

describe('Dashboard Rsearcher IDs test', () => {
    it('Render the authors Researcher IDs as expected for a UQ researcher', () => {
        const values = {
            values: {},
            authenticated: {}
        };

        const publons = currentAuthor.uqresearcher.data.aut_publons_id;
        const researcher = currentAuthor.uqresearcher.data.aut_researcher_id;
        const scopus = currentAuthor.uqresearcher.data.aut_scopus_id;
        const google_scholar = currentAuthor.uqresearcher.data.aut_google_scholar_id;
        const orcid = currentAuthor.uqresearcher.data.aut_orcid_id;
        values.values = {publons, researcher, scopus, google_scholar, orcid};
        values.authenticated = {publons:false, researcher:true, scopus:false, google_scholar:false, orcid:true};
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
