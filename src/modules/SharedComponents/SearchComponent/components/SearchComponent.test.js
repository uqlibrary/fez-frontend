import SearchComponent from './SearchComponent';
import * as constants from 'config/general';

function setup(testProps, isShallow = true){
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

        history: {
            push: jest.fn()
        },
        actions: {
            searchEspacePublications: jest.fn()
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
        wrapper.instance().componentWillReceiveProps({isAdvancedSearch: true, isAdvancedSearchMinimised: true});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const testHistoryPushMehtod = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testMethod}, history: {push: testHistoryPushMehtod}});

        const searchQuery = {
            page: 1,
            pageSize: 20,
            sortBy: 'published_date',
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
            search: 'page=1&pageSize=20&sortBy=published_date&sortDirection=Desc&searchQueryParams%5Ball%5D=i+feel+lucky',
            state: {
                activeFacets: {filters: {}, ranges: {}},
                page: 1,
                pageSize: 20,
                searchQueryParams: {
                    all: 'i feel lucky',
                },
                sortBy: 'published_date',
                sortDirection: 'Desc'
            }
        });
    });

    it('should toggle to advanced search', () => {
        const wrapper = setup({});

        expect(wrapper.state().isAdvancedSearch).toBeFalsy();

        wrapper.instance().toggleSearchMode();
        wrapper.update();

        expect(wrapper.state().isAdvancedSearch).toBeTruthy();
    });

    it('should toggle to simple search', () => {
        const wrapper = setup({isAdvancedSearch: true});

        expect(wrapper.state().isAdvancedSearch).toBeTruthy();

        wrapper.instance().toggleSearchMode();
        wrapper.update();

        expect(wrapper.state().isAdvancedSearch).toBeFalsy();
    });

    it('should show a snackbar error for input being too long', () => {
        const wrapper = setup({});
        wrapper.instance().displaySnackbar('Must be 5 characters or less');
        expect(wrapper.state().snackbarMessage).toEqual('Must be 5 characters or less');
        expect(wrapper.state().snackbarOpen).toBe(true);
    });
});
