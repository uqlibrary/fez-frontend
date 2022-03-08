import React from 'react';
import { default as SearchRecords } from './SearchRecords';
import { pathConfig } from 'config';
import { act, fireEvent, renderWithRouter, WithReduxStore } from 'test-utils';
import mediaQuery from 'css-mediaquery';
import * as actions from 'actions';
import * as UserIsAdminHook from 'hooks/userIsAdmin';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

jest.mock('actions', () => ({
    searchEspacePublications: jest.fn(() => ({ type: '' })),
}));

/**
 * Unhide items hidden by MaterialUI based on screen size
 */
const createMatchMedia = width => {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {},
        removeListener: () => {},
    });
};

const setup = (testProps = {}) => {
    const props = {
        publicationsList: [],
        searchLoading: false,
        exportPublicationsLoading: false,
        isAdvancedSearch: false,
        isUnpublishedBufferPage: false,
        location: {
            search: '?searchQueryParams%5Ball%5D=test',
        },
        history: {
            push: jest.fn(),
            listen: jest.fn(),
        },
        ...testProps,
        actions: {
            clearSearchQuery: jest.fn(),
            exportEspacePublications: jest.fn(),
            resetExportPublicationsStatus: jest.fn(),
            searchEspacePublications: jest.fn(),
            ...testProps.actions,
        },
    };
    return renderWithRouter(
        <WithReduxStore>
            <SearchRecords {...props} />
        </WithReduxStore>,
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
        expect(getByTestId('advancedSearchForm')).toBeInTheDocument();
        expect(getByText('Advanced search')).toBeInTheDocument();
        expect(getByTestId('minimize-advanced-search')).toBeInTheDocument();
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

    /** TODO: fix this test when fixing back/forward button clicks */
    /* it('should get publications when user clicks back and state is set', () => {
        const history = { action: 'POP' };
        const location = { pathname: pathConfig.records.search, state: { page: 2 }, search: 'something' };

        const mockUseEffect = jest.spyOn(React, 'useEffect');
        let called = false;
        mockUseEffect.mockImplementation((f, dependencies) => {
            if (
                !called &&
                JSON.stringify(dependencies[0]) === JSON.stringify(location) &&
                dependencies[1] === history.action
            ) {
                called = true;
                f();
            }
        });

        const testAction = jest.fn();
        setup({
            actions: { searchEspacePublications: testAction },
            history,
            location,
        });
        expect(testAction).toHaveBeenCalled();
        mockUseEffect.mockRestore();
    }); */

    // it('should get publications when user clicks back and state is not set', () => {
    //     const testAction = jest.fn();
    //     const { debug } = setup({ actions: { searchEspacePublications: testAction } });
    //     expect(testAction).toHaveBeenCalled();
    //     expect(wrapper.state().page).toEqual(1);
    // });

    const searchQuery = {
        page: 1,
        pageSize: 20,
        sortBy: 'score',
        sortDirection: 'Desc',
        activeFacets: {
            filters: {},
            ranges: {},
        },
        bulkExportSelected: false,
    };

    const props = {
        publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
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

    it('should update history and search records when page size is changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const { getByTestId, getAllByRole } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
                listen: jest.fn(),
            },
        });

        act(() => {
            fireEvent.mouseDown(getByTestId('pageSize'));
        });
        expect(getAllByRole('option').length).toBe(4);
        act(() => {
            fireEvent.click(getAllByRole('option')[2]);
        });

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'bulkExportSelected=false&page=1&pageSize=50&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should update history and search records when page is changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const { getByTestId } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
                listen: jest.fn(),
            },
        });

        act(() => {
            fireEvent.click(getByTestId('search-records-paging-top-select-page-2'));
        });

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'bulkExportSelected=false&page=2&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should update history and search records when sort direction is changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const { getByTestId, getAllByRole } = setup({
            ...props,
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
                listen: jest.fn(),
            },
        });

        act(() => {
            fireEvent.mouseDown(getByTestId('sortOrder'));
        });
        expect(getAllByRole('option').length).toBe(2);
        act(() => {
            fireEvent.click(getAllByRole('option')[1]);
        });

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'bulkExportSelected=false&page=1&pageSize=20&sortBy=score&sortDirection=Asc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should search records when advanced search options are updated', () => {
        const { getByTestId } = setup(props);

        act(() => {
            fireEvent.click(getByTestId('show-advanced-search'));
        });

        fireEvent.change(getByTestId('from'), { target: { value: '2015' } });
        fireEvent.change(getByTestId('to'), { target: { value: '2018' } });

        act(() => {
            fireEvent.click(getByTestId('advanced-search'));
        });

        expect(actions.searchEspacePublications).toHaveBeenCalledWith({
            ...searchQuery,
            bulkExportSelected: undefined,
            searchMode: 'advanced',
            searchQueryParams: {
                rek_display_type: [],
            },
            activeFacets: {
                filters: {},
                ranges: { 'Year published': { from: 2015, to: 2018 } },
            },
        });
    });

    it('should handle set excluded facets correctly from searchfields sent from searchComponent', () => {
        const { getByTestId, getAllByRole } = setup(props);

        // Do one advanced search
        act(() => {
            fireEvent.click(getByTestId('show-advanced-search'));
        });
        act(() => {
            fireEvent.click(getByTestId('advanced-search'));
        });

        expect(getByTestId('facets-filter')).toHaveTextContent('Author');

        // Do another advanced search
        act(() => {
            fireEvent.mouseDown(getByTestId('field-type-select'));
        });
        expect(getAllByRole('option').length).toBe(18);
        expect(getAllByRole('option')[5]).toHaveTextContent('Author Name');
        act(() => {
            fireEvent.click(getAllByRole('option')[5]);
        });
        fireEvent.change(getByTestId('rek-author-input'), { target: { value: 'test' } });
        act(() => {
            fireEvent.click(getByTestId('advanced-search'));
        });

        expect(getByTestId('facets-filter')).not.toHaveTextContent('Author');
    });

    it('should update history and search records when facet is changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const { getByTestId, getByText } = setup({
            ...props,
            isAdvancedSearch: true,
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
                listen: jest.fn(),
            },
        });

        act(() => {
            fireEvent.click(getByTestId('clickable-facet-category-author'));
        });
        act(() => {
            fireEvent.click(getByText('Martin, Sally (68)'));
        });

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'activeFacets%5Bfilters%5D%5BAuthor%5D=745&activeFacets%5BshowOpenAccessOnly%5D=false&bulkExportSelected=false&page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should set history to unpublished path if pathname matches it', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);

        const testFn = jest.fn();

        const { getByTestId, getAllByRole } = setup({
            history: {
                push: testFn,
                listen: jest.fn(),
            },
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

        act(() => {
            fireEvent.mouseDown(getByTestId('pageSize'));
        });
        expect(getAllByRole('option').length).toBe(4);
        act(() => {
            fireEvent.click(getAllByRole('option')[2]);
        });

        expect(testFn).toHaveBeenCalledWith({
            pathname: pathConfig.admin.unpublished,
            search: 'bulkExportSelected=false&page=1&pageSize=50&sortBy=score&sortDirection=Desc',
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
            bulkExportSelected: false,
        };

        const { getByTestId, getAllByRole } = setup({
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
                search:
                    'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5B' +
                    'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
                    'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false',
            },
            canUseExport: true,
            searchQuery,
        });

        act(() => {
            fireEvent.mouseDown(getByTestId('pageSize'));
        });
        expect(getAllByRole('option').length).toBe(4);
        act(() => {
            fireEvent.click(getAllByRole('option')[2]);
        });

        act(() => {
            fireEvent.mouseDown(getByTestId('exportPublicationsFormat'));
        });
        expect(getAllByRole('option').length).toBe(3);
        act(() => {
            fireEvent.click(getAllByRole('option')[1]);
        });

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
});
