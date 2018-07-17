import DashboardResearcherIds from './DashboardResearcherIds';
import {currentAuthor} from 'mock/data';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {...testProps};
    return getElement(DashboardResearcherIds, props, isShallow);
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
