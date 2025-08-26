import React from 'react';
import { default as SearchRecords, normaliseDisplayLookup } from './SearchRecords';
import { pathConfig } from 'config';
import { fireEvent, WithRouter, WithReduxStore, createMatchMedia, within } from 'test-utils';
import * as UserIsAdminHook from 'hooks/userIsAdmin';
import { EXPORT_FORMAT_TO_EXTENSION, COLLECTION_VIEW_TYPE } from 'config/general';
import { render } from '@testing-library/react';
import param from 'can-param';
import * as actions from 'actions';

jest.mock('actions', () => ({
    ...jest.requireActual('actions'),
    clearSearchQuery: jest.fn(() => jest.fn()),
    exportEspacePublications: jest.fn(() => jest.fn()),
    resetExportPublicationsStatus: jest.fn(() => jest.fn()),
    searchEspacePublications: jest.fn(() => jest.fn()),
}));

const mockUseNavigate = jest.fn();
let mockUseLocation = {};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useLocation: () => mockUseLocation,
}));

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
    searchQuery,
};

/**
 * @type Object
 */
const defaultState = {
    searchRecordsReducer: {
        searchLoading: false,
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
    },
    exportPublicationsReducer: {
        exportPublicationsLoading: false,
    },
};

/**
 * @param props
 * @param renderMethod
 * @return {*}
 */
const setup = (props = {}, state = {}, renderMethod = render) => {
    const testProps = {
        isAdvancedSearch: false,
        isUnpublishedBufferPage: false,
        ...props,
    };

    return renderMethod(
        <WithReduxStore initialState={state}>
            <WithRouter>
                <SearchRecords {...testProps} />
            </WithRouter>
        </WithReduxStore>,
    );
};

