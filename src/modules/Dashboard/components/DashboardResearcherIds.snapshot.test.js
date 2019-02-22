import {DashboardResearcherIdsClass} from './DashboardResearcherIds';
import Dashboard from './DashboardResearcherIds';
import {currentAuthor} from 'mock/data';

function setup(testProps, isShallow = true) {
    // build full props list required by the component
    const props = {
        classes: {},
        theme: {},
        ...testProps
    };
    return getElement(DashboardResearcherIdsClass, props, isShallow);
}

describe('Dashboard Rsearcher IDs test', () => {
    it('Render the authors Researcher IDs as expected for a UQ researcher', () => {
        const values = {
            history: {},
            values: {
                publons: currentAuthor.uqresearcher.data.aut_publons_id,
                researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
                scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
                google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
                orcid: currentAuthor.uqresearcher.data.aut_orcid_id,
            },
            authenticated: {publons:false, researcher:true, scopus:false, google_scholar:false, orcid:true}
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('navigateToRoute method', () => {
        const testFn = jest.fn();
        const values = {
            history: {push: testFn},
            values: {
                publons: currentAuthor.uqresearcher.data.aut_publons_id,
                researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
                scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
                google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
                orcid: currentAuthor.uqresearcher.data.aut_orcid_id,
            },
            authenticated: {publons:false, researcher:true, scopus:false, google_scholar:false, orcid:true}
        };
        const wrapper = setup(values);
        wrapper.instance().navigateToRoute(null, 'publons');
        expect(testFn).toHaveBeenCalledWith("http://guides.library.uq.edu.au/for-researchers/researcher-identifier/publons");

    });

    it('Testing clicking on ID internal links', () => {
        const testFn = jest.fn();
        const values = {
            history: {push: testFn},
            values: {
                publons: currentAuthor.uqresearcher.data.aut_publons_id,
                researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
                scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
                google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
                orcid: null // currentAuthor.uqresearcher.data.aut_orcid_id,
            },
            authenticated: {publons:false, researcher:false, scopus:false, google_scholar:false, orcid:false}
        };
        const wrapper = setup(values);
        const navigateToRoute = jest.spyOn(wrapper.instance(), 'navigateToRoute');
        const button = wrapper.find('#orcid');
        expect(button.length).toEqual(1);
        button.forEach(button => {
            button.simulate('click');
            expect(navigateToRoute).toHaveBeenCalled();
        });
        button.forEach(button => {
            button.simulate('keypress', {key: 'Enter'});
            expect(navigateToRoute).toHaveBeenCalled();
        });

    });

    it('Testing styles on unauth internal links', () => {
        const testFn = jest.fn();
        const values = {
            history: {push: testFn},
            values: {
                publons: currentAuthor.uqresearcher.data.aut_publons_id,
                researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
                scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
                google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
                orcid: null
            },
            authenticated: {publons:false, researcher:false, scopus:false, google_scholar:false, orcid: false}
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Testing styles on auth internal links', () => {
        const testFn = jest.fn();
        const values = {
            history: {push: testFn},
            values: {
                publons: currentAuthor.uqresearcher.data.aut_publons_id,
                researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
                scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
                google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
                orcid: null
            },
            authenticated: {publons:true, researcher:true, scopus:true, google_scholar:true, orcid: true}
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Testing orcid caption', () => {
        const testFn = jest.fn();
        const values = {
            history: {push: testFn},
            values: {
                publons: currentAuthor.uqresearcher.data.aut_publons_id,
                researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
                scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
                google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
                orcid: currentAuthor.uqresearcher.data.aut_orcid_id,
            },
            authenticated: {publons:true, researcher:true, scopus:true, google_scholar:true, orcid: true}
        };
        const wrapper = setup(values);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Full mount render to test withStyles/Theme', () => {
        const testFn = jest.fn();
        const values = {
            classes: {},
            theme: {},
            history: {push: testFn},
            values: {
                publons: currentAuthor.uqresearcher.data.aut_publons_id,
                researcher: currentAuthor.uqresearcher.data.aut_researcher_id,
                scopus: currentAuthor.uqresearcher.data.aut_scopus_id,
                google_scholar: currentAuthor.uqresearcher.data.aut_google_scholar_id,
                orcid: currentAuthor.uqresearcher.data.aut_orcid_id,
            },
            authenticated: {publons:true, researcher:true, scopus:true, google_scholar:true, orcid: true}
        };
        const wrapper = getElement(Dashboard, values, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
