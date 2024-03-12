import React from 'react';
import { default as SearchRecords, normaliseDisplayLookup } from './SearchRecords';
import { pathConfig } from 'config';
import { act, fireEvent, renderWithRouter, WithReduxStore, createMatchMedia, within } from 'test-utils';
import * as UserIsAdminHook from 'hooks/userIsAdmin';
import { EXPORT_FORMAT_TO_EXTENSION, COLLECTION_VIEW_TYPE } from 'config/general';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { queryParamsDefaults } from '../hooks';
import param from 'can-param';

/**
 * @type Object
 */

const searchQuery = {
    page: 1,
    pageSize: 20,
    sortBy: 'score',
    sortDirection: 'Desc',
    activeFacets: {
        filters: {},
        ranges: {},
    },
};

/**
 * @type Object
 */

const props = {
    publicationsList: [
        {
            rek_title: 'Title 01',
            rek_pid: 1,
        },
        {
            rek_title: 'Title 02',
            rek_pid: 2,
        },
    ],
    publicationsListPagingData: {
        from: 10,
        to: 30,
        total: 100,
        per_page: 20,
        current_page: 1,
    },
    searchQuery,
    publicationsListFacets: {
        'Author (lookup)': {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 185,
            buckets: [
                { key: 'Martin, Sally', doc_count: 68 },
                { key: 'Parton, Robert G.', doc_count: 22 },
                { key: 'Meunier, Frederic A.', doc_count: 13 },
                { key: 'Andreas Papadopulos', doc_count: 9 },
                { key: 'Rachel Sarah Gormal', doc_count: 8 },
            ],
        },
        Subject: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 66,
            buckets: [
                { key: 450009, doc_count: 19 },
                { key: 453239, doc_count: 9 },
                { key: 270104, doc_count: 8 },
                { key: 450774, doc_count: 8 },
                { key: 453253, doc_count: 7 },
            ],
        },
        Author: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 185,
            buckets: [
                { key: 745, doc_count: 68 },
                { key: 824, doc_count: 22 },
                { key: 2746, doc_count: 13 },
                { key: 89985, doc_count: 9 },
                { key: 10992, doc_count: 8 },
            ],
        },
        Subtype: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 2,
            buckets: [
                { key: 'Article (original research)', doc_count: 50 },
                { key: 'Published abstract', doc_count: 9 },
                { key: 'Critical review of research, literature review, critical commentary', doc_count: 3 },
                { key: 'Fully published paper', doc_count: 2 },
                { key: 'Editorial', doc_count: 1 },
            ],
        },
    },
};

/**
 * @param history
 * @param params
 */

const assertQueryString = (history, params) => {
    const { activeFacets } = params;
    expect(history.location.search.substr(1)).toEqual(param({ activeFacets, ...params }));
};

/**
 * @param getByTestId
 * @param api
 * @param history
 * @param params
 */

const doSimpleSearch = (getByTestId, api, history, params) => {
    fireEvent.change(getByTestId('simple-search-input'), { target: { value: params.searchQueryParams.all } });
    fireEvent.click(getByTestId('simple-search-button'));
    assertQueryString(history, params);
    expect(api).toHaveBeenLastCalledWith(params);
};

/**
 * @param props
 * @param history
 * @param renderMethod
 * @return {*}
 */
const setup = (props = {}, renderMethod = render) => {
    const testProps = {
        publicationsList: [],
        searchLoading: false,
        exportPublicationsLoading: false,
        isAdvancedSearch: false,
        isUnpublishedBufferPage: false,
        location: {
            search: '?searchQueryParams%5Ball%5D=test',
        },
        history: createMemoryHistory(),
        ...props,
        actions: {
            clearSearchQuery: jest.fn(),
            exportEspacePublications: jest.fn(),
            resetExportPublicationsStatus: jest.fn(),
            searchEspacePublications: jest.fn(),
            ...props.actions,
        },
    };
    return renderWithRouter(
        <WithReduxStore>
            <SearchRecords {...testProps} />
        </WithReduxStore>,
        { history: testProps.history, renderMethod },
    );
};

