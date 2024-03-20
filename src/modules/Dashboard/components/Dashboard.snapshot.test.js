import React from 'react';
import Dashboard, { fibonacci, isWaitingForSync } from './Dashboard';
import * as mock from 'mock/data';
import { initialState as orcidSyncInitialState } from 'reducers/orcidSync';
import { render, WithReduxStore, WithRouter, fireEvent } from 'test-utils';

const publicationTotalCount = {
    account: mock.accounts.uqresearcher,
    articleCount: mock.currentAuthorStats.total,
    articleFirstYear: mock.currentAuthorStats.filters.facets.min_date_year_t.value_as_string,
    articleLastYear: mock.currentAuthorStats.filters.facets.max_date_year_t.value_as_string,
};

const mockActions = {
    countPossiblyYourPublications: jest.fn(),
    loadAuthorPublicationsStats: jest.fn(),
    searchAuthorPublications: jest.fn(),
    loadOrcidSyncStatus: jest.fn(),
};

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

function setup(testProps = {}, renderMethod = render) {
    const props = {
        theme: {},
        author: mock.currentAuthor.uqresearcher.data,
        account: mock.accounts.uqresearcher,
        authorDetails: {
            is_administrator: 0,
            is_super_administrator: 0,
            espace: {
                first_year: '1998',
                last_year: '2000',
                doc_count: 32,
            },
        },
        accountAuthorDetailsLoading: false,
        publicationTotalCount: null,
        loadingPublicationsByYear: false,
        hidePossiblyYourPublicationsLure: false,
        loadingPublicationsStats: false,
        possiblyYourPublicationsCountLoading: false,
        actions: mockActions,
        loadingIncompleteRecordData: false,
        incomplete: {
            publicationsListPagingData: {},
            loadingPublicationsList: false,
            publicationsList: [],
            publicationsListFacets: {},
            ...testProps.incomplete,
        },
        ...orcidSyncInitialState,
        ...testProps,
    };
    return renderMethod(
        <WithReduxStore>
            <WithRouter>
                <Dashboard {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Dashboard test', () => {
    afterEach(() => {
        Object.values(mockActions).forEach(action => {
            action.mockClear();
        });
        mockUseNavigate.mockRestore();
    });

    it('renders alert for non-authors', () => {
        const { container } = setup({ account: mock.accounts.uqstaff });
        expect(container).toMatchSnapshot();
    });

    it('renders loading for authors', () => {
        const { container } = setup({
            account: mock.accounts.uqstaff,
            author: { aut_id: 1 },
            loadingPublicationsByYear: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('renders dashboard header only', () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
        });
        expect(container).toMatchSnapshot();
    });

    it('renders possibly your publications lure but not the add a record lure', () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
            possiblyYourPublicationsCount: 5,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: false,
        });
        expect(container).toMatchSnapshot();
    });

    it("doesn't render possibly your publications lure or the add a record lure", () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 5,
            hidePossiblyYourPublicationsLure: true,
            possiblyYourPublicationsCountLoading: false,
        });
        expect(container).toMatchSnapshot();
    });

    it("doesn't render possibly your publications lure and shows the add a record lure", () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            possiblyYourPublicationsCount: 0,
            hidePossiblyYourPublicationsLure: false,
            possiblyYourPublicationsCountLoading: false,
        });
        expect(container).toMatchSnapshot();
    });

    it(
        "doesn't render either the publications lure or the add a " +
            'record lure while the pub count is still loading',
        () => {
            const { container } = setup({
                authorDetails: mock.authorDetails.uqresearcher,
                possiblyYourPublicationsCount: null,
                hidePossiblyYourPublicationsLure: false,
                possiblyYourPublicationsCountLoading: true,
            });
            expect(container).toMatchSnapshot();
        },
    );

    it("doesn't render the bar/donut graph cards when no data is available", () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationsByYear: { series: {} },
            publicationTypesCount: [],
        });
        expect(container).toMatchSnapshot();
    });

    it('does render the donut/bar graph cards when data is available', () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            /* eslint-disable max-len */
            // prettier-ignore
            publicationsByYear: {
                'series': [
                    { 'name': 'Journal Article', 'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 8, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5, 5] },
                    { 'name': 'Conference Paper', 'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 9, 0] },
                    { 'name': 'Book Chapter', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Book', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Other', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                ],
                'categories': [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
            },
            /* eslint-enable max-len */
            publicationTypesCount: [
                ['Journal Article', 278],
                ['Conference Paper', 42],
                ['Book Chapter', 12],
                ['Book', 1],
                ['Other', 1],
            ],
        });
        expect(container).toMatchSnapshot();
    });

    it('does navigate to records add find page when clicked addPublicationLure', () => {
        const { getByTestId } = setup({});
        fireEvent.click(getByTestId('action-button'));
        expect(mockUseNavigate).toHaveBeenCalledWith('/records/add/find');
    });

    it('does render latest and trending publications tabs correctly', () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('does render latest publications tab correctly', () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: false,
        });
        expect(container).toMatchSnapshot();
    });

    it('does render trending publications tab correctly', () => {
        const { container } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            showLatestPublicationsTab: false,
            showTrendingPublicationsTab: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('_claimYourPublications method', () => {
        const { getByTestId } = setup({ possiblyYourPublicationsCount: 5 });
        fireEvent.click(getByTestId('action-button'));
        expect(mockUseNavigate).toBeCalledWith('/records/possible');
    });

    it('handleTabChange method', () => {
        const { getByRole } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
        });

        expect(getByRole('tab', { selected: true })).toHaveTextContent('My works');
        fireEvent.click(getByRole('tab', { selected: false }));
        expect(getByRole('tab', { selected: true })).toHaveTextContent('My trending works');
    });

    it('should get styles for full render', () => {
        const { container } = setup({ publicationTotalCount });
        expect(container).toMatchSnapshot();
    });

    it('publicationStats should render stats', () => {
        const { container } = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: { count: 10 },
                scopus_citation_count_i: { count: 10 },
            },
            /* eslint-disable max-len */
            // prettier-ignore
            publicationsByYear: {
                'series': [
                    { 'name': 'Journal Article', 'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 8, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5, 5] },
                    { 'name': 'Conference Paper', 'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 9, 0] },
                    { 'name': 'Book Chapter', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Book', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Other', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                ],
                'categories': [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
            },
            /* eslint-enable max-len */
            publicationTypesCount: [
                ['Journal Article', 278],
                ['Conference Paper', 42],
                ['Book Chapter', 12],
                ['Book', 1],
                ['Other', 1],
            ],
        });

        expect(container).toMatchSnapshot();
    });

    it('publicationStats should render stats with ancient date', () => {
        const { container } = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: { count: 10, years: '1000 - 2019' },
                scopus_citation_count_i: { count: 10, years: '1000 - 2019' },
            },
            /* eslint-disable max-len */
            // prettier-ignore
            publicationsByYear: {
                'series': [
                    { 'name': 'Journal Article', 'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 8, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5, 5] },
                    { 'name': 'Conference Paper', 'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 9, 0] },
                    { 'name': 'Book Chapter', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Book', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Other', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                ],
                'categories': [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
            },
            /* eslint-enable max-len */
            publicationTypesCount: [
                ['Journal Article', 278],
                ['Conference Paper', 42],
                ['Book Chapter', 12],
                ['Book', 1],
                ['Other', 1],
            ],
        });
        // wrapper.update();
        expect(container).toMatchSnapshot();
    });

    it('publicationStats should render stats with ancient date without author data', () => {
        const { container } = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: { count: 10, years: '1000 - 2019' },
                scopus_citation_count_i: { count: 10, years: '1000 - 2019' },
            },
            /* eslint-disable max-len */
            // prettier-ignore
            publicationsByYear: {
                'series': [
                    { 'name': 'Journal Article', 'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 8, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5, 5] },
                    { 'name': 'Conference Paper', 'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 9, 0] },
                    { 'name': 'Book Chapter', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Book', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Other', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                ],
                'categories': [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
            },
            /* eslint-enable max-len */
            publicationTypesCount: [
                ['Journal Article', 278],
                ['Conference Paper', 42],
                ['Book Chapter', 12],
                ['Book', 1],
                ['Other', 1],
            ],
            authorDetails: null,
        });

        expect(container).toMatchSnapshot();
    });

    it('publicationStats should render stats 1', () => {
        const { container } = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: { count: 10 },
                scopus_citation_count_i: { count: 0 },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('publicationStats should render stats 2', () => {
        const { container } = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: { count: 0 },
                scopus_citation_count_i: { count: 10 },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('publicationStats should not render stats 2', () => {
        const { container } = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: true,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: { count: 0 },
                scopus_citation_count_i: { count: 0 },
            },
        });

        expect(container).toMatchSnapshot();
    });

    it('Should only render barChart', () => {
        const { container } = setup({
            publicationTotalCount,
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: undefined,
            /* eslint-disable max-len */
            // prettier-ignore
            publicationsByYear: {
                'series': [
                    { 'name': 'Journal Article', 'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 8, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5, 5] },
                    { 'name': 'Conference Paper', 'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 9, 0] },
                    { 'name': 'Book Chapter', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Book', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Other', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                ],
                'categories': [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
            // eslint-disable-next-line prettier/prettier
            },
        });

        /* eslint-enable max-len */
        expect(container).toMatchSnapshot();
    });

    it('Rendering MyTrendingPublications tab', () => {
        const { container, getByRole } = setup({
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            publicationsStats: {
                thomson_citation_count_i: { count: 10 },
                scopus_citation_count_i: { count: 10 },
            },
            /* eslint-disable max-len */
            // prettier-ignore
            publicationsByYear: {
                'series': [
                    { 'name': 'Journal Article', 'data': [1, 1, 3, 5, 5, 8, 8, 2, 5, 3, 6, 4, 4, 7, 8, 8, 6, 4, 10, 10, 8, 10, 12, 7, 19, 11, 11, 12, 6, 8, 15, 10, 9, 3, 13, 6, 5, 5] },
                    { 'name': 'Conference Paper', 'data': [0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 4, 1, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 0, 1, 0, 5, 0, 0, 2, 1, 1, 0, 9, 0] },
                    { 'name': 'Book Chapter', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Book', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                    { 'name': 'Other', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                ],
                'categories': [1977, 1980, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
            },
            /* eslint-enable max-len */
            publicationTypesCount: [
                ['Journal Article', 278],
                ['Conference Paper', 42],
                ['Book Chapter', 12],
                ['Book', 1],
                ['Other', 1],
            ],
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
        });
        expect(getByRole('tab', { selected: false })).toHaveTextContent('My trending works');
        fireEvent.click(getByRole('tab', { selected: false }));
        expect(container).toMatchSnapshot();
    });

    it('Rendering MyLatestPublications tab', () => {
        const { container } = setup({
            // loading
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
            publicationsStats: {
                thomson_citation_count_i: { count: 10 },
                scopus_citation_count_i: { count: 10 },
            },
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
            actions: mockActions,
        });
        expect(container).toMatchSnapshot();
    });

    it('componentDidMount without account id', () => {
        const { container } = setup({
            loadingPublicationsByYear: false,
            accountAuthorDetailsLoading: false,
            loadingPublicationsStats: false,
            account: { id: null },
            authorDetails: mock.authorDetails.uqresearcher,
            publicationTotalCount: publicationTotalCount,
            publicationsStats: {
                thomson_citation_count_i: { count: 10 },
                scopus_citation_count_i: { count: 10 },
            },
            showLatestPublicationsTab: true,
            showTrendingPublicationsTab: true,
        });
        expect(container).toMatchSnapshot();
    });

    it('displays a lure when the user has incomplete NTRO submissions', () => {
        const { container } = setup({
            incomplete: {
                publicationsList: [],
                publicationsListPagingData: {
                    total: 2,
                    took: 30,
                    per_page: 20,
                    current_page: 1,
                    from: 1,
                    to: 3,
                    data: [1, 2],
                    filters: {},
                },
            },
            authorDetails: mock.authorDetails.uqresearcher,
        });
        expect(container).toMatchSnapshot();
    });

    it('displays a lure to a single work when the user has incomplete NTRO submissions', () => {
        const { container } = setup({
            incomplete: {
                publicationsList: [],
                publicationsListPagingData: {
                    total: 1,
                    took: 30,
                    per_page: 20,
                    current_page: 1,
                    from: 1,
                    to: 1,
                    data: [1],
                    filters: {},
                },
            },
            authorDetails: mock.authorDetails.uqresearcher,
        });
        expect(container).toMatchSnapshot();
    });

    it('redirectToMissingRecordslist method', () => {
        const { getByText } = setup({
            incomplete: {
                publicationsList: [],
                publicationsListPagingData: {
                    total: 1,
                    took: 30,
                    per_page: 20,
                    current_page: 1,
                    from: 1,
                    to: 1,
                    data: [1],
                    filters: {},
                },
            },
            authorDetails: mock.authorDetails.uqresearcher,
        });
        fireEvent.click(getByText(/View and Complete/i));
        expect(mockUseNavigate).toBeCalledWith('/records/incomplete');
    });

    /* it('calls action to sync to ORCID', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
            loadingOrcidSyncStatus: false,
            orcidSyncEnabled: true,
            actions: {
                ...mockActions,
                requestOrcidSync: testFn,
            },
        });

        fireEvent.click(getByTestId('help-icon-orcid'));
        expect(testFn).toHaveBeenCalledTimes(1);
    });*/

    it('sets context for showing ORCID sync UI', () => {
        const { container } = setup({
            orcidSyncEnabled: true,
            loadingOrcidSyncStatus: false,
        });
        expect(container).toMatchSnapshot();
    });

    it('should have helper to generate fibonacci numbers', () => {
        const fibonacciSeries = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
        fibonacciSeries.forEach((num, index) => {
            expect(fibonacci(index)).toBe(num);
        });
    });

    it('should have helper to determine orcId loading status', () => {
        expect(isWaitingForSync({ orj_status: 'Pending' })).toBe(true);
        expect(isWaitingForSync({ orj_status: 'In Progress' })).toBe(true);
        expect(isWaitingForSync({ orj_status: 'Fail' })).toBe(false);
        expect(isWaitingForSync({ other_status: 'Pending' })).toBe(false);
        expect(isWaitingForSync({})).toBe(false);
        expect(isWaitingForSync()).toBe(false);
    });

    it('should wait for ORCID sync to complete', () => {
        jest.useFakeTimers();
        const { container, rerender } = setup({
            orcidSyncEnabled: false,
            loadingOrcidSyncStatus: true,
        });
        jest.runAllTimers();
        setup(
            {
                orcidSyncEnabled: true,
                loadingOrcidSyncStatus: false,
                orcidSyncStatus: {
                    orj_status: 'Pending',
                },
            },
            rerender,
        );
        jest.runAllTimers();
        expect(mockActions.loadOrcidSyncStatus).toHaveBeenCalledTimes(1);
        setup(
            {
                orcidSyncEnabled: true,
                loadingOrcidSyncStatus: false,
                orcidSyncStatus: null,
            },
            rerender,
        );
        expect(container).toMatchSnapshot();
    });
});
