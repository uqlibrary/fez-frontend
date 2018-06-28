jest.dontMock('./Dashboard');

import Dashboard from './Dashboard';
import * as mock from 'mock/data';

const publicationTotalCount = {
    articleCount: mock.currentAuthorStats.total,
    articleFirstYear: mock.currentAuthorStats.filters.facets.min_date_year_t.value_as_string,
    articleLastYear: mock.currentAuthorStats.filters.facets.max_date_year_t.value_as_string
};
function setup(testProps, isShallow = true) {
    const props = {
        account: mock.accounts.uqresearcher,
        accountAuthorDetailsLoading: false,
        publicationTotalCount: null,
        loadingPublicationsByYear: false,
        hidePossiblyYourPublicationsLure: false,
        loadingPublicationsStats: false,
        possiblyYourPublicationsCountLoading: false,
        actions: {
            countPossiblyYourPublications: jest.fn(),
            loadAuthorPublicationsStats: jest.fn()
        },
        history: {},
        ...testProps,
    };
    return getElement(Dashboard, props, isShallow);
}

describe('Dashboard test', () => {

    it('renders alert for non-authors', () => {
        const wrapper = setup({account: mock.accounts.uqstaff});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders dashboard header only', () => {
        const wrapper = setup({authorDetails: mock.authorDetails.uqresearcher, publicationTotalCount: publicationTotalCount});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders possibly your publications lure but not the add a record lure', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
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

    it('doesn\'t render the bar/donut graph cards when no data is available', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationsByYear: {series: {}},
            publicationTypesCount: []
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('does render the donut/bar graph cards when data is available', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationsByYear: {"series":[{"name":"Journal Article","data":[1,1,3,5,5,8,8,2,5,3,6,4,4,7,8,8,6,4,10,10,8,10,12,7,19,11,11,12,6,8,15,10,9,3,13,6,5,5]},{"name":"Conference Paper","data":[0,0,1,4,0,0,0,0,0,0,0,0,0,6,4,1,0,0,0,0,0,3,1,1,1,1,0,1,0,5,0,0,2,1,1,0,9,0]},{"name":"Book Chapter","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1,0,0,2,1,0,1,0,1,2,0,0,0,0,0,0,0]},{"name":"Book","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Other","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]}],"categories":[1977,1980,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]},
            publicationTypesCount: [["Journal Article",278],["Conference Paper",42],["Book Chapter",12],["Book",1],["Other",1]]
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('does navigate to records add find page when clicked addPublicationLure', () => {
        const testPushFn = jest.fn();
        const wrapper = setup({history: {push: testPushFn}});
        wrapper.instance()._addPublication();
        expect(testPushFn).toHaveBeenCalledWith('/records/add/find');
    });

    it('does render latest and trending publications tabs correctly', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('does render latest publications tab correctly', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: false
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('does render trending publications tab correctly', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            showLatestPublicationsTab: false,
            showTrendingPublicationsTab: true
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });


});
