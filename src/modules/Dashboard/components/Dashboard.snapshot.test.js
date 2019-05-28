import {DashboardClass} from './Dashboard';
import Dashboard from './Dashboard';
import * as mock from 'mock/data';

const publicationTotalCount = {
    articleCount: mock.currentAuthorStats.total,
    articleFirstYear: mock.currentAuthorStats.filters.facets.min_date_year_t.value_as_string,
    articleLastYear: mock.currentAuthorStats.filters.facets.max_date_year_t.value_as_string
};
function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        theme: {},
        account: mock.accounts.uqresearcher,
        accountAuthorDetailsLoading: false,
        publicationTotalCount: null,
        loadingPublicationsByYear: false,
        hidePossiblyYourPublicationsLure: false,
        loadingPublicationsStats: false,
        possiblyYourPublicationsCountLoading: false,
        actions: {
            countPossiblyYourPublications: jest.fn(),
            loadAuthorPublicationsStats: jest.fn(),
            searchAuthorPublications: jest.fn()
        },
        loadingIncompleteRecordData: false,
        history: {},
        ...testProps,
        incomplete: {
            publicationsListPagingData: {},
            loadingPublicationsList: false,
            publicationsList: [],
            publicationsListFacets: {},
            ...testProps.incomplete
        }
    };
    return getElement(DashboardClass, props, isShallow);
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

    it('_claimYourPublications method', () => {
        const testFn = jest.fn();
        const wrapper = setup({history: {push: testFn}});
        wrapper.instance()._claimYourPublications();
        expect(testFn).toBeCalledWith('/records/possible');

    });

    it('_addPublication method', () => {
        const testFn = jest.fn();
        const wrapper = setup({history: {push: testFn}});
        wrapper.instance()._addPublication();
        expect(testFn).toBeCalledWith('/records/add/find');

    });

    it('handleTabChange method', () => {
        const value = 'test';
        const wrapper = setup({});
        wrapper.instance().handleTabChange(null, value);
        wrapper.update();
        expect(wrapper.state()).toEqual({dashboardPubsTabs: value});

    });

    it('should get styles for full render', () => {
        const wrapper = setup({publicationTotalCount}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('publicationStats should render stats', () => {
        const wrapper = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: {count: 10},
                scopus_citation_count_i: {count: 10}
            },
            publicationsByYear: {"series":[{"name":"Journal Article","data":[1,1,3,5,5,8,8,2,5,3,6,4,4,7,8,8,6,4,10,10,8,10,12,7,19,11,11,12,6,8,15,10,9,3,13,6,5,5]},{"name":"Conference Paper","data":[0,0,1,4,0,0,0,0,0,0,0,0,0,6,4,1,0,0,0,0,0,3,1,1,1,1,0,1,0,5,0,0,2,1,1,0,9,0]},{"name":"Book Chapter","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1,0,0,2,1,0,1,0,1,2,0,0,0,0,0,0,0]},{"name":"Book","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Other","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]}],"categories":[1977,1980,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]},
            publicationTypesCount: [["Journal Article",278],["Conference Paper",42],["Book Chapter",12],["Book",1],["Other",1]]
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('publicationStats should render stats 1', () => {
        const wrapper = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: {count: 10},
                scopus_citation_count_i: {count: 0}
            },
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('publicationStats should render stats 2', () => {
        const wrapper = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: {count: 0},
                scopus_citation_count_i: {count: 10}
            },
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('publicationStats should not render stats 2', () => {
        const wrapper = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: true,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: {count: 0},
                scopus_citation_count_i: {count: 0}
            }
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should only render barChart', () => {
        const wrapper = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: undefined,
            publicationsByYear: {"series":[{"name":"Journal Article","data":[1,1,3,5,5,8,8,2,5,3,6,4,4,7,8,8,6,4,10,10,8,10,12,7,19,11,11,12,6,8,15,10,9,3,13,6,5,5]},{"name":"Conference Paper","data":[0,0,1,4,0,0,0,0,0,0,0,0,0,6,4,1,0,0,0,0,0,3,1,1,1,1,0,1,0,5,0,0,2,1,1,0,9,0]},{"name":"Book Chapter","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1,0,0,2,1,0,1,0,1,2,0,0,0,0,0,0,0]},{"name":"Book","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Other","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]}],"categories":[1977,1980,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]},
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Rendering MyTrendingPublications tab', () => {
        const wrapper = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: {count: 10},
                scopus_citation_count_i: {count: 10}
            },
            publicationsByYear: {"series":[{"name":"Journal Article","data":[1,1,3,5,5,8,8,2,5,3,6,4,4,7,8,8,6,4,10,10,8,10,12,7,19,11,11,12,6,8,15,10,9,3,13,6,5,5]},{"name":"Conference Paper","data":[0,0,1,4,0,0,0,0,0,0,0,0,0,6,4,1,0,0,0,0,0,3,1,1,1,1,0,1,0,5,0,0,2,1,1,0,9,0]},{"name":"Book Chapter","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1,0,0,2,1,0,1,0,1,2,0,0,0,0,0,0,0]},{"name":"Book","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"Other","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]}],"categories":[1977,1980,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017]},
            publicationTypesCount: [["Journal Article",278],["Conference Paper",42],["Book Chapter",12],["Book",1],["Other",1]],
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
        });
        wrapper.setState({
            dashboardPubsTabs: 1
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Rendering MyLatestPublications tab', () => {
        const wrapper = setup({
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
            publicationsStats: {
                thomson_citation_count_i: {count: 10},
                scopus_citation_count_i: {count: 10}
            },
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
        });
        wrapper.setState({
            dashboardPubsTabs: 2
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('componentDidMount without account id', () => {
        const wrapper = setup({
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            account: {id: null},
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
            publicationsStats: {
                thomson_citation_count_i: {count: 10},
                scopus_citation_count_i: {count: 10}
            },
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });


    it('Full mount for styles render', () => {
        const wrapper = getElement(Dashboard, {
            classes: {},
            theme: {},
            account: mock.accounts.uqresearcher,
            accountAuthorDetailsLoading: false,
            publicationTotalCount: null,
            loadingPublicationsByYear: false,
            hidePossiblyYourPublicationsLure: false,
            loadingPublicationsStats: false,
            possiblyYourPublicationsCountLoading: false,
            actions: {
                countPossiblyYourPublications: jest.fn(),
                loadAuthorPublicationsStats: jest.fn(),
                searchAuthorPublications: jest.fn()
            },
            incomplete: {
                publicationsListPagingData: {},
                loadingPublicationsList: false,
                publicationsList: [],
                publicationsListFacets: {},
            },
            history: {},
        }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it ('displays a lure when the user has incomplete NTRO submissions', () => {
        const wrapper = setup({
            incomplete: {
                publicationsListPagingData: {
                    "total": 2,
                    "took": 30,
                    "per_page": 20,
                    "current_page": 1,
                    "from": 1,
                    "to": 3,
                    "data": [1,2],
                    "filters": {}
                }
            },
            authorDetails: mock.authorDetails.uqresearcher,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it ('displays a lure to a single work when the user has incomplete NTRO submissions', () => {
        const wrapper = setup({
            incomplete: {
                publicationsListPagingData: {
                    "total": 1,
                    "took": 30,
                    "per_page": 20,
                    "current_page": 1,
                    "from": 1,
                    "to": 1,
                    "data": [1],
                    "filters": {}
                }
            },
            authorDetails: mock.authorDetails.uqresearcher,
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('redirectToMissingRecordslist method', () => {
        const testFn = jest.fn();
        const wrapper = setup({history: {push: testFn}});
        wrapper.instance().redirectToIncompleteRecordlist();
        expect(testFn).toBeCalledWith('/records/incomplete');
    });

});
