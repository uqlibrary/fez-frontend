import SearchComponent from './SearchComponent';

function setup(testProps, isShallow = true) {
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
            push: jest.fn()
        },
        actions: {
            searchEspacePublications: jest.fn()
        },
        location: {
            pathname: ''
        },
        ...testProps
    };

    return getElement(SearchComponent, props, isShallow);
}

describe('SearchComponent', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with a class "header" for use in AppBar', () => {
        const wrapper = setup({isInHeader: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with advanced search', () => {
        const wrapper = setup({isAdvancedSearch: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render simple search even if it says is advanced, if in header', () => {
        const wrapper = setup({isAdvancedSearch: true, isInHeader: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle search to minimised view of advanced search', () => {
        // componentWillReceiveProps
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance().componentWillReceiveProps({
            searchQueryParams: {
                all: 'i feel very lucky',
            },
            isAdvancedSearch: true,
            isAdvancedSearchMinimised: true,
            isOpenAccessInAdvancedMode: false
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display simple search with query string', () => {
        // componentWillReceiveProps
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.instance().componentWillReceiveProps({
            searchQueryParams: {
                all: 'i feel very lucky',
            },
            isAdvancedSearch: false,
            isAdvancedSearchMinimised: false,
            isOpenAccessInAdvancedMode: false
        });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should submit search for given search query params', () => {
        const testMethod = jest.fn();
        const testHistoryPushMehtod = jest.fn();
        const wrapper = setup({
            actions: {searchEspacePublications: testMethod},
            history: {push: testHistoryPushMehtod}
        });

        const searchQuery = {
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            searchQueryParams: {
                all: 'i feel lucky'
            },
            activeFacets: {
                filters: {},
                ranges: {}
            }
        };

        wrapper.instance().handleSearch(searchQuery);
        wrapper.update();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMehtod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D=i+feel+lucky',
            state: {
                activeFacets: {filters: {}, ranges: {}},
                page: 1,
                pageSize: 20,
                searchQueryParams: {
                    all: 'i feel lucky',
                },
                sortBy: 'score',
                sortDirection: 'Desc'
            }
        });
    });


    it('should submit search for given search query params for unpublished buffer', () => {
        const testMethod = jest.fn();
        const testHistoryPushMehtod = jest.fn();
        const wrapper = setup({
            actions: {searchEspacePublications: testMethod},
            history: {push: testHistoryPushMehtod},
            location: {pathname: '/admin/unpublished'},
            isAdmin: true,
            isUnpublishedBufferPage: true
        });

        const searchQuery = {
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            searchQueryParams: {
                rek_status: 3
            },
            activeFacets: {
                filters: {},
                ranges: {}
            }
        };

        wrapper.instance().handleSearch(searchQuery);
        wrapper.update();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMehtod).toHaveBeenCalledWith({
            pathname: '/admin/unpublished',
            search: 'page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Brek_status%5D=3',
            state: {
                activeFacets: {filters: {}, ranges: {}},
                page: 1,
                pageSize: 20,
                searchQueryParams: {
                    rek_status: 3,
                },
                sortBy: 'score',
                sortDirection: 'Desc'
            }
        });
    });

    it('should handle advanced search', () => {
        const testMethod = jest.fn();
        const testHistoryPushMehtod = jest.fn();
        const wrapper = setup({
            actions: {searchEspacePublications: testMethod},
            history: {push: testHistoryPushMehtod}
        });

        wrapper.state().advancedSearch = {
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel lucky',
                    label: ''
                },
                {
                    searchField: 'rek_title',
                    value: 'global warming',
                    label: ''
                }
            ],
            isOpenAccess: false,
            docTypes: [],
            yearFilter: {
                from: null,
                to: null,
                invalid: false
            }
        };

        wrapper.update();

        wrapper.instance()._handleAdvancedSearch();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMehtod).toHaveBeenCalledWith({
            "pathname": "/records/search",
            "search": "page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5Ball%5D%5Bvalue%5D=i+feel+lucky&searchQueryParams%5Ball%5D%5Blabel%5D=&searchQueryParams%5Brek_title%5D%5Bvalue%5D=global+warming&searchQueryParams%5Brek_title%5D%5Blabel%5D=&searchMode=advanced",
            "state": {
                "activeFacets": {"filters": {}, "ranges": {}},
                "page": 1,
                "pageSize": 20,
                "searchMode": "advanced",
                "searchQueryParams": {
                    "all": {"value": "i feel lucky", "label": ""},
                    "rek_display_type": [],
                    "rek_title": {"value": "global warming", "label": ""}
                },
                "sortBy": "score",
                "sortDirection": "Desc"
            }
        });
    })

    it('should handle simple search', () => {
        const testMethod = jest.fn();
        const testHistoryPushMehtod = jest.fn();
        const wrapper = setup({
            actions: {searchEspacePublications: testMethod},
            history: {push: testHistoryPushMehtod}
        });

        wrapper.state().simpleSearch = {
            searchText: 'i feel lucky'
        };

        wrapper.update();

        wrapper.instance()._handleSimpleSearch();

        expect(testMethod).toHaveBeenCalled();
        expect(testHistoryPushMehtod).toHaveBeenCalledWith({
            pathname: '/records/search',
            search: 'searchQueryParams%5Ball%5D=i+feel+lucky&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
            state: {
                activeFacets: {filters: {}, ranges: {}},
                page: 1,
                pageSize: 20,
                searchQueryParams: {
                    all: 'i feel lucky'
                },
                sortBy: 'score',
                sortDirection: 'Desc'
            }
        });
    });

    it('should show a snackbar error for input being too long', () => {
        const wrapper = setup({});
        wrapper.instance()._displaySnackbar('Must be 5 characters or less');
        expect(wrapper.state().snackbarMessage).toEqual('Must be 5 characters or less');
        expect(wrapper.state().snackbarOpen).toBe(true);
    });

    it('should toggle advanced search to minimised view', () => {
        const wrapper = setup({isAdvancedSearch: true});

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [{
                searchField: '0',
                value: '',
                label: ''
            }],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._toggleMinimise();
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [{
                searchField: '0',
                value: '',
                label: ''
            }],
            isOpenAccess: false,
            isMinimised: true,
            yearFilter: {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle to advanced search', () => {
        const wrapper = setup({isAdvancedSearch: false});

        wrapper.instance()._toggleSearchMode();
        wrapper.update();

        expect(wrapper.state().isAdvancedSearch).toBeTruthy();
        expect(wrapper.state().advancedSearch.isMinimised).toBeFalsy();
    });

    it('should toggle open access for advanced search', () => {
        const wrapper = setup({isAdvancedSearch: true});

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [{
                searchField: '0',
                value: '',
                label: ''
            }],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._toggleOpenAccess();
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [{
                searchField: '0',
                value: '',
                label: ''
            }],
            isOpenAccess: true,
            isMinimised: false,
            yearFilter: {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should toggle to simple search', () => {
        const wrapper = setup({isAdvancedSearch: true});

        wrapper.instance()._toggleSearchMode();
        wrapper.update();

        expect(wrapper.state().isAdvancedSearch).toBeFalsy();
    });

    it('should handle simple search text change', () => {
        const wrapper = setup({});

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._handleSimpleSearchTextChange('i feel lucky');
        wrapper.update();

        expect(wrapper.state().simpleSearch.searchText).toEqual('i feel lucky');
    });

    it('should add one row for advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: 'i feel lucky'
            },
            isAdvancedSearch: true
        });

        expect(wrapper.state().advancedSearch).toEqual({
            "docTypes": [],
            "fieldRows": [{"label": "", "searchField": "all", "value": "i feel lucky"}],
            "isMinimised": false,
            "isOpenAccess": false,
            "yearFilter": {}
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
                    label: ''
                },
                {
                    searchField: '0',
                    value: ''
                }
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {}
        });
    });

    it('should remove one row from advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: {value: 'i feel lucky', label: ''},
                rek_title: {value: 'remove rek title field', label: ''},
                docTypes: [],
            },
            isAdvancedSearch: true
        });

        expect(wrapper.state().advancedSearch).toEqual({
            "docTypes": [],
            "fieldRows": [{"label": "", "searchField": "all", "value": "i feel lucky"}, {
                "label": "",
                "searchField": "rek_title",
                "value": "remove rek title field"
            }, {"label": "", "searchField": "docTypes", "value": []}],
            "isMinimised": false,
            "isOpenAccess": false,
            "yearFilter": {}
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
                    label: ''
                },
                {
                    searchField: "docTypes",
                    value: [],
                    label: ''
                },
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update advanced search row on search text changed', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: {value: 'i feel lucky', label: ''}
            },
            isAdvancedSearch: true
        });

        expect(wrapper.state().advancedSearch).toEqual({
            "docTypes": [],
            "fieldRows": [{"label": "", "searchField": "all", "value": "i feel lucky"}],
            "isMinimised": false,
            "isOpenAccess": false,
            "yearFilter": {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._handleAdvancedSearchRowChange(0, {
            searchField: 'all',
            value: 'i feel more lucky',
            label: ''
        });
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel more lucky',
                    label: ''
                }
            ],
            isOpenAccess: false,
            isMinimised: false,
            yearFilter: {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should reset advanced search', () => {
        const wrapper = setup({
            searchQueryParams: {
                all: {value: 'i feel lucky', label: ''},
                rek_title: {value: 'global warming', label: ''}
            },
            activeFacets: {filters: {}, ranges: {}},
            isAdvancedSearch: true,
            isOpenAccessInAdvancedMode: true
        });

        expect(wrapper.state().advancedSearch).toEqual({
            docTypes: [],
            fieldRows: [
                {
                    searchField: 'all',
                    value: 'i feel lucky',
                    label: ''
                },
                {
                    searchField: 'rek_title',
                    value: 'global warming',
                    label: ''
                }
            ],
            isOpenAccess: true,
            isMinimised: false,
            yearFilter: {}
        });

        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._resetAdvancedSearch();
        wrapper.update();

        expect(wrapper.state().advancedSearch).toEqual({
            "docTypes": [],
            "fieldRows": [{"searchField": "0", "value": ""}],
            "isOpenAccess": false,
            "yearFilter": {"from": 0, "to": 0}
        });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('getFieldRowsFromSearchQuery', () => {
        it('should get default field if search query params not set (undefined)', () => {
            const wrapper = setup({});
            const fieldRows = wrapper.instance().getFieldRowsFromSearchQuery(undefined);

            expect(fieldRows).toEqual([{searchField: '0', value: '', label: ''}]);
        });

        it('should get default field if search query params not set (empty object)', () => {
            const wrapper = setup({});
            const fieldRows = wrapper.instance().getFieldRowsFromSearchQuery({});

            expect(fieldRows).toEqual([{searchField: '0', value: '', label: ''}]);
        });

        it('should get field rows from search query params', () => {
            const wrapper = setup({});
            const fieldRows = wrapper.instance().getFieldRowsFromSearchQuery({
                all: 'test',
                rek_title: 'some title'
            });

            expect(fieldRows).toEqual([
                {
                    searchField: 'all',
                    value: 'test',
                    label: ''
                },
                {
                    searchField: 'rek_title',
                    value: 'some title',
                    label: ''
                }
            ]);
        });
    });
});
