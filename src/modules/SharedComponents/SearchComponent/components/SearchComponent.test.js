import SearchComponent from './SearchComponent';
import * as constants from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        searchQueryParams: {},
        applyInverseStyle: false,
        showAdvancedSearchButton: false,
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

    it('should render show mobile button', () => {
        const wrapper = setup({showMobileSearchButton: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render show prefix icon in the search box', () => {
        const wrapper = setup({showPrefixIcon: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with a class "header" for use in AppBar', () => {
        const wrapper = setup({inHeader: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with advanced search', () => {
        const wrapper = setup({showAdvancedSearchButton: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set search value from prop', () => {
        const wrapper = setup({showAdvancedSearchButton: true, searchQueryParams: {title: 'i feel lucky'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state when receiving new props', () => {
        // componentWillReceiveProps
        const wrapper = setup({showAdvancedSearchButton: true});
        wrapper.instance().componentWillReceiveProps({searchQueryParams: {title: 'i feel lucky'}});
        wrapper.update();
        expect(wrapper.state().searchText).toEqual('i feel lucky');
    });

    it('should update internal text field state', () => {
        const wrapper = setup({});
        expect(wrapper.state().searchText).toEqual('');

        wrapper.instance().searchTextChanged(null, 'new search value');
        wrapper.update();

        expect(wrapper.state().searchText).toEqual('new search value');
    });

    it('should not submit search if ENTER wasn\'t pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});

        wrapper.instance().handleSearch({key: 'a'});
        wrapper.update();

        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});

        wrapper.state().searchText = 'i feel lucky';
        wrapper.instance().handleSearch({key: 'Enter'});
        wrapper.update();

        expect(testMethod).toHaveBeenCalled();
    });

    it('should toggle advanced search', () => {
        const wrapper = setup({showAdvancedSearch: false});
        wrapper.update();
        expect(wrapper.state().showAdvancedSearch).toBe(false);
        wrapper.instance().toggleAdvancedSearch();
        wrapper.update();
        expect(wrapper.state().showAdvancedSearch).toBe(true);
    });

    it('should toggle mobile search', () => {
        const wrapper = setup({showMobile: false});
        wrapper.instance().toggleMobile();
        expect(wrapper.state().showMobile).toBe(true);
    });


    it('should show a snackbar error for input being too short', () => {
        const testMethod = jest.fn();
        constants.MIN_PUBLIC_SEARCH_TEXT_LENGTH = 100;
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 1000;
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});
        wrapper.setProps({inHeader: true});
        wrapper.setState({searchText: 'too short'});
        wrapper.update();
        wrapper.instance().handleSearch({key: 'Enter'});
        expect(wrapper.state().snackbarMessage).toEqual('Must be at least 100 characters');
        expect(wrapper.state().snackbarOpen).toBe(true);
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should show a snackbar error for input being too long', () => {
        const testMethod = jest.fn();
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 5;
        constants.MIN_PUBLIC_SEARCH_TEXT_LENGTH = 1;
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});
        wrapper.setProps({inHeader: true});
        wrapper.setState({searchText: 'this is way too long'});
        wrapper.update();
        wrapper.instance().handleSearch({key: 'Enter'});
        expect(wrapper.state().snackbarMessage).toEqual('Must be 5 characters or less');
        expect(wrapper.state().snackbarOpen).toBe(true);
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('validationError() should return a message for being too long', () => {
        const testMethod = jest.fn();
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 5;
        constants.MIN_PUBLIC_SEARCH_TEXT_LENGTH = 1;
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});
        wrapper.setProps({inHeader: false});
        wrapper.setState({searchText: 'this is way too long'});
        wrapper.update();
        expect(wrapper.instance().validationError()).toEqual('Must be 5 characters or less');
    });

    it('validationError() should return a message for being too short', () => {
        const testMethod = jest.fn();
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 500;
        constants.MIN_PUBLIC_SEARCH_TEXT_LENGTH = 100;
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});
        wrapper.setProps({inHeader: false});
        wrapper.setState({searchText: 'too short'});
        wrapper.update();
        expect(wrapper.instance().validationError()).toEqual('Must be at least 100 characters');
    });

    it('validationError() should return false for being fine', () => {
        const testMethod = jest.fn();
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 500;
        constants.MIN_PUBLIC_SEARCH_TEXT_LENGTH = 1;
        const wrapper = setup({actions: {searchEspacePublications: testMethod}});
        wrapper.setProps({inHeader: false});
        wrapper.setState({searchText: 'this is fine'});
        wrapper.update();
        expect(wrapper.instance().validationError()).toEqual(false);
    });

});
