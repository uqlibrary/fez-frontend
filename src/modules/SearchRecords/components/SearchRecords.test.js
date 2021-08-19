import React from 'react';
import SearchRecords from './SearchRecords';
// import { pathConfig } from 'config';
// import { locale } from 'locale';
import { renderWithRouter, WithReduxStore, fireEvent, act } from 'test-utils';
import mediaQuery from 'css-mediaquery';

jest.mock('actions', () => ({
    searchEspacePublications: jest.fn(() => ({ type: '' })),
}));
import * as actions from 'actions';

import * as UserIsAdminHook from 'hooks/userIsAdmin';

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
        const { getByText } = setup({ searchLoading: true });
        expect(getByText('Searching for works')).toBeInTheDocument();
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

    describe('should show available filters or selected filters if', () => {
        beforeAll(() => {
            window.matchMedia = createMatchMedia(window.innerWidth);
        });

        it('publicationsListFacets returned (even if there are no results)', () => {
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

        // it.only(
        //     'publicationsListFacets returned (even if there are no results) and ' +
        //         'should exclude facets from advanced search field',
        //     () => {
        //         const { debug, getByTestId, asFragment } = setup({
        //             publicationsListFacets: {
        //                 'Some Facet': {
        //                     buckets: [{ value: 'example 1' }],
        //                 },
        //                 'Another Facet': {
        //                     buckets: [{ value: 'example 2' }],
        //                 },
        //             },
        //             searchQuery: {
        //                 title: 'this is test',
        //             },
        //             publicationsList: [],
        //         });

        //         debug(getByTestId('clickable-facet-category-open-access').closest('nav'));

        //         // wrapper.setState({
        //         //     advancedSearchFields: ['Author'],
        //         // });
        //     },
        // );

        // it.only('activeFacets OA selected (even if there are no results)', () => {
        //     const { debug, getByTestId } = setup({
        //         searchQuery: {
        //             title: 'this is test',
        //             activeFacets: {
        //                 showOpenAccessOnly: 'true',
        //             },
        //         },
        //         publicationsList: [],
        //         publicationsListFacets: {
        //             'Some Facet': {
        //                 buckets: [{ key: 'example 1' }],
        //             },
        //         },
        //     });
        //     fireEvent.click(getByTestId('clickable-facet-category-open-access'));
        //     debug(getByTestId('clickable-facet-category-open-access').closest('nav'));
        // });

        // it.only('activeFacets filter selected (even if there are no results)', () => {
        //     const { debug } = setup({
        //         searchQuery: {
        //             title: 'this is test',
        //             activeFacets: {
        //                 filters: {
        //                     'Display type': 179,
        //                 },
        //             },
        //         },
        //         publicationsList: [],
        //     });
        //     debug();
        // });

        // it.only('activeFacets range selected (even if there are no results)', () => {
        //     const { debug } = setup({
        //         searchQuery: {
        //             title: 'this is test',
        //             activeFacets: {
        //                 ranges: {
        //                     'Year published': {
        //                         from: 2015,
        //                         to: 2018,
        //                     },
        //                 },
        //             },
        //         },
        //         publicationsList: [],
        //     });
        //     debug();
        // });
    });

    // it.only('should get publications when user clicks back and state is set', () => {
    //     const testAction = jest.fn();
    //     const { debug } = setup({
    //         actions: { searchEspacePublications: testAction },
    //         history: { action: 'POP' },
    //         location: { pathname: pathConfig.records.search, state: { page: 2 }, search: 'something' },
    //     });
    //     debug();
    //     expect(testAction).toHaveBeenCalled();
    // });

    // it('should get publications when user clicks back and state is not set', () => {
    //     const testAction = jest.fn();
    //     const { debug } = setup({ actions: { searchEspacePublications: testAction } });
    //     expect(testAction).toHaveBeenCalled();
    //     expect(wrapper.state().page).toEqual(1);
    // });

    // it.only('should set state and update history and search records when page size changed', () => {
    //     const testAction = jest.fn();
    //     const testPushFn = jest.fn();

    //     const { debug, getByText, getByTestId, getByRole } = setup({
    //         actions: {
    //             searchEspacePublications: testAction,
    //         },
    //         history: {
    //             push: testPushFn,
    //         },
    //         publicationsList: [
    //             { rek_pid: 'UQ1', rek_title: 'Title 1', rek_date: '2021-01-01T00:00:00Z' },
    //             { rek_pid: 'UQ2', rek_title: 'Title 2', rek_date: '2021-02-01T00:00:00Z' },
    //             { rek_pid: 'UQ3', rek_title: 'Title 3', rek_date: '2021-03-01T00:00:00Z' },
    //         ],
    //         publicationsListPagingData: {
    //             current_page: 1,
    //             from: 1,
    //             per_page: 10,
    //             to: 10,
    //             total: 20,
    //         },
    //     });

    //     fireEvent.click(getByTestId('pageSize'));
    //     // debug(getByText('Works per page').closest('div'));
    //     debug(getByTestId('menu-'));

    //     // wrapper.instance().pageSizeChanged(30);
    //     // wrapper.update();
    //     expect(testAction).toHaveBeenCalled();
    //     expect(testPushFn).toHaveBeenCalled();
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
            },
        });

        act(() => {
            fireEvent.mouseDown(getByTestId('pageSize'));
        });
        expect(getAllByRole('option').length).toBe(3);
        act(() => {
            fireEvent.click(getAllByRole('option')[1]);
        });

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'searchQueryParams%5Ball%5D=test&bulkExportSelected=false&pageSize=50&sortDirection=Desc&sortBy=score&page=1',
            state: {
                ...searchQuery,
                pageSize: 50,
                searchQueryParams: {
                    all: 'test',
                },
            },
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
            },
        });

        act(() => {
            fireEvent.click(getByTestId('search-records-paging-top-select-page-2'));
        });

        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'searchQueryParams%5Ball%5D=test&bulkExportSelected=false&pageSize=20&sortDirection=Desc&sortBy=score&page=2',
            state: {
                ...searchQuery,
                page: 2,
                searchQueryParams: {
                    all: 'test',
                },
            },
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
                'searchQueryParams%5Ball%5D=test&bulkExportSelected=false&pageSize=20&sortDirection=Asc&sortBy=score&page=1',
            state: {
                ...searchQuery,
                sortDirection: 'Asc',
                searchQueryParams: {
                    all: 'test',
                },
            },
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

    // it('should update history and search records when facet is changed', () => {
    //     const testAction = jest.fn();
    //     const testPushFn = jest.fn();

    //     const { debug } = setup({
    //         actions: {
    //             searchEspacePublications: testAction,
    //         },
    //         history: {
    //             push: testPushFn,
    //         },
    //     });

    //     wrapper.instance().facetsChanged({ filters: {}, ranges: { 'Publication year': { from: 2015, to: 2018 } } });
    //     wrapper.update();
    //     expect(wrapper.instance().state.activeFacets).toEqual({
    //         filters: {},
    //         ranges: { 'Publication year': { from: 2015, to: 2018 } },
    //     });
    //     expect(testAction).toHaveBeenCalled();
    //     expect(testPushFn).toHaveBeenCalled();
    // });

    // it('should set history to unpublished path if pathname matches it', () => {
    //     const { debug } = setup({
    //         history: {
    //             push: jest.fn(history => {
    //                 expect(history.pathname).toBe(pathConfig.admin.unpublished);
    //             }),
    //         },
    //         location: {
    //             pathname: pathConfig.admin.unpublished,
    //             search: '',
    //         },
    //     });
    //     wrapper.instance().updateHistoryAndSearch();
    // });

    // it('should call updateSearch() method if query search parameters with searchQueryParams key found', () => {
    //     const testAction = jest.fn();
    //     const { debug } = setup({
    //         location: {
    //             search: '?searchQueryParams=something%2Dinteresting',
    //         },
    //         actions: {
    //             searchEspacePublications: testAction,
    //         },
    //     });

    //     expect(testAction).toHaveBeenCalled();
    // });

    // it('should correctly parse search query string from location search (default filters + title', () => {
    //     const { debug } = setup();

    //     const result = wrapper
    //         .instance()
    //         .parseSearchQueryStringFromUrl(
    //             'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&searchQueryParams%5Btitle%5D=sometestdata',
    //         );

    //     expect(result).toEqual({
    //         page: '1',
    //         pageSize: 20,
    //         sortBy: 'published_date',
    //         sortDirection: 'Desc',
    //         searchQueryParams: {
    //             title: 'sometestdata',
    //         },
    //         activeFacets: {
    //             filters: {},
    //             ranges: {},
    //         },
    //         bulkExportSelected: false,
    //     });
    // });

    // it('should parse properly when activeFacets.showOpenAccessOnly is not present in url', () => {
    //     const { debug } = setup();
    //     const test = wrapper.instance().parseSearchQueryStringFromUrl('activeFacets%5Btest1%5D=test2');
    // });

    // it(
    //     'should correctly parse search query string from location search ' +
    //         '(default filters + publication type facet + title',
    //     () => {
    //         const { debug } = setup();

    //         const result = wrapper
    //             .instance()
    //             .parseSearchQueryStringFromUrl(
    //                 'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5B' +
    //                     'Display+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5B' +
    //                     'title%5D=some+test+data',
    //             );

    //         expect(result).toEqual({
    //             page: '1',
    //             pageSize: 20,
    //             sortBy: 'published_date',
    //             sortDirection: 'Desc',
    //             searchQueryParams: {
    //                 title: 'some test data',
    //             },
    //             activeFacets: {
    //                 filters: {
    //                     'Display type': '130',
    //                 },
    //                 ranges: {},
    //                 showOpenAccessOnly: false,
    //             },
    //             bulkExportSelected: false,
    //         });
    //     },
    // );

    // it(
    //     'should correctly parse search query string from location search ' +
    //         '(changed filters + publication type + open access)',
    //     () => {
    //         const { debug } = setup();

    //         const result = wrapper
    //             .instance()
    //             .parseSearchQueryStringFromUrl(
    //                 'page=2&pageSize=50&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5B' +
    //                     'Display+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=true&searchQueryParams%5B' +
    //                     'title%5D=some+test+data',
    //             );

    //         expect(result).toEqual({
    //             page: '2',
    //             pageSize: 50,
    //             sortBy: 'published_date',
    //             sortDirection: 'Desc',
    //             searchQueryParams: {
    //                 title: 'some test data',
    //             },
    //             activeFacets: {
    //                 filters: {
    //                     'Display type': '130',
    //                 },
    //                 ranges: {},
    //                 showOpenAccessOnly: true,
    //             },
    //             bulkExportSelected: false,
    //         });
    //     },
    // );

    // it('should correctly parse search query string from location search (published year)', () => {
    //     const { debug } = setup();

    //     const result = wrapper
    //         .instance()
    //         .parseSearchQueryStringFromUrl(
    //             'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&activeFacets%5B' +
    //                 'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
    //                 'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false&' +
    //                 'searchQueryParams%5Btitle%5D=some+test+data',
    //         );

    //     expect(result).toEqual({
    //         page: '1',
    //         pageSize: 20,
    //         sortBy: 'published_date',
    //         sortDirection: 'Desc',
    //         searchQueryParams: {
    //             title: 'some test data',
    //         },
    //         activeFacets: {
    //             filters: {},
    //             ranges: {
    //                 'Year published': {
    //                     from: '2008',
    //                     to: '2023',
    //                 },
    //             },
    //             showOpenAccessOnly: false,
    //         },
    //         bulkExportSelected: false,
    //     });
    // });

    // it(
    //     'should correctly parse search query string from location search and ' +
    //         'reset pageSize if not in valid values (20, 50, 100)',
    //     () => {
    //         const { debug } = setup();

    //         const result = wrapper
    //             .instance()
    //             .parseSearchQueryStringFromUrl(
    //                 'page=1&pageSize=2000&sortBy=published_date&sortDirection=Desc&activeFacets%5Branges%5D%5B' +
    //                     'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
    //                     '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
    //             );

    //         expect(result).toEqual({
    //             page: '1',
    //             pageSize: 20,
    //             sortBy: 'published_date',
    //             sortDirection: 'Desc',
    //             searchQueryParams: {
    //                 title: 'some test data',
    //             },
    //             activeFacets: {
    //                 filters: {},
    //                 ranges: {
    //                     'Year published': {
    //                         from: '2008',
    //                         to: '2023',
    //                     },
    //                 },
    //                 showOpenAccessOnly: false,
    //             },
    //             bulkExportSelected: false,
    //         });
    //     },
    // );

    // it(
    //     'should correctly parse search query string from location search and ' +
    //         'reset sortDirection if not in valid values (Desc, Asc)',
    //     () => {
    //         const { debug } = setup({});

    //         const result = wrapper
    //             .instance()
    //             .parseSearchQueryStringFromUrl(
    //                 'page=1&pageSize=20&sortBy=published_date&sortDirection=esc&activeFacets%5Branges%5D%5B' +
    //                     'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
    //                     '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
    //             );

    //         expect(result).toEqual({
    //             page: '1',
    //             pageSize: 20,
    //             sortBy: 'published_date',
    //             sortDirection: 'Desc',
    //             searchQueryParams: {
    //                 title: 'some test data',
    //             },
    //             activeFacets: {
    //                 filters: {},
    //                 ranges: {
    //                     'Year published': {
    //                         from: '2008',
    //                         to: '2023',
    //                     },
    //                 },
    //                 showOpenAccessOnly: false,
    //             },
    //             bulkExportSelected: false,
    //         });
    //     },
    // );

    // it('should correctly parse search query string from location search & reset sortBy if not in valid values', () => {
    //     const { debug } = setup({});

    //     const result = wrapper
    //         .instance()
    //         .parseSearchQueryStringFromUrl(
    //             'page=1&pageSize=100&sortBy=published_date&sortDirection=Asc&activeFacets%5Branges%5D%5B' +
    //                 'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
    //                 '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
    //         );

    //     expect(result).toEqual({
    //         page: '1',
    //         pageSize: 100,
    //         sortBy: 'published_date',
    //         sortDirection: 'Asc',
    //         searchQueryParams: {
    //             title: 'some test data',
    //         },
    //         activeFacets: {
    //             filters: {},
    //             ranges: {
    //                 'Year published': {
    //                     from: '2008',
    //                     to: '2023',
    //                 },
    //             },
    //             showOpenAccessOnly: false,
    //         },
    //         bulkExportSelected: false,
    //     });
    // });

    it('renders loading screen while export publications loading', () => {
        const { getByText } = setup({ exportPublicationsLoading: true });
        expect(getByText('Searching for works')).toBeInTheDocument();
    });

    it('renders error alert if error occurs during search', () => {
        const { getByTestId, getByText } = setup({ searchLoadingError: true });
        expect(getByTestId('alert-error')).toBeInTheDocument();
        expect(getByText('Error -')).toBeInTheDocument();
    });

    it('should handle export publications correctly', () => {
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
        expect(getAllByRole('option').length).toBe(3);
        act(() => {
            fireEvent.click(getAllByRole('option')[1]);
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
            exportPublicationsFormat: 'excel',
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
                showOpenAccessOnly: false,
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
        });

        expect(getByTestId('bulk-export-open')).toBeInTheDocument();
    });

    // it('should handle set excluded facets correctly from searchfields sent from searchComponent', () => {
    //     const { debug } = setup();
    //     const test = [
    //         { searchField: 'rek_title', value: 'Test', label: '' },
    //         { searchField: 'rek_author', value: 'Ky Lane', label: '' },
    //     ];
    //     const result = ['Scopus document type', 'Genre', 'Year published', 'Published year range', 'Title', 'Author'];
    //     wrapper.instance().handleFacetExcludesFromSearchFields(test);
    //     expect(wrapper.instance().state.advancedSearchFields).toEqual(result);

    //     // handle null input
    //     wrapper.setState({
    //         advancedSearchFields: [],
    //     });
    //     wrapper.instance().handleFacetExcludesFromSearchFields(null);
    //     expect(wrapper.instance().state.advancedSearchFields.length).toBe(0);

    //     // handle searchField entry not having the searchField property
    //     wrapper.instance().handleFacetExcludesFromSearchFields({
    //         test: {},
    //     });
    //     expect(wrapper.instance().state.advancedSearchFields.length).toBe(
    //         locale.pages.searchRecords.facetsFilter.excludeFacetsList.length,
    //     );

    //     // handle fieldType.map being falsy
    //     wrapper.instance().handleFacetExcludesFromSearchFields({
    //         test: {
    //             searchField: '0',
    //         },
    //     });
    //     expect(wrapper.instance().state.advancedSearchFields.length).toBe(
    //         locale.pages.searchRecords.facetsFilter.excludeFacetsList.length,
    //     );
    // });

    // it('should handle empty search query string and should not fail to WSoD', () => {
    //     const { debug } = setup();
    //     const expected = {
    //         activeFacets: {
    //             filters: {},
    //             ranges: {},
    //         },
    //         pageSize: 20,
    //         sortBy: 'score',
    //         sortDirection: 'Desc',
    //         bulkExportSelected: false,
    //     };
    //     const result = wrapper.instance().parseSearchQueryStringFromUrl('');
    //     expect(result).toEqual(expected);
    // });

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
