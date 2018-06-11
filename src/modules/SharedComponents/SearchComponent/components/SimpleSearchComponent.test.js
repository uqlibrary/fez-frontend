import SimpleSearchComponent from './SimpleSearchComponent';
import * as constants from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        searchQueryParams: {},
        className: 'simple-search',

        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

        isInHeader: false,

        onSearch: jest.fn(),
        onInvalidSearch: jest.fn(),
        onToggle: jest.fn(),

        ...testProps
    };

    return getElement(SimpleSearchComponent, props, isShallow);
}

describe('SimpleSearchComponent', () => {
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
        const wrapper = setup({isInHeader: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set search value from prop', () => {
        const wrapper = setup({showAdvancedSearchButton: true, searchQueryParams: {all: 'i feel lucky'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state when receiving new props', () => {
        // componentWillReceiveProps
        const wrapper = setup({showAdvancedSearchButton: true});
        wrapper.instance().componentWillReceiveProps({searchQueryParams: {all: 'i feel lucky'}});
        wrapper.update();
        expect(wrapper.state().searchText).toEqual('i feel lucky');
    });

    it('should update internal text field state', () => {
        const wrapper = setup({});
        expect(wrapper.state().searchText).toEqual('');

        wrapper.instance().handleSearchTextChange(null, 'new search value');
        wrapper.update();

        expect(wrapper.state().searchText).toEqual('new search value');
    });

    it('should not submit search if ENTER wasn\'t pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.instance().handleSimpleSearch({key: 'a'});
        wrapper.update();

        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.state().searchText = 'i feel lucky';
        wrapper.instance().handleSimpleSearch({key: 'Enter'});
        wrapper.update();

        expect(testMethod).toHaveBeenCalled();
    });

    it('should toggle search mode', () => {
        const testToggleFn = jest.fn();
        const wrapper = setup({showAdvancedSearchButton: true, onToggle: testToggleFn});
        wrapper.instance().handleSearchMode();
        expect(testToggleFn).toHaveBeenCalled();
    });

    it('should toggle mobile search', () => {
        const wrapper = setup({});
        wrapper.instance().handleToggleMobile();
        expect(wrapper.state().showMobile).toBe(true);
    });

    it('_searchTextValidationMessage() should return a message for being too long', () => {
        const wrapper = setup({});
        wrapper.setState({searchText: 'this is way too long'});
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 5;
        wrapper.update();
        expect(wrapper.instance()._searchTextValidationMessage(wrapper.state().searchText)).toEqual('Must be 5 characters or less');
    });

    it('_searchTextValidationMessage() should return false for being fine', () => {
        const wrapper = setup({});
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 20;
        wrapper.setState({searchText: 'this is fine'});
        wrapper.update();
        expect(wrapper.instance()._searchTextValidationMessage(wrapper.state().searchText)).toEqual(null);
    });

});
