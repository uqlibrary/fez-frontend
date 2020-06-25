import SearchRecords from './SearchRecords';
import { routes } from 'config';
import { locale } from 'locale';

function setup(testProps = {}) {
    const props = {
        publicationsList: [],
        searchLoading: false,
        exportPublicationsLoading: false,
        isAdvancedSearch: false,
        isUnpublishedBufferPage: false,
        actions: {
            exportEspacePublications: jest.fn(),
            searchEspacePublications: jest.fn(),
        },
        location: {
            search: '?searchQueryParams%5Ball%5D=test',
        },
        history: {},
        ...testProps,
    };
    return getElement(SearchRecords, props);
}

describe('SearchRecords page', () => {
    it('should render placeholders', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render advanced search component', () => {
        const wrapper = setup({ isAdvancedSearch: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while loading search results', () => {
        const wrapper = setup({ searchLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while loading publications while filtering', () => {
        const wrapper = setup({ publicationsList: [1, 2, 2] });
        wrapper.setProps({ searchLoading: true });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while export publications loading', () => {
        const wrapper = setup({ publicationsList: [1, 2, 2], exportPublicationsLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render no results', () => {
        const wrapper = setup({
            publicationsList: [],
            searchQuery: {
                title: 'this is test',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should run constructor without valid search location', () => {
        const wrapper = setup({
            location: {
                search: 'test',
            },
        });
        expect(wrapper.state()).toMatchSnapshot();
    });

    it('should render when paging', () => {
        const wrapper = setup({
            publicationsList: [1, 2],
            publicationsListPagingData: {
                from: 10,
                to: 20,
                total: 100,
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not try to parse empty search location in UNSAFE_componentWillReceiveProps lifecycle method', () => {
        const wrapper = setup();
        const testFn = jest.fn();
        wrapper.instance().parseSearchQueryStringFromUrl = testFn;
        wrapper.setProps({
            location: {
                search: '',
            },
        });
        expect(testFn).not.toBeCalled();
    });

    describe('should show available filters or selected filters if', () => {
        it('publicationsListFacets returned (even if there are no results)', () => {
            const wrapper = setup({
                publicationsListFacets: {
                    'Some facet': 1,
                    'Another facet': 2,
                },
                searchQuery: {
                    title: 'this is test',
                },
                publicationsList: [],
            });

            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it(
            'publicationsListFacets returned (even if there are no results) and ' +
                'should exclude facets from advanced search field',
            () => {
                const wrapper = setup({
                    publicationsListFacets: {
                        'Some facet': 1,
                        'Another facet': 2,
                    },
                    searchQuery: {
                        title: 'this is test',
                    },
                    publicationsList: [],
                });

                wrapper.setState({
                    advancedSearchFields: ['Author'],
                });

                expect(toJson(wrapper)).toMatchSnapshot();
            },
        );

        it('activeFacets OA selected (even if there are no results)', () => {
            const wrapper = setup({
                searchQuery: {
                    title: 'this is test',
                    activeFacets: {
                        showOpenAccessOnly: true,
                    },
                },
                publicationsList: [],
            });

            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('activeFacets filter selected (even if there are no results)', () => {
            const wrapper = setup({
                searchQuery: {
                    title: 'this is test',
                    activeFacets: {
                        filters: {
                            'Display type': 179,
                        },
                    },
                },
                publicationsList: [],
            });

            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('activeFacets range selected (even if there are no results)', () => {
            const wrapper = setup({
                searchQuery: {
                    title: 'this is test',
                    activeFacets: {
                        ranges: {
                            'Year published': {
                                from: 2015,
                                to: 2018,
                            },
                        },
                    },
                },
                publicationsList: [],
            });

            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    it('should get publications when user clicks back and state is set', () => {
        const testAction = jest.fn();
        const wrapper = setup({ actions: { searchEspacePublications: testAction } });

        wrapper.instance().UNSAFE_componentWillReceiveProps({
            history: { action: 'POP' },
            location: { pathname: routes.pathConfig.records.search, state: { page: 2 } },
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().page).toEqual(2);
    });

    it('should get publications when user clicks back and state is not set', () => {
        const testAction = jest.fn();
        const wrapper = setup({ actions: { searchEspacePublications: testAction } });
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            history: { action: 'POP' },
            location: { pathname: routes.pathConfig.records.search, state: null },
        });
        expect(testAction).toHaveBeenCalled();
        expect(wrapper.state().page).toEqual(1);
    });

    it('should set state and update history and search records when page size changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const wrapper = setup({
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
            },
        });

        wrapper.instance().pageSizeChanged(30);
        wrapper.update();
        expect(wrapper.instance().state.pageSize).toEqual(30);
        expect(wrapper.instance().state.page).toEqual(1);
        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalled();
    });

    it('should set state and update history and search records when page is changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const wrapper = setup({
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
            },
        });

        wrapper.instance().pageChanged(2);
        wrapper.update();
        expect(wrapper.instance().state.page).toEqual(2);
        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalled();
    });

    it('should set state and update history and search records when sort by dropdown is changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const wrapper = setup({
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
            },
        });

        wrapper.instance().sortByChanged('publication_date', 'Asc');
        wrapper.update();
        expect(wrapper.instance().state.sortBy).toEqual('publication_date');
        expect(wrapper.instance().state.sortDirection).toEqual('Asc');
        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalled();
    });

    it('should set state and update history and search records when facet is changed', () => {
        const testAction = jest.fn();
        const testPushFn = jest.fn();

        const wrapper = setup({
            actions: {
                searchEspacePublications: testAction,
            },
            history: {
                push: testPushFn,
            },
        });

        wrapper.instance().facetsChanged({ filters: {}, ranges: { 'Publication year': { from: 2015, to: 2018 } } });
        wrapper.update();
        expect(wrapper.instance().state.activeFacets).toEqual({
            filters: {},
            ranges: { 'Publication year': { from: 2015, to: 2018 } },
        });
        expect(testAction).toHaveBeenCalled();
        expect(testPushFn).toHaveBeenCalled();
    });

    it('should set history to unpublished path if pathname matches it', () => {
        const wrapper = setup({
            history: {
                push: jest.fn(history => {
                    expect(history.pathname).toBe(routes.pathConfig.admin.unpublished);
                }),
            },
            location: {
                pathname: routes.pathConfig.admin.unpublished,
                search: '',
            },
        });
        wrapper.instance().updateHistoryAndSearch();
    });

    it('should call updateSearch() method if query search parameters with searchQueryParams key found', () => {
        const testAction = jest.fn();
        const wrapper = setup({
            location: {
                search: '?searchQueryParams=something%2Dinteresting',
            },
            actions: {
                searchEspacePublications: testAction,
            },
        });

        wrapper.instance().componentDidMount();
        expect(testAction).toHaveBeenCalled();
    });

    it('should correctly parse search query string from location search (default filters + title', () => {
        const wrapper = setup();

        const result = wrapper
            .instance()
            .parseSearchQueryStringFromUrl(
                'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&searchQueryParams%5Btitle%5D=sometestdata',
            );

        expect(result).toEqual({
            page: '1',
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'Desc',
            searchQueryParams: {
                title: 'sometestdata',
            },
            activeFacets: {
                filters: {},
                ranges: {},
            },
        });
    });

    it('should parse properly when activeFacets.showOpenAccessOnly is not present in url', () => {
        const wrapper = setup();
        const test = wrapper.instance().parseSearchQueryStringFromUrl('activeFacets%5Btest1%5D=test2');
        expect(test).toMatchSnapshot();
    });

    it(
        'should correctly parse search query string from location search ' +
            '(default filters + publication type facet + title',
        () => {
            const wrapper = setup();

            const result = wrapper
                .instance()
                .parseSearchQueryStringFromUrl(
                    'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5B' +
                        'Display+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5B' +
                        'title%5D=some+test+data',
                );

            expect(result).toEqual({
                page: '1',
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'Desc',
                searchQueryParams: {
                    title: 'some test data',
                },
                activeFacets: {
                    filters: {
                        'Display type': '130',
                    },
                    ranges: {},
                    showOpenAccessOnly: false,
                },
            });
        },
    );

    it(
        'should correctly parse search query string from location search ' +
            '(changed filters + publication type + open access)',
        () => {
            const wrapper = setup();

            const result = wrapper
                .instance()
                .parseSearchQueryStringFromUrl(
                    'page=2&pageSize=50&sortBy=published_date&sortDirection=Desc&activeFacets%5Bfilters%5D%5B' +
                        'Display+type%5D=130&activeFacets%5BshowOpenAccessOnly%5D=true&searchQueryParams%5B' +
                        'title%5D=some+test+data',
                );

            expect(result).toEqual({
                page: '2',
                pageSize: 50,
                sortBy: 'published_date',
                sortDirection: 'Desc',
                searchQueryParams: {
                    title: 'some test data',
                },
                activeFacets: {
                    filters: {
                        'Display type': '130',
                    },
                    ranges: {},
                    showOpenAccessOnly: true,
                },
            });
        },
    );

    it('should correctly parse search query string from location search (published year)', () => {
        const wrapper = setup();

        const result = wrapper
            .instance()
            .parseSearchQueryStringFromUrl(
                'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&activeFacets%5B' +
                    'ranges%5D%5BYear+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5B' +
                    'Year+published%5D%5Bto%5D=2023&activeFacets%5BshowOpenAccessOnly%5D=false&' +
                    'searchQueryParams%5Btitle%5D=some+test+data',
            );

        expect(result).toEqual({
            page: '1',
            pageSize: 20,
            sortBy: 'published_date',
            sortDirection: 'Desc',
            searchQueryParams: {
                title: 'some test data',
            },
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
        });
    });

    it(
        'should correctly parse search query string from location search and ' +
            'reset pageSize if not in valid values (20, 50, 100)',
        () => {
            const wrapper = setup();

            const result = wrapper
                .instance()
                .parseSearchQueryStringFromUrl(
                    'page=1&pageSize=2000&sortBy=published_date&sortDirection=Desc&activeFacets%5Branges%5D%5B' +
                        'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
                        '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
                );

            expect(result).toEqual({
                page: '1',
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'Desc',
                searchQueryParams: {
                    title: 'some test data',
                },
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
            });
        },
    );

    it(
        'should correctly parse search query string from location search and ' +
            'reset sortDirection if not in valid values (Desc, Asc)',
        () => {
            const wrapper = setup({});

            const result = wrapper
                .instance()
                .parseSearchQueryStringFromUrl(
                    'page=1&pageSize=20&sortBy=published_date&sortDirection=esc&activeFacets%5Branges%5D%5B' +
                        'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
                        '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
                );

            expect(result).toEqual({
                page: '1',
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'Desc',
                searchQueryParams: {
                    title: 'some test data',
                },
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
            });
        },
    );

    it('should correctly parse search query string from location search & reset sortBy if not in valid values', () => {
        const wrapper = setup({});

        const result = wrapper
            .instance()
            .parseSearchQueryStringFromUrl(
                'page=1&pageSize=100&sortBy=published_date&sortDirection=Asc&activeFacets%5Branges%5D%5B' +
                    'Year+published%5D%5Bfrom%5D=2008&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D' +
                    '=2023&activeFacets%5BshowOpenAccessOnly%5D=false&searchQueryParams%5Btitle%5D=some+test+data',
            );

        expect(result).toEqual({
            page: '1',
            pageSize: 100,
            sortBy: 'published_date',
            sortDirection: 'Asc',
            searchQueryParams: {
                title: 'some test data',
            },
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
        });
    });

    it('renders loading screen while export publications loading', () => {
        const wrapper = setup({ exportPublicationsLoading: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders error alert if error occurs during search', () => {
        const wrapper = setup({ searchLoadingError: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle export publications correctly', () => {
        const testExportAction = jest.fn();
        const searchQuery = {
            page: '1',
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            searchQueryParams: {
                title: 'some test data',
            },
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
            advancedSearchFields: [],
        };

        const wrapper = setup({
            actions: {
                exportEspacePublications: testExportAction,
                searchEspacePublications: jest.fn(),
            },
            searchQuery,
        });

        wrapper.instance().handleExportPublications({ exportPublicationsFormat: 'excel' });
        expect(testExportAction).toHaveBeenCalledWith({
            ...searchQuery,
            exportPublicationsFormat: 'excel',
        });
    });

    it('should handle set excluded facets correctly from searchfields sent from searchComponent', () => {
        const wrapper = setup();
        const test = [
            { searchField: 'rek_title', value: 'Test', label: '' },
            { searchField: 'rek_author', value: 'Ky Lane', label: '' },
        ];
        const result = ['Scopus document type', 'Genre', 'Year published', 'Published year range', 'Title', 'Author'];
        wrapper.instance().handleFacetExcludesFromSearchFields(test);
        expect(wrapper.instance().state.advancedSearchFields).toEqual(result);

        // handle null input
        wrapper.setState({
            advancedSearchFields: [],
        });
        wrapper.instance().handleFacetExcludesFromSearchFields(null);
        expect(wrapper.instance().state.advancedSearchFields.length).toBe(0);

        // handle searchField entry not having the searchField property
        wrapper.instance().handleFacetExcludesFromSearchFields({
            test: {},
        });
        expect(wrapper.instance().state.advancedSearchFields.length).toBe(
            locale.pages.searchRecords.facetsFilter.excludeFacetsList.length,
        );

        // handle fieldType.map being falsy
        wrapper.instance().handleFacetExcludesFromSearchFields({
            test: {
                searchField: '0',
            },
        });
        expect(wrapper.instance().state.advancedSearchFields.length).toBe(
            locale.pages.searchRecords.facetsFilter.excludeFacetsList.length,
        );
    });

    it('should handle empty search query string and should not fail to WSoD', () => {
        const wrapper = setup();
        const expected = {
            activeFacets: {
                filters: {},
                ranges: {},
            },
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
        };
        const result = wrapper.instance().parseSearchQueryStringFromUrl('');
        expect(result).toEqual(expected);
    });

    it('should call unmount component', () => {
        const clearSearchQueryFn = jest.fn();
        const wrapper = setup({
            actions: {
                clearSearchQuery: clearSearchQueryFn,
                searchEspacePublications: jest.fn(),
            },
        });
        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.unmount();
        expect(componentWillUnmount).toHaveBeenCalled();
        expect(clearSearchQueryFn).toHaveBeenCalled();
    });
});
