jest.dontMock('./Dashboard');

import Dashboard from './Dashboard';
import * as mock from 'mock/data';


function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        account: testProps.account || mock.accounts.uqresearcher,
        authorDetails: testProps.authorDetails,
        accountAuthorDetailsLoading: testProps.accountAuthorDetailsLoading || false,
        loadingPublicationsByYear: testProps.loadingPublicationsByYear || false,
        publicationsByYear: testProps.publicationsByYear,
        publicationTypesCount: testProps.publicationTypesCount,
        possiblyYourPublicationsCount: testProps.possiblyYourPublicationsCount,
        hidePossiblyYourPublicationsLure: testProps.hidePossiblyYourPublicationsLure || false,
        publicationsList: testProps.publicationsList,
        loadingPublicationsStats: testProps.loadingPublicationsStats || false,
        publicationsStats: testProps.publicationsStats,
        possiblyYourPublicationsCountLoading: testProps.possiblyYourPublicationsCountLoading || false,
        actions: {
            countPossiblyYourPublications: jest.fn(),
            loadAuthorPublicationsStats: jest.fn(),
            searchLatestPublications: jest.fn(),
            searchTrendingPublications: jest.fn(),
            loadAuthorPublicationsByYear: jest.fn()
        },
        history: {}
    };
    return getElement(Dashboard, props, isShallow);
}

describe('Dashboard test', () => {

    it('renders alert for non-authors', () => {
        const wrapper = setup({account: mock.accounts.uqstaff});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders dashboard header only', () => {
        const wrapper = setup({authorDetails: mock.authorDetails.uqresearcher});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders possibly your publications lure but not the add a record lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 5,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('doesn\'t render possibly your publications lure or the add a record lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 5,
            hidePossiblyYourPublicationsLure: true,
            possiblyYourPublicationsCountLoading: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('doesn\'t render possibly your publications lure and shows the add a record lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 0,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('doesn\'t render either the publications lure or the add a record lure while the pub count is still loading', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: null,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