describe('SearchRecords page', () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    beforeEach(() => {
        mockUseLocation = { pathname: '/', search: '?searchQueryParams%5Ball%5D=test' };
    });

    afterEach(() => {
        mockUseNavigate.mockClear();
        jest.clearAllMocks();
    });

    it('should render placeholders', () => {
        const { getByText, getByTestId } = setup();
        expect(getByTestId('simple-search-input')).toBeInTheDocument();
        expect(getByTestId('simple-search-button')).toBeInTheDocument();
        expect(getByText('Search')).toBeInTheDocument();
        expect(getByTestId('show-advanced-search')).toBeInTheDocument();
    });

    it('should render advanced search component', () => {
        mockUseLocation = { pathname: '/', search: '' };
        const { getByTestId, getByText } = setup({ isAdvancedSearch: true });

        expect(getByTestId('advanced-search-form')).toBeInTheDocument();

        expect(getByText('Advanced search')).toBeInTheDocument();
        expect(getByTestId('minimize-advanced-search')).toBeInTheDocument();
        expect(getByText('Select a field')).toBeInTheDocument();
        expect(getByText('Please select a field to search')).toBeInTheDocument();
    });

    it('should render loading screen while loading search results', () => {
        const { getAllByText } = setup(null, {
            searchRecordsReducer: {
                searchLoading: true,
            },
        });
        expect(getAllByText('Searching for works').length).toBe(3);
    });

    it('should render loading screen while loading publications while filtering', () => {
        const { getAllByText } = setup(null, {
            searchRecordsReducer: {
                publicationsList: [1, 2, 2],
                searchLoading: true,
            },
        });
        expect(getAllByText('Searching for works').length).toBe(3);
    });

    it('should render loading screen while export publications loading', () => {
        const { getByText } = setup(null, {
            searchRecordsReducer: { publicationsList: [1, 2, 2] },
            exportPublicationsReducer: { exportPublicationsLoading: true },
        });
        expect(getByText('Searching for works')).toBeInTheDocument();
        expect(getByText('Exporting search results')).toBeInTheDocument();
    });

    it('should render no results', () => {
        const { getByText } = setup({
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
                pathname: '/',
                search: 'test',
            },
        });
        expect(getByText('Search')).toBeInTheDocument();
    });

    it('should render when paging', () => {
        const { getByText } = setup(null, {
            searchRecordsReducer: {
                publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
                publicationsListPagingData: {
                    from: 10,
                    to: 20,
                    total: 100,
                },
            },
        });
        expect(getByText('Displaying works 10 to 20 of 100 total works.')).toBeInTheDocument();
    });

    it('should show facets even if there are no results', () => {
        const { getByText } = setup(
            {
                searchQuery: {
                    title: 'this is test',
                },
            },
            {
                searchRecordsReducer: {
                    publicationsListFacets: {
                        'Some Facet': {
                            buckets: [{ key: 'example 1' }],
                        },
                        'Another Facet': {
                            buckets: [{ key: 'example 2' }],
                        },
                    },
                    publicationsList: [],
                },
            },
        );
        expect(getByText('Some Facet')).toBeInTheDocument();
        expect(getByText('Another Facet')).toBeInTheDocument();
    });

    it('should update the queryString and make API call when page size is changed', () => {
        const { getAllByRole, getByTestId } = setup(
            {
                ...props,
            },
            { ...defaultState },
        );

        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(4);
        fireEvent.click(getAllByRole('option')[2]);

        expect(actions.searchEspacePublications).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=1&pageSize=50&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should update the queryString and make API call when page is changed', () => {
        const { getByTestId } = setup(
            {
                ...props,
            },
            { ...defaultState },
        );

        fireEvent.click(getByTestId('search-records-paging-top-select-page-2'));

        expect(actions.searchEspacePublications).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=2&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should update the queryString and make API call when sort direction is changed', () => {
        const { getAllByRole, getByTestId } = setup(
            {
                ...props,
            },
            { ...defaultState },
        );

        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-sort-order')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(2); // Desc and Asc
        fireEvent.click(getAllByRole('option')[1]);

        expect(actions.searchEspacePublications).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=1&pageSize=20&sortBy=score&sortDirection=Asc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should update the queryString and make API call when facet is changed', () => {
        const { getByTestId, getByText } = setup(
            {
                ...props,
                isAdvancedSearch: true,
            },
            { ...defaultState },
        );

        fireEvent.click(getByTestId('clickable-facet-category-author'));
        fireEvent.click(getByText('Martin, Sally (68)'));

        expect(mockUseNavigate).toHaveBeenCalled();
        expect(mockUseNavigate).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'activeFacets%5Bfilters%5D%5BAuthor%5D=745&activeFacets%5BshowOpenAccessOnly%5D=false&page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=test',
        });
    });

    it('should not call the search API when clicking a works title', () => {
        const { getByRole } = setup(
            {
                ...props,
            },
            { ...defaultState },
        );

        expect(getByRole('link', { name: 'Title 01' })).toHaveAttribute('href', '/view/1');

        // this is the initial call when the component loads,
        // without bug fix in #182603156 the "toHaveBeenCalledTimes" value here would be 2
        expect(actions.searchEspacePublications).toHaveBeenCalledTimes(1);
    });

    it('should set history to unpublished path if pathname matches it', () => {
        const userIsAdmin = jest.spyOn(UserIsAdminHook, 'userIsAdmin');
        userIsAdmin.mockImplementation(() => true);

        mockUseLocation = { pathname: pathConfig.admin.unpublished, search: '' };
        const { getAllByRole, getByTestId } = setup(null, {
            searchRecordsReducer: {
                publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
                publicationsListPagingData: {
                    current_page: 1,
                    from: 10,
                    page_size: 20,
                    to: 20,
                    total: 100,
                },
            },
        });

        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(4);
        fireEvent.click(getAllByRole('option')[2]);

        expect(mockUseNavigate).toHaveBeenCalledWith({
            pathname: pathConfig.admin.unpublished,
            search: 'page=1&pageSize=50&sortBy=score&sortDirection=Desc',
        });
        userIsAdmin.mockRestore();
    });

    it('should call updateSearch() method if query search parameters with searchQueryParams key found', () => {
        setup({
            location: {
                pathname: '/',
                search: '?searchQueryParams=something%2Dinteresting',
            },
        });
        expect(actions.searchEspacePublications).toHaveBeenCalled();
    });

    it('renders loading screen while export publications loading', () => {
        const { getByText } = setup(null, {
            exportPublicationsReducer: {
                exportPublicationsLoading: true,
            },
        });

        expect(getByText('Searching for works')).toBeInTheDocument();
    });

    it('renders error alert if error occurs during search', () => {
        const { getByTestId, getByText } = setup(null, { searchRecordsReducer: { searchLoadingError: true } });
        expect(getByTestId('alert-error')).toBeInTheDocument();
        expect(getByText('Error -')).toBeInTheDocument();
    });

    it('should handle export publications correctly', () => {
        const format = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];

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
            '?page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5B' +
            'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
            'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false';

        mockUseLocation = { pathname: '/', search: queryString };
        const testProps = {
            canUseExport: true,
            searchQuery,
        };
        const testState = {
            searchRecordsReducer: {
                publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
                publicationsListPagingData: {
                    from: 10,
                    current_page: 1,
                    page_size: 20,
                    to: 20,
                    total: 100,
                },
            },
        };
        const { getAllByRole, getByTestId, rerender } = setup(testProps, testState);
        fireEvent.mouseDown(within(getByTestId('publication-list-sorting-page-size')).getByRole('combobox'));

        expect(getAllByRole('option').length).toBe(4);
        const pageSizeOptionElement = getAllByRole('option')[2];
        fireEvent.click(pageSizeOptionElement);

        mockUseLocation = {
            pathname: '/',
            search: queryString.replace('pageSize=20', `pageSize=${pageSizeOptionElement.textContent}`),
        };

        setup({ ...testProps }, { ...testState }, rerender);

        fireEvent.mouseDown(within(getByTestId('export-publications-format')).getByRole('combobox'));
        expect(getAllByRole('option').length).toBe(3);
        fireEvent.click(getAllByRole('option')[1]);

        expect(actions.exportEspacePublications).toHaveBeenCalledWith({
            ...searchQuery,
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

        const { getByTestId } = setup(
            {
                location: {
                    pathname: '/',
                    search:
                        'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5B' +
                        'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
                        'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false',
                },
                canUseExport: true,
                searchQuery,
                isAdvancedSearch: true,
            },
            {
                searchRecordsReducer: {
                    publicationsList: [{ rek_title: 'Title 01' }, { rek_title: 'Title 02' }],
                    publicationsListPagingData: {
                        current_page: 1,
                        from: 10,
                        page_size: 20,
                        to: 20,
                        total: 100,
                    },
                },
            },
        );

        expect(getByTestId('bulk-export-open')).toBeInTheDocument();
        userIsAdmin.mockRestore();
    });

    it('should call unmount component', () => {
        const { unmount } = setup();
        unmount();
        expect(actions.clearSearchQuery).toHaveBeenCalled();
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
            mockUseLocation = { pathname: '/', search: `?${param(oldParams)}` };
            const { getByTestId, queryByTestId } = setup(null, {
                ...defaultState, // this props pretends there is a bunch of search results
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
            mockUseLocation = { pathname: '/', search: `?${param(oldParams)}` };

            const { getByTestId, queryByTestId } = setup(null, {
                ...defaultState, // this props pretends there is a bunch of search results
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
            mockUseLocation = { pathname: '/', search: `?${param(oldParams)}` };
            const { getByTestId, queryByTestId } = setup(null, {
                ...defaultState, // this props pretends there is a bunch of search results
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

            mockUseLocation = { pathname: '/', search: `?${param(oldParams)}` };
            const { getByTestId, queryByTestId } = setup(null, {
                ...defaultState, // this props pretends there is a bunch of search results
            });

            expect(queryByTestId('search-results-publications-list')).not.toBeInTheDocument();
            expect(getByTestId('image-gallery')).toBeInTheDocument();
        });
    });
});
