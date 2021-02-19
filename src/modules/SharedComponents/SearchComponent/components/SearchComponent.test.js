import SearchComponent from './SearchComponent';
import moment from 'moment';

function setup(testProps = {}, args = {}) {
    const props = {
        searchQueryParams: {},

        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

        isInHeader: false,
        isAdvancedSearch: false,
        isAdvancedSearchMinimised: false,
        isOpenAccessInAdvancedMode: false,
        updateFacetExcludesFromSearchFields: jest.fn(),
        isAdmin: false,
        isUnpublishedBufferPage: false,

        history: {
            push: jest.fn(),
        },
        actions: {
            searchEspacePublications: jest.fn(),
        },
        location: {
            pathname: '',
        },
        ...testProps,
    };

    return getElement(SearchComponent, props, args);
}

describe('SearchComponent', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set default prop method as expected', () => {
        const wrapper = getElement(SearchComponent, {
            history: {
                push: jest.fn(),
            },
        });
        expect(wrapper.instance().props.updateFacetExcludesFromSearchFields()).toBeUndefined();
    });

    it('should render with a class "header" for use in AppBar', () => {
        const wrapper = setup({ isInHeader: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with advanced search', () => {
        const wrapper = setup({ isAdvancedSearch: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render simple search even if it says is advanced, if in header', () => {
        const wrapper = setup({ isAdvancedSearch: true, isInHeader: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle search to minimised view of advanced search', () => {
        // UNSAFE_componentWillReceiveProps
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            searchQueryParams: {
                all: 'i feel very lucky',
            },
            isAdvancedSearch: true,
            isAdvancedSearchMinimised: true,
            isOpenAccessInAdvancedMode: false,
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should minimise advanced search in mobile context', () => {
        const props = {
            history: {
                push: jest.fn(),
            },
        };
        const context = {
            isMobile: true,
        };
        const wrapper = setup(props, { context });
        wrapper.setProps({
            isAdvancedSearchMinimised: true,
        });
        expect(wrapper.state().advancedSearch.isMinimised).toBe(true);
    });

    it('should display simple search with query string', () => {
        // UNSAFE_componentWillReceiveProps
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance().UNSAFE_componentWillReceiveProps({
            searchQueryParams: {
                all: 'i feel very lucky',
            },
            isAdvancedSearch: false,
            isAdvancedSearchMinimised: false,
            isOpenAccessInAdvancedMode: false,
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should submit search for given search query params', () => {
        const testMethod = jest.fn();
        const testHistoryPushMethod = jest.fn();
        const wrapper = setup({
            actions: { searchEspacePublications: testMethod },
            history: { push: testHistoryPushMethod },
        });

        const searchQuery = {
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            searchQueryParams: {
                all: 'i feel lucky',
            },
            activeFacets: {
                filters: {},
                ranges: {},
            },
        };

        wrapper.instance().handleSearch(searchQuery);
        wrapper.update();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=i+feel+lucky',
            state: {
                activeFacets: { filters: {}, ranges: {} },
                page: 1,
                pageSize: 20,
                searchQueryParams: {
                    all: 'i feel lucky',
                },
                sortBy: 'score',
                sortDirection: 'Desc',
            },
        });
    });

    it('should submit search for given search query params for unpublished buffer', () => {
        const testMethod = jest.fn();
        const testHistoryPushMethod = jest.fn();
        const wrapper = setup({
            actions: { searchEspacePublications: testMethod },
            history: { push: testHistoryPushMethod },
            location: { pathname: '/admin/unpublished' },
            isAdmin: true,
            isUnpublishedBufferPage: true,
        });

        const searchQuery = {
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            searchQueryParams: {
                rek_status: 3,
            },
            activeFacets: {
                filters: {},
                ranges: {},
            },
        };

        wrapper.instance().handleSearch(searchQuery);
        wrapper.update();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/admin/unpublished',
            search: 'page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Brek_status%5D=3',
            state: {
                activeFacets: { filters: {}, ranges: {} },
                page: 1,
                pageSize: 20,
                searchQueryParams: {
                    rek_status: 3,
                },
                sortBy: 'score',
                sortDirection: 'Desc',
            },
        });

        wrapper.setState({
            isAdvancedSearch: true,
        });
        expect(wrapper.find('AdvancedSearchComponent').props().showUnpublishedFields).toBe(true);
    });

    it('should not search is searchQuery is empty', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            actions: {
                searchEspacePublications: testFn,
            },
        });
        wrapper.instance().handleSearch('');
        expect(testFn).not.toBeCalled();
    });

    it('should handle advanced search', () => {
        const testMethod = jest.fn();
        const testHistoryPushMethod = jest.fn();
        const wrapper = setup({
            actions: { searchEspacePublications: testMethod },
            history: { push: testHistoryPushMethod },
        });

        wrapper.state().advancedSearch = {
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel lucky',
                    label: '',
                },
                {
                    searchField: 'rek_title',
                    value: 'global warming',
                    label: '',
                },
            ],
            isOpenAccess: false,
            docTypes: [],
            yearFilter: {
                from: null,
                to: null,
                invalid: false,
            },
        };

        wrapper.update();

        wrapper.instance()._handleAdvancedSearch();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D%5Bvalue%5D' +
                '=i+feel+lucky&searchQueryParams%5Ball%5D%5Blabel%5D=&searchQueryParams%5Brek_title%5D%5B' +
                'value%5D=global+warming&searchQueryParams%5Brek_title%5D%5Blabel%5D=&searchMode=advanced',
            state: {
                activeFacets: { filters: {}, ranges: {} },
                page: 1,
                pageSize: 20,
                searchMode: 'advanced',
                searchQueryParams: {
                    all: { value: 'i feel lucky', label: '' },
                    rek_display_type: [],
                    rek_title: { value: 'global warming', label: '' },
                },
                sortBy: 'score',
                sortDirection: 'Desc',
            },
        });

        wrapper.setProps({
            isAdmin: true,
        });
        wrapper.setState({
            advancedSearch: {
                fieldRows: [
                    {
                        searchField: 'rek_status',
                        value: 4,
                    },
                ],
            },
        });

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search:
                'page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D%5Bvalue%5D' +
                '=i+feel+lucky&searchQueryParams%5Ball%5D%5Blabel%5D=&searchQueryParams%5Brek_title%5D%5B' +
                'value%5D=global+warming&searchQueryParams%5Brek_title%5D%5Blabel%5D=&searchMode=advanced',
            state: {
                activeFacets: { filters: {}, ranges: {} },
                page: 1,
                pageSize: 20,
                searchMode: 'advanced',
                searchQueryParams: {
                    all: { value: 'i feel lucky', label: '' },
                    rek_display_type: [],
                    rek_title: { value: 'global warming', label: '' },
                },
                sortBy: 'score',
                sortDirection: 'Desc',
            },
        });
    });

    it(
        'should handle advanced search with year range, rek_status, ' +
            'rek_created_date and rek_updated_date key set for an admin',
        () => {
            const testMethod = jest.fn();
            const testHistoryPushMethod = jest.fn();
            const wrapper = setup({
                actions: { searchEspacePublications: testMethod },
                history: { push: testHistoryPushMethod },
                isAdmin: true,
            });

            wrapper.setState({
                advancedSearch: {
                    fieldRows: [
                        {
                            searchField: 'all',
                            value: 'i feel lucky',
                            label: '',
                        },
                        {
                            searchField: 'rek_title',
                            value: 'global warming',
                            label: '',
                        },
                        {
                            searchField: 'rek_status',
                            value: 'Retracted',
                        },
                        {
                            searchField: 'rek_created_date',
                            value: {
                                from: moment('10/10/1982', 'DD/MM/YYYY'),
                                to: moment('10/10/1985', 'DD/MM/YYYY'),
                            },
                        },
                        {
                            searchField: 'rek_updated_date',
                            value: {
                                from: moment('10/10/1980', 'DD/MM/YYYY'),
                                to: moment('10/10/1982', 'DD/MM/YYYY'),
                            },
                        },
                    ],
                    isOpenAccess: false,
                    docTypes: [],
                    yearFilter: {
                        from: 2000,
                        to: 2008,
                        invalid: false,
                    },
                },
            });

            wrapper.instance()._handleAdvancedSearch();

            expect(testMethod).toHaveBeenCalled();
            expect(testHistoryPushMethod).toHaveBeenCalledWith({
                pathname: '/records/search',
                search:
                    /* eslint-disable-next-line max-len */
                    'page=1&pageSize=20&sortBy=score&sortDirection=Desc&activeFacets%5Branges%5D%5BCreated+date%5D=%5B1982-10-09T14%3A00%3A00Z+TO+1985-10-10T13%3A59%3A59Z%5D&activeFacets%5Branges%5D%5BUpdated+date%5D=%5B1980-10-09T14%3A00%3A00Z+TO+1982-10-10T13%3A59%3A59Z%5D&activeFacets%5Branges%5D%5BYear+published%5D%5Bfrom%5D=2000&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D=2008&searchQueryParams%5Ball%5D%5Bvalue%5D=i+feel+lucky&searchQueryParams%5Ball%5D%5Blabel%5D=&searchQueryParams%5Brek_title%5D%5Bvalue%5D=global+warming&searchQueryParams%5Brek_title%5D%5Blabel%5D=&searchQueryParams%5Brek_status%5D%5Bvalue%5D=7&searchQueryParams%5Brek_created_date%5D%5Bvalue%5D=%5B1982-10-09T14%3A00%3A00Z+TO+1985-10-10T13%3A59%3A59Z%5D&searchQueryParams%5Brek_created_date%5D%5Blabel%5D=%5B09%2F10%2F1982+to+10%2F10%2F1985%5D&searchQueryParams%5Brek_updated_date%5D%5Bvalue%5D=%5B1980-10-09T14%3A00%3A00Z+TO+1982-10-10T13%3A59%3A59Z%5D&searchQueryParams%5Brek_updated_date%5D%5Blabel%5D=%5B09%2F10%2F1980+to+10%2F10%2F1982%5D&searchMode=advanced',
                state: {
                    activeFacets: {
                        filters: {},
                        ranges: {
                            'Created date': '[1982-10-09T14:00:00Z TO 1985-10-10T13:59:59Z]',
                            'Updated date': '[1980-10-09T14:00:00Z TO 1982-10-10T13:59:59Z]',
                            'Year published': {
                                from: 2000,
                                to: 2008,
                            },
                        },
                    },
                    page: 1,
                    pageSize: 20,
                    searchMode: 'advanced',
                    searchQueryParams: {
                        all: {
                            value: 'i feel lucky',
                            label: '',
                        },
                        rek_display_type: [],
                        rek_title: {
                            value: 'global warming',
                            label: '',
                        },
                        rek_status: { value: 7 },
                        rek_created_date: {
                            label: '[09/10/1982 to 10/10/1985]',
                            value: '[1982-10-09T14:00:00Z TO 1985-10-10T13:59:59Z]',
                        },
                        rek_updated_date: {
                            label: '[09/10/1980 to 10/10/1982]',
                            value: '[1980-10-09T14:00:00Z TO 1982-10-10T13:59:59Z]',
                        },
                    },
                    sortBy: 'score',
                    sortDirection: 'Desc',
                },
            });
        },
    );

    it('should handle simple search', () => {
        const testMethod = jest.fn();
        const testHistoryPushMethod = jest.fn();
        const wrapper = setup({
            actions: { searchEspacePublications: testMethod },
            history: { push: testHistoryPushMethod },
        });

        wrapper.state().simpleSearch = {
            searchText: 'i feel lucky',
        };

        wrapper.update();

        wrapper.instance()._handleSimpleSearch();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMethod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'searchQueryParams%5Ball%5D=i+feel+lucky&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
            state: {
                activeFacets: {
                    filters: {},
                    ranges: {},
                },
                page: 1,
                pageSize: 20,
                searchQueryParams: {
                    all: 'i feel lucky',
                },
                sortBy: 'score',
                sortDirection: 'Desc',
            },
        });
    });

    it('should show a snackbar error for input being too long', () => {
        const wrapper = setup();
        wrapper.instance()._displaySnackbar('Must be 5 characters or less');
        expect(wrapper.state().snackbarMessage).toEqual('Must be 5 characters or less');
        expect(wrapper.state().snackbarOpen).toBe(true);
    });

    it('should toggle advanced search to minimised view', () => {
        const wrapper = setup({ isAdvancedSearch: true });

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: '0',
                    value: '',
                    label: '',
                },
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._toggleMinimise();
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: '0',
                    value: '',
                    label: '',
                },
            ],
            isOpenAccess: false,
            isMinimised: true,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle to advanced search', () => {
        const wrapper = setup({ isAdvancedSearch: false });

        wrapper.instance()._toggleSearchMode();
        wrapper.update();

        expect(wrapper.state().isAdvancedSearch).toBeTruthy();
        expect(wrapper.state().advancedSearch.isMinimised).toBeFalsy();
    });

    it('should toggle open access for advanced search', () => {
        const wrapper = setup({ isAdvancedSearch: true });

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: '0',
                    value: '',
                    label: '',
                },
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._toggleOpenAccess();
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: '0',
                    value: '',
                    label: '',
                },
            ],
            isOpenAccess: true,
            isMinimised: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle to simple search', () => {
        const wrapper = setup({ isAdvancedSearch: true });

        wrapper.instance()._toggleSearchMode();
        wrapper.update();

        expect(wrapper.state().isAdvancedSearch).toBeFalsy();
    });

    it('should handle simple search text change', () => {
        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._handleSimpleSearchTextChange('i feel lucky');
        wrapper.update();

        expect(wrapper.state().simpleSearch.searchText).toEqual('i feel lucky');
    });

    it('should add one row for advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky',
            },
            isAdvancedSearch: true,
        });

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [{ label: '', searchField: 'all', value: 'i feel lucky' }],
            isMinimised: false,
            isOpenAccess: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._addAdvancedSearchRow();
        wrapper.update();

        expect(toJson(wrapper)).toMatchSnapshot();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel lucky',
                    label: '',
                },
                {
                    searchField: '0',
                    value: '',
                },
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {},
        });
    });

    it('should remove one row from advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: { value: 'i feel lucky', label: '' },
                rek_title: { value: 'remove rek title field', label: '' },
                docTypes: [],
            },
            isAdvancedSearch: true,
        });

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                { label: '', searchField: 'all', value: 'i feel lucky' },
                {
                    label: '',
                    searchField: 'rek_title',
                    value: 'remove rek title field',
                },
                { label: '', searchField: 'docTypes', value: [] },
            ],
            isMinimised: false,
            isOpenAccess: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._removeAdvancedSearchRow(1);
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel lucky',
                    label: '',
                },
                {
                    searchField: 'docTypes',
                    value: [],
                    label: '',
                },
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update advanced search row on search text changed', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: { value: 'i feel lucky', label: '' },
            },
            isAdvancedSearch: true,
        });

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [{ label: '', searchField: 'all', value: 'i feel lucky' }],
            isMinimised: false,
            isOpenAccess: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._handleAdvancedSearchRowChange(0, {
            searchField: 'all',
            value: 'i feel more lucky',
            label: '',
        });
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel more lucky',
                    label: '',
                },
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should reset advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: { value: 'i feel lucky', label: '' },
                rek_title: { value: 'global warming', label: '' },
            },
            activeFacets: { filters: {}, ranges: {} },
            isAdvancedSearch: true,
            isOpenAccessInAdvancedMode: true,
        });

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel lucky',
                    label: '',
                },
                {
                    searchField: 'rek_title',
                    value: 'global warming',
                    label: '',
                },
            ],
            isOpenAccess: true,
            isMinimised: false,
            yearFilter: {},
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._resetAdvancedSearch();
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [{ searchField: '0', value: '' }],
            isOpenAccess: false,
            yearFilter: { from: 0, to: 0 },
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update doc type values', () => {
        const wrapper = setup({ isAdvancedSearch: true });
        const setState = jest.spyOn(wrapper.instance(), 'setState');

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('AdvancedSearchComponent')
            .props()
            .updateDocTypeValues([317, 123]);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(setState).toHaveBeenCalledWith({
            advancedSearch: {
                docTypes: [317, 123],
                fieldRows: [
                    {
                        label: '',
                        searchField: '0',
                        value: '',
                    },
                ],
                isMinimised: false,
                isOpenAccess: false,
                yearFilter: {},
            },
        });
    });

    it('should update year range filter', () => {
        const wrapper = setup({ isAdvancedSearch: true });
        const setState = jest.spyOn(wrapper.instance(), 'setState');

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('AdvancedSearchComponent')
            .props()
            .updateYearRangeFilter({
                from: '2000',
                to: '2003',
                valid: true,
            });
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(setState).toHaveBeenCalledWith({
            advancedSearch: {
                docTypes: [],
                fieldRows: [
                    {
                        label: '',
                        searchField: '0',
                        value: '',
                    },
                ],
                isMinimised: false,
                isOpenAccess: false,
                yearFilter: {
                    from: '2000',
                    to: '2003',
                    valid: true,
                },
            },
        });
    });

    it('should update date range filter', () => {
        const wrapper = setup({ isAdvancedSearch: true });
        const setState = jest.spyOn(wrapper.instance(), 'setState');

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper
            .find('AdvancedSearchComponent')
            .props()
            .updateDateRange('rek_created_date', '[2000 - 2001]');
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(setState).toHaveBeenCalledWith({
            advancedSearch: {
                docTypes: [],
                fieldRows: [
                    {
                        label: '',
                        searchField: '0',
                        value: '',
                    },
                    {
                        label: '',
                        searchField: 'rek_created_date',
                        value: '[2000 - 2001]',
                    },
                ],
                isMinimised: false,
                isOpenAccess: false,
                yearFilter: {},
            },
        });

        wrapper
            .find('AdvancedSearchComponent')
            .props()
            .updateDateRange('rek_created_date', '[2000 - 2005]');
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(setState).toHaveBeenCalledWith({
            advancedSearch: {
                docTypes: [],
                fieldRows: [
                    {
                        label: '',
                        searchField: '0',
                        value: '',
                    },
                    {
                        label: '',
                        searchField: 'rek_created_date',
                        value: '[2000 - 2005]',
                    },
                ],
                isMinimised: false,
                isOpenAccess: false,
                yearFilter: {},
            },
        });
    });

    describe('getFieldRowsFromSearchQuery', () => {
        it('should get default field if search query params not set (undefined)', () => {
            const wrapper = setup();
            const fieldRows = wrapper.instance().getFieldRowsFromSearchQuery(undefined);

            expect(fieldRows).toEqual([{ searchField: '0', value: '', label: '' }]);
        });

        it('should get default field if search query params not set (empty object)', () => {
            const wrapper = setup();
            const fieldRows = wrapper.instance().getFieldRowsFromSearchQuery({});

            expect(fieldRows).toEqual([{ searchField: '0', value: '', label: '' }]);
        });

        it('should process empty search query', () => {
            const wrapper = setup({
                isAdmin: false,
            });
            expect(
                wrapper.instance().getFieldRowsFromSearchQuery({
                    rek_status: '',
                    rek_updated_date: '',
                }),
            ).toMatchSnapshot();
        });

        it('should process missing label', () => {
            const wrapper = setup({
                isAdmin: true,
                isUnpublishedBufferPage: true,
            });
            expect(
                wrapper.instance().getFieldRowsFromSearchQuery({
                    rek_updated_date: {
                        notLabel: 'test',
                    },
                }),
            ).toMatchSnapshot();
        });

        it('should get field rows from search query params', () => {
            const wrapper = setup();
            const fieldRows = wrapper.instance().getFieldRowsFromSearchQuery({
                all: 'test',
                rek_title: 'some title',
            });

            expect(fieldRows).toEqual([
                {
                    searchField: 'all',
                    value: 'test',
                    label: '',
                },
                {
                    searchField: 'rek_title',
                    value: 'some title',
                    label: '',
                },
            ]);
        });

        it('should get field rows from search query params for admin', () => {
            const wrapper = setup({
                isAdmin: true,
                isUnpublishedBufferPage: true,
            });

            const fieldRows = wrapper.instance().getFieldRowsFromSearchQuery({
                all: 'test',
                rek_status: { value: 3 },
                rek_created_date: { label: '[31/01/2019 to 12/02/2019]' },
                rek_updated_date: { label: '[31/01/2019 to 12/02/2019]' },
            });

            expect(fieldRows).toEqual([
                {
                    searchField: 'all',
                    value: 'test',
                    label: '',
                },
                {
                    searchField: 'rek_status',
                    value: 'Submitted for Approval',
                    label: '',
                },
                {
                    searchField: 'rek_created_date',
                    value: {
                        from: moment('31/01/2019', 'DD/MM/YYYY'),
                        to: moment('12/02/2019', 'DD/MM/YYYY'),
                    },
                    label: '',
                },
                {
                    searchField: 'rek_updated_date',
                    value: {
                        from: moment('31/01/2019', 'DD/MM/YYYY'),
                        to: moment('12/02/2019', 'DD/MM/YYYY'),
                    },
                    label: '',
                },
            ]);
        });
    });

    describe('getDateRangeFromSearchQuery', () => {
        it('should get date range from search query', () => {
            const wrapper = setup();
            const dateRange = wrapper.instance().getDateRangeFromSearchQuery({
                rek_created_date: { label: '[31/01/2019 to 12/02/2019]' },
                rek_updated_date: { label: '[31/01/2019 to 12/02/2019]' },
            });
            expect(dateRange).toEqual({
                createdRange: {
                    from: moment('31/01/2019', 'DD/MM/YYYY'),
                    to: moment('12/02/2019', 'DD/MM/YYYY'),
                },
                updatedRange: {
                    from: moment('31/01/2019', 'DD/MM/YYYY'),
                    to: moment('12/02/2019', 'DD/MM/YYYY'),
                },
            });
        });

        it('should not get date range from search query', () => {
            const wrapper = setup();
            const dateRange = wrapper.instance().getDateRangeFromSearchQuery({
                rek_created_date: '[31/01/2019 to 12/02/2019]',
                rek_updated_date: '[31/01/2019 to 12/02/2019]',
            });
            expect(dateRange).toEqual({
                createdRange: {},
                updatedRange: {},
            });
        });
    });

    describe('parseDateRange', () => {
        it('should return date range', () => {
            const wrapper = setup();
            expect(wrapper.instance().parseDateRange('[31/01/2019 to 12/02/2019]')).toMatchSnapshot();
        });

        it('should return empty object in case of invalid input', () => {
            const wrapper = setup();
            expect(wrapper.instance().parseDateRange('')).toEqual({});
        });
    });

    describe('getDocTypesFromSearchQuery', () => {
        it('should get doc types from search query', () => {
            const wrapper = setup();
            const docTypes = wrapper.instance().getDocTypesFromSearchQuery({
                rek_display_type: [345, 373],
            });
            expect(docTypes).toEqual([345, 373]);
        });
    });

    describe('getYearRangeFromActiveFacets', () => {
        it('should get year range from active facets', () => {
            const wrapper = setup();
            const yearRange = wrapper.instance().getYearRangeFromActiveFacets({
                ranges: {
                    'Year published': {
                        from: '2001',
                        to: '2005',
                    },
                },
            });
            expect(yearRange).toEqual({
                from: '2001',
                to: '2005',
            });
        });
    });

    describe('getSearchQuery', () => {
        it('should construct search query', () => {
            const wrapper = setup();
            wrapper.setState({
                advancedSearch: {
                    isOpenAccess: true,
                },
            });
            expect(
                wrapper.instance().getSearchQuery({
                    all: 'i feel lucky',
                }),
            ).toMatchSnapshot();
        });
    });
});