describe('SearchRecords page', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    it('should render placeholders', () => {
        const { getByText, getByTestId } = setup();
        expect(getByTestId('simple-search-input')).toBeInTheDocument();
        expect(getByTestId('simple-search-button')).toBeInTheDocument();
        expect(getByText('Search')).toBeInTheDocument();
        expect(getByTestId('show-advanced-search')).toBeInTheDocument();
    });

    it('should render advanced search component', () => {
        const { getByTestId, getByText } = setup({ isAdvancedSearch: true });
        expect(getByTestId('advanced-search-form')).toBeInTheDocument();
        expect(getByText('Advanced search')).toBeInTheDocument();
        expect(getByTestId('KeyboardArrowUpIcon')).toBeInTheDocument();
        // expect(getByTestId('minimize-advanced-search')).toBeInTheDocument();
        expect(getByText('Select a field')).toBeInTheDocument();
        expect(getByText('Please select a field to search')).toBeInTheDocument();
    });

    it('should render loading screen while loading search results', () => {
        const { getAllByText } = setup({ searchLoading: true });
        expect(getAllByText('Searching for works').length).toBe(3);
    });

    it('should render loading screen while loading publications while filtering', () => {
        const { getAllByText } = setup({ publicationsList: [1, 2, 2], searchLoading: true });
        expect(getAllByText('Searching for works').length).toBe(3);
    });

    it('should render loading screen while export publications loading', () => {
        const { getByText } = setup({ publicationsList: [1, 2, 2], exportPublicationsLoading: true });
        expect(getByText('Searching for works')).toBeInTheDocument();
        expect(getByText('Exporting search results')).toBeInTheDocument();
    });

    it('should render no results', () => {
        const { getByText } = setup({
            publicationsList: [],
            searchQuery: {
                title: 'this is test',
                activeFacets: {
                    filters: {},
                    ranges: {},
                },
            },
        });
        expect(getByText('No works found')).toBeInTheDocument();
        expect(getByText('We were unable to find any results.')).toBeInTheDocument();
    });

    it('should run constructor without valid search location', () => {
        const { getByText } = setup({
            location: {
                search: 'test',
            },
        });
        expect(getByText('Search')).toBeInTheDocument();
    });

    it('should render when paging', () => {
        const { getByText } = setup({
            publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
            publicationsListPagingData: {
                from: 10,
                to: 20,
                total: 100,
            },
        });
        expect(getByText('Displaying works 10 to 20 of 100 total works.')).toBeInTheDocument();
    });

    it('should show facets even if there are no results', () => {
        const { getByText } = setup({
            publicationsListFacets: {
                'Some Facet': {
                    buckets: [{ key: 'example 1' }],
                },
                'Another Facet': {
                    buckets: [{ key: 'example 2' }],
                },
            },
            searchQuery: {
                title: 'this is test',
            },
            publicationsList: [],
        });
        expect(getByText('Some Facet')).toBeInTheDocument();
        expect(getByText('Another Facet')).toBeInTheDocument();
    });

    it('should update the queryString and make API call when page size is changed', () => {
        const historyMock = createMemoryHistory();
        const testPushFn = jest.spyOn(historyMock, 'push');
        const testAction = jest.fn();

        const { getAllByRole, getByTestId } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
            history: historyMock,
        });

        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(4);
        fireEvent.click(getAllByRole('option')[2]);

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=1&pageSize=50&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should update the queryString and make API call when page is changed', () => {
        const historyMock = createMemoryHistory();
        const testPushFn = jest.spyOn(historyMock, 'push');
        const testAction = jest.fn();

        const { getByTestId } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
            history: historyMock,
        });

        fireEvent.click(getByTestId('search-records-paging-top-select-page-2'));

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=2&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should update the queryString and make API call when sort direction is changed', () => {
        const historyMock = createMemoryHistory();
        const testPushFn = jest.spyOn(historyMock, 'push');
        const testAction = jest.fn();

        const { getAllByRole, getByTestId } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
            history: historyMock,
        });

        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-order')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(2); // Desc and Asc
        fireEvent.click(getAllByRole('option')[1]);

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=1&pageSize=20&sortBy=score&sortDirection=Asc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should search records when advanced search options are updated', () => {
        const testAction = jest.fn();
        const { getByTestId } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
        });

        fireEvent.click(getByTestId('show-advanced-search'));

        fireEvent.change(getByTestId('from'), { target: { value: '2015' } });
        fireEvent.change(getByTestId('to'), { target: { value: '2018' } });

        fireEvent.click(getByTestId('advanced-search'));

        expect(testAction).toHaveBeenNthCalledWith(1, {
            ...searchQuery,
            searchQueryParams: {
                all: 'test',
            },
        });

        expect(testAction).toHaveBeenNthCalledWith(2, {
            ...searchQuery,
            searchMode: 'advanced',
            activeFacets: {
                filters: {},
                ranges: { 'Year published': { from: '2015', to: '2018' } },
            },
        });
    });

    it('should handle set excluded facets correctly from searchfields sent from searchComponent', () => {
        const { getByTestId, getAllByRole } = setup(props);

        // Do one advanced search
        fireEvent.click(getByTestId('show-advanced-search'));
        fireEvent.click(getByTestId('advanced-search'));

        expect(getByTestId('facets-filter')).toHaveTextContent('Author');

        // Do another advanced search
        fireEvent.mouseDown(getByTestId('field-type-select'));
        expect(getAllByRole('option').length).toBe(18);
        expect(getAllByRole('option')[5]).toHaveTextContent('Author Name');

        fireEvent.click(getAllByRole('option')[5]);
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        fireEvent.click(getByTestId('advanced-search'));

        expect(getByTestId('facets-filter')).not.toHaveTextContent('Author');

        // search again without changing terms
        fireEvent.click(getByTestId('advanced-search'));
        // should still be hidden
        expect(getByTestId('facets-filter')).not.toHaveTextContent('Author');
    });

    it('should update the queryString and make API call when facet is changed', () => {
        const historyMock = createMemoryHistory();
        const testPushFn = jest.spyOn(historyMock, 'push');
        const testAction = jest.fn();

        const { getByTestId, getByText } = setup({
            ...props,
            isAdvancedSearch: true,
            actions: {
                searchEspacePublications: testAction,
            },
            history: historyMock,
        });

        fireEvent.click(getByTestId('clickable-facet-category-author'));
        fireEvent.click(getByText('Martin, Sally (68)'));

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'activeFacets%5Bfilters%5D%5BAuthor%5D=745&activeFacets%5BshowOpenAccessOnly%5D=false&page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should not call the search API when clicking a works title', () => {
        const historyMock = createMemoryHistory();
        const testPushFn = jest.spyOn(historyMock, 'push');
        const testAction = jest.fn();

        const { getByText } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
            history: historyMock,
        });

        fireEvent.click(getByText('Title 01'));

        // this is the initial call when the component loads,
        // without bug fix in #182603156 the "toHaveBeenCalledTimes" value here would be 2
        expect(testAction).toHaveBeenCalledTimes(1);
        expect(testPushFn).toHaveBeenCalledWith('/view/1');
    });

    it('should set history to unpublished path if pathname matches it', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);
        const historyMock = createMemoryHistory();
        const testPushFn = jest.spyOn(historyMock, 'push');

        const { getAllByRole, getByTestId } = setup({
            history: historyMock,
            location: {
                pathname: pathConfig.admin.unpublished,
                search: '',
            },
            publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
            publicationsListPagingData: {
                current_page: 1,
                from: 10,
                page_size: 20,
                to: 20,
                total: 100,
            },
        });

        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(4);
        fireEvent.click(getAllByRole('option')[2]);

        expect(testPushFn).toHaveBeenCalledWith({
            pathname: pathConfig.admin.unpublished,
            search: 'page=1&pageSize=50&sortBy=score&sortDirection=Desc',
        });
        userIsAdmin.mockRestore();
    });

    it('should call updateSearch() method if query search parameters with searchQueryParams key found', () => {
        const testAction = jest.fn();
        setup({
            location: {
                search: '?searchQueryParams=something%2Dinteresting',
            },
            actions: {
                searchEspacePublications: testAction,
            },
        });
        expect(testAction).toHaveBeenCalled();
    });

    it('renders loading screen while export publications loading', () => {
        const { getByText } = setup({
            exportPublicationsLoading: true,
        });
        expect(getByText('Searching for works')).toBeInTheDocument();
    });

    it('renders error alert if error occurs during search', () => {
        const { getByTestId, getByText } = setup({ searchLoadingError: true });
        expect(getByTestId('alert-error')).toBeInTheDocument();
        expect(getByText('Error -')).toBeInTheDocument();
    });

    it('should handle export publications correctly', () => {
        const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        const testExportAction = jest.fn();
        const searchQuery = {
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            activeFacets: {
                filters: {},
                ranges: {
                    'Year published': {
                        from: '2008',
                        to: '2023',
                    },
                },
                showOpenAccessOnly: false,
            },
        };
        const queryString =
            'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5B' +
            'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
            'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false';
        const testProps = {
            actions: {
                exportEspacePublications: testExportAction,
                searchEspacePublications: jest.fn(),
            },
            publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
            publicationsListPagingData: {
                from: 10,
                current_page: 1,
                page_size: 20,
                to: 20,
                total: 100,
            },
            location: {
                search: queryString,
            },
            canUseExport: true,
            searchQuery,
        };

        const { getAllByRole, getByTestId, rerender } = setup(testProps);
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));

        expect(getAllByRole('option').length).toBe(4);
        const pageSizeOptionElement = getAllByRole('option')[2];
        fireEvent.click(pageSizeOptionElement);

        setup(
            {
                ...testProps,
                location: {
                    search: queryString.replace('pageSize=20', `pageSize=${pageSizeOptionElement.textContent}`),
                },
            },
            rerender,
        );

        fireEvent.mouseDown(within(getByTestId('export-publications-format')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(3);
        fireEvent.click(getAllByRole('option')[1]);

        expect(testExportAction).toHaveBeenCalledWith({
            ...searchQuery,
            age: '1', // not sure what this is!
            pageSize: 50,
            exportPublicationsFormat: format,
        });
    });

    it('should show bulk export option to admins', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);

        const searchQuery = {
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            activeFacets: {
                filters: {},
                ranges: {
                    'Year published': {
                        from: '2008',
                        to: '2023',
                    },
                },
                showOpenAccessOnly: 'true',
            },
            bulkExportSelected: false,
        };

        const { getByTestId } = setup({
            publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
            publicationsListPagingData: {
                current_page: 1,
                from: 10,
                page_size: 20,
                to: 20,
                total: 100,
            },
            location: {
                search:
                    'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5B' +
                    'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
                    'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false',
            },
            canUseExport: true,
            searchQuery,
            isAdvancedSearch: true,
        });

        expect(getByTestId('bulk-export-open')).toBeInTheDocument();
        userIsAdmin.mockRestore();
    });

    it('should call unmount component', () => {
        const clearSearchQueryFn = jest.fn();
        const { unmount } = setup({
            actions: {
                clearSearchQuery: clearSearchQueryFn,
            },
        });
        unmount();
        expect(clearSearchQueryFn).toHaveBeenCalled();
    });

    it('should update the queryString and make API call when going back and forward on a search', () => {
        const apiMock = jest.fn();
        const historyMock = createMemoryHistory();
        const { getByTestId } = setup({ history: historyMock, actions: { searchEspacePublications: apiMock } });

        const getParams = term => ({
            searchQueryParams: {
                all: term,
            },
            ...queryParamsDefaults(),
        });

        // make a couple of searches
        const terms = ['cats', 'dogs'];
        doSimpleSearch(getByTestId, apiMock, historyMock, getParams(terms[0]));
        doSimpleSearch(getByTestId, apiMock, historyMock, getParams(terms[1]));
        // go back
        act(() => {
            historyMock.goBack();
        });
        assertQueryString(historyMock, getParams(terms[0]));
        // go forward
        act(() => {
            historyMock.goForward();
        });
        assertQueryString(historyMock, getParams(terms[1]));
    });

    it('should update the queryString and make API call when going back and forward on page', () => {
        const getParams = (page = searchQuery.page) => ({
            ...searchQuery,
            page,
            searchQueryParams: {
                all: 'test',
            },
        });
        const apiMock = jest.fn();
        // add some search history
        const initialEntries = [
            {
                pathname: pathConfig.records.search,
                search: `?${param(getParams())}`,
            },
        ];
        const historyMock = createMemoryHistory({
            initialEntries,
        });
        historyMock.push(initialEntries[0]);
        const { getByTestId } = setup({
            ...props, // this props pretends there is a bunch of search results
            history: historyMock,
            actions: { searchEspacePublications: apiMock },
        });

        // select page 2
        fireEvent.click(getByTestId('search-records-paging-top-select-page-2'));
        assertQueryString(historyMock, getParams(2));
        expect(apiMock).toHaveBeenLastCalledWith(getParams(2));

        // go back
        act(() => {
            historyMock.goBack();
        });
        assertQueryString(historyMock, getParams());
        expect(apiMock).toHaveBeenLastCalledWith(getParams());

        // go forward
        act(() => {
            historyMock.goForward();
        });
        assertQueryString(historyMock, getParams(2));
        expect(apiMock).toHaveBeenLastCalledWith(getParams(2));
    });

    it('should update the queryString and make API call when going back and forward on page size', () => {
        const getParams = (pageSize = searchQuery.pageSize) => ({
            ...searchQuery,
            pageSize,
            searchQueryParams: {
                all: 'test',
            },
        });
        const apiMock = jest.fn();
        // add some search history
        const initialEntries = [
            {
                pathname: pathConfig.records.search,
                search: `?${param(getParams())}`,
            },
        ];
        const historyMock = createMemoryHistory({
            initialEntries,
        });
        historyMock.push(initialEntries[0]);
        const { getByTestId, getAllByRole } = setup({
            ...props, // this props pretends there is a bunch of search results
            history: historyMock,
            actions: { searchEspacePublications: apiMock },
        });

        // change pageSize
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(4);
        act(() => {
            fireEvent.click(getAllByRole('option')[2]);
            const newValue = parseInt(getAllByRole('option')[2].textContent, 10);
            assertQueryString(historyMock, getParams(newValue));
            expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));

            // go back
            act(() => {
                historyMock.goBack();
            });
            assertQueryString(historyMock, getParams());
            expect(apiMock).toHaveBeenLastCalledWith(getParams());

            // go forward
            act(() => {
                historyMock.goForward();
            });
            assertQueryString(historyMock, getParams(newValue));
            expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));
        });
    });

    it('should update the queryString and make API call when going back and forward on sort direction', () => {
        const getParams = (sortDirection = searchQuery.sortDirection) => ({
            ...searchQuery,
            sortDirection,
            searchQueryParams: {
                all: 'test',
            },
        });
        const apiMock = jest.fn();
        // add some search history
        const initialEntries = [
            {
                pathname: pathConfig.records.search,
                search: `?${param(getParams())}`,
            },
        ];
        const historyMock = createMemoryHistory({
            initialEntries,
        });
        historyMock.push(initialEntries[0]);
        const { getByTestId, getAllByRole } = setup({
            ...props, // this props pretends there is a bunch of search results
            history: historyMock,
            actions: { searchEspacePublications: apiMock },
        });

        // change sort direction
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-order')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(2);
        act(() => {
            fireEvent.click(getAllByRole('option')[1]);
            const newValue = getAllByRole('option')[1].textContent;
            assertQueryString(historyMock, getParams(newValue));
            expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));

            // go back
            act(() => {
                historyMock.goBack();
            });
            assertQueryString(historyMock, getParams());
            expect(apiMock).toHaveBeenLastCalledWith(getParams());

            // go forward
            act(() => {
                historyMock.goForward();
            });
            assertQueryString(historyMock, getParams(newValue));
            expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));
        });
    });

    it('should update the queryString and make API call when going back and forward on sort', () => {
        const getParams = (sortBy = searchQuery.sortBy) => ({
            ...searchQuery,
            sortBy,
            searchQueryParams: {
                all: 'test',
            },
        });
        const apiMock = jest.fn();
        // add some search history
        const initialEntries = [
            {
                pathname: pathConfig.records.search,
                search: `?${param(getParams())}`,
            },
        ];
        const historyMock = createMemoryHistory({
            initialEntries,
        });
        historyMock.push(initialEntries[0]);
        const { getByTestId, getAllByRole } = setup({
            ...props, // this props pretends there is a bunch of search results
            history: historyMock,
            actions: { searchEspacePublications: apiMock },
        });

        // change sort
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-by')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(8);
        act(() => {
            fireEvent.click(getAllByRole('option')[2]);
            const newValue = getAllByRole('option')[2].textContent.toLowerCase();
            assertQueryString(historyMock, getParams(newValue));
            expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));

            // go back
            act(() => {
                historyMock.goBack();
            });
            assertQueryString(historyMock, getParams());
            expect(apiMock).toHaveBeenLastCalledWith(getParams());

            // go forward
            act(() => {
                historyMock.goForward();
            });
            assertQueryString(historyMock, getParams(newValue));
            expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));
        });
    });

    it('should update the queryString and make API call when going back and forward on facet filtering', () => {
        const getParams = (activeFacets = {}) => ({
            ...searchQuery,
            activeFacets: {
                ...searchQuery.activeFacets,
                ...activeFacets,
            },
            searchQueryParams: {
                all: 'test',
            },
        });
        const apiMock = jest.fn();
        // add some search history
        const initialEntries = [
            {
                pathname: pathConfig.records.search,
                search: `?${param(getParams())}`,
            },
        ];
        const historyMock = createMemoryHistory({
            initialEntries,
        });
        historyMock.push(initialEntries[0]);
        const { getByTestId, getByText } = setup({
            ...props, // this props pretends there is a bunch of search results
            history: historyMock,
            actions: { searchEspacePublications: apiMock },
        });

        // face filter it
        fireEvent.click(getByTestId('clickable-facet-category-author'));
        fireEvent.click(getByText('Martin, Sally (68)'));
        const newValue = {
            showOpenAccessOnly: false,
            filters: {
                Author: '745',
            },
        };
        assertQueryString(historyMock, getParams(newValue));
        expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));

        // go back
        act(() => {
            historyMock.goBack();
        });
        assertQueryString(historyMock, getParams());
        expect(apiMock).toHaveBeenLastCalledWith(getParams());

        // go forward
        act(() => {
            historyMock.goForward();
        });
        assertQueryString(historyMock, getParams(newValue));
        expect(apiMock).toHaveBeenLastCalledWith(getParams(newValue));
    });

    describe('Image Gallery', () => {
        it('normaliseDisplayLookup function', () => {
            COLLECTION_VIEW_TYPE.forEach(viewType => {
                expect(normaliseDisplayLookup(viewType.value)).toEqual(viewType.value); // expected string value
                expect(normaliseDisplayLookup(viewType.id)).toEqual(viewType.value); // expected id value
            });

            // default when invalid value passed
            expect(normaliseDisplayLookup('autos')).toEqual(COLLECTION_VIEW_TYPE[0].value);
            expect(normaliseDisplayLookup(12345)).toEqual(COLLECTION_VIEW_TYPE[0].value);
        });
        it('should update the queryString and make API call when going back and forward on display type', () => {
            const getParams = (displayRecordsAs = 'standard') => {
                return {
                    ...searchQuery,
                    searchQueryParams: {
                        all: 'test',
                    },
                    displayRecordsAs,
                };
            };
            const apiMock = jest.fn();
            const oldParams = getParams();
            // add some search history
            const initialEntries = [
                {
                    pathname: pathConfig.records.search,
                    search: `?${param(oldParams)}`,
                },
            ];
            const historyMock = createMemoryHistory({
                initialEntries,
            });
            historyMock.push(initialEntries[0]);
            const { getByTestId, getAllByRole } = setup({
                ...props, // this props pretends there is a bunch of search results
                history: historyMock,
                actions: { searchEspacePublications: apiMock },
            });

            // change display type
            fireEvent.mouseDown(within(getByTestId('publication-list-display-records-as')).getByRole('combobox'));
            expect(getAllByRole('option').length).toBe(3);
            act(() => {
                fireEvent.click(getAllByRole('option')[1]);
                const newValue = getAllByRole('option')[1]
                    .textContent.toLowerCase()
                    .replace(' ', '-');
                const newParams = getParams(newValue);
                assertQueryString(historyMock, newParams);
                expect(apiMock).toHaveBeenLastCalledWith(newParams);

                // go back
                act(() => {
                    historyMock.goBack();
                });
                assertQueryString(historyMock, oldParams);
                expect(apiMock).toHaveBeenLastCalledWith(oldParams);

                // go forward
                act(() => {
                    historyMock.goForward();
                });
                assertQueryString(historyMock, newParams);
                expect(apiMock).toHaveBeenLastCalledWith(newParams);
            });
        });

        it('should show the default search component when the querystring displayRecordsAs parameter is not set', () => {
            const getParams = (displayRecordsAs = '') => {
                return {
                    ...searchQuery,
                    searchQueryParams: {
                        all: 'test',
                    },
                    displayRecordsAs,
                };
            };
            const oldParams = getParams();
            // add some search history
            const initialEntries = [
                {
                    pathname: pathConfig.records.search,
                    search: `?${param(oldParams)}`,
                },
            ];
            const historyMock = createMemoryHistory({
                initialEntries,
            });
            historyMock.push(initialEntries[0]);
            const { getByTestId, queryByTestId } = setup({
                ...props, // this props pretends there is a bunch of search results
                location: {
                    ...initialEntries[0],
                },
                history: historyMock,
            });

            expect(getByTestId('search-results-publications-list')).toBeInTheDocument();
            expect(queryByTestId('image-gallery')).not.toBeInTheDocument();
        });

        it('should show the auto (standard) search component based upon the querystring displayRecordsAs parameter', () => {
            const getParams = (displayRecordsAs = 'auto') => {
                return {
                    ...searchQuery,
                    searchQueryParams: {
                        all: 'test',
                    },
                    displayRecordsAs,
                };
            };
            const oldParams = getParams();
            // add some search history
            const initialEntries = [
                {
                    pathname: pathConfig.records.search,
                    search: `?${param(oldParams)}`,
                },
            ];
            const historyMock = createMemoryHistory({
                initialEntries,
            });
            historyMock.push(initialEntries[0]);
            const { getByTestId, queryByTestId } = setup({
                ...props, // this props pretends there is a bunch of search results
                location: {
                    ...initialEntries[0],
                },
                history: historyMock,
            });

            expect(getByTestId('search-results-publications-list')).toBeInTheDocument();
            expect(queryByTestId('image-gallery')).not.toBeInTheDocument();
        });

        it('should show the standard search component based upon the querystring displayRecordsAs parameter', () => {
            const getParams = (displayRecordsAs = 'standard') => {
                return {
                    ...searchQuery,
                    searchQueryParams: {
                        all: 'test',
                    },
                    displayRecordsAs,
                };
            };
            const oldParams = getParams();
            // add some search history
            const initialEntries = [
                {
                    pathname: pathConfig.records.search,
                    search: `?${param(oldParams)}`,
                },
            ];
            const historyMock = createMemoryHistory({
                initialEntries,
            });
            historyMock.push(initialEntries[0]);
            const { getByTestId, queryByTestId } = setup({
                ...props, // this props pretends there is a bunch of search results
                location: {
                    ...initialEntries[0],
                },
                history: historyMock,
            });

            expect(getByTestId('search-results-publications-list')).toBeInTheDocument();
            expect(queryByTestId('image-gallery')).not.toBeInTheDocument();
        });

        it('should show the Image Gallery component based upon the querystring displayRecordsAs parameter', () => {
            const getParams = (displayRecordsAs = 'image-gallery') => {
                return {
                    ...searchQuery,
                    searchQueryParams: {
                        all: 'test',
                    },
                    displayRecordsAs,
                };
            };
            const oldParams = getParams();
            // add some search history
            const initialEntries = [
                {
                    pathname: pathConfig.records.search,
                    search: `?${param(oldParams)}`,
                },
            ];
            const historyMock = createMemoryHistory({
                initialEntries,
            });
            historyMock.push(initialEntries[0]);
            const { getByTestId, queryByTestId } = setup({
                ...props, // this props pretends there is a bunch of search results
                location: {
                    ...initialEntries[0],
                },
                history: historyMock,
            });

            expect(queryByTestId('search-results-publications-list')).not.toBeInTheDocument();
            expect(getByTestId('image-gallery')).toBeInTheDocument();
        });

        it("should should maintain user's display choice even if querystring contains displayRecordsAs parameter", () => {
            const getParams = ({ displayRecordsAs = 'image-gallery', ...params } = {}) => {
                return {
                    ...searchQuery,
                    searchQueryParams: {
                        all: 'test',
                    },
                    displayRecordsAs,
                    ...params,
                };
            };
            const oldParams = getParams();
            // add some search history
            const historyEntries = [
                {
                    pathname: pathConfig.records.search,
                    search: `?${param(oldParams)}`,
                },
                {
                    pathname: pathConfig.records.search,
                    search: `?${param(getParams({ searchQueryParams: { all: 'test2' } }))}`,
                },
            ];
            const historyMock = createMemoryHistory({
                historyEntries,
            });
            historyMock.push(historyEntries[0]);
            const { getByTestId, queryByTestId, getAllByRole } = setup({
                ...props, // this props pretends there is a bunch of search results
                location: {
                    ...historyEntries[0],
                },
                history: historyMock,
            });

            expect(queryByTestId('search-results-publications-list')).not.toBeInTheDocument();
            expect(getByTestId('image-gallery')).toBeInTheDocument();
            expect(within(getByTestId('publication-list-display-records-as')).getByRole('combobox')).toHaveTextContent(
                'Image Gallery',
            );
            // change display type
            fireEvent.mouseDown(within(getByTestId('publication-list-display-records-as')).getByRole('combobox'));
            expect(getAllByRole('option').length).toBe(3);
            act(() => {
                fireEvent.click(getAllByRole('option')[1]);
                const newValue = getAllByRole('option')[1]
                    .textContent.toLowerCase()
                    .replace(' ', '-');
                const newParams = getParams({ displayRecordsAs: newValue });
                assertQueryString(historyMock, newParams);
            });
            // test if user choice persists when querystring updates (simulating user changing the search in the UI)
            act(() => {
                historyMock.push(historyEntries[1]);
            });

            expect(getByTestId('publication-list-display-records-as').textContent).toEqual('Standard');
        });
    });
});
