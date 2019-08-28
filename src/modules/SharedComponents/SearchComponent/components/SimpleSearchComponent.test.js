import { SimpleSearchComponent, styles } from './SimpleSearchComponent';
import * as constants from 'config/general';

function setup(testProps = {}) {
    const props = {
        searchText: '',
        className: 'simple-search',

        showSearchButton: false,
        showMobileSearchButton: false,
        showAdvancedSearchButton: false,
        showPrefixIcon: false,

        isInHeader: false,

        onSearch: jest.fn(),
        onInvalidSearch: jest.fn(),
        onToggle: jest.fn(),
        onSearchTextChange: jest.fn(),
        classes: {
            inHeader: {},
        },

        ...testProps,
    };

    return getElement(SimpleSearchComponent, props);
}

describe('SimpleSearchComponent', () => {
    it('should render default view', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mobile view', () => {
        const wrapper = setup({
            showMobileSearchButton: true,
            isInHeader: true,
            classes: {
                mobileHeader: 'mobileHeaderTest',
            },
        });
        wrapper.setState({ showMobile: true });
        expect(toJson(wrapper.find('.mobileHeaderTest Hidden'))).toMatchSnapshot();
    });

    it('should show prefix icon when in header', () => {
        const wrapper = setup({
            isInHeader: true,
            showPrefixIcon: true,
            classes: {
                inHeader: 'headerClass',
                searchIconPrefix: 'searchIconPrefix',
            },
        });
        expect(toJson(wrapper.find('WithStyles(Grid).headerClass WithStyles(Grid)').first())).toMatchSnapshot();
    });

    it('should render show prefix icon in the search box', () => {
        const wrapper = setup({ showPrefixIcon: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with a class "header" for use in AppBar', () => {
        const wrapper = setup({ isInHeader: true });
        expect(toJson(wrapper)).toMatchSnapshot();

        const preventDefaultFn = jest.fn();
        wrapper
            .find('form')
            .props()
            .onSubmit({ preventDefault: preventDefaultFn });
        expect(preventDefaultFn).toHaveBeenCalled();
    });

    it('should set search value from prop', () => {
        const wrapper = setup({ showAdvancedSearchButton: true, searchText: 'i feel lucky' });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update search text field', () => {
        const testFn = jest.fn();
        const wrapper = setup({ onSearchTextChange: testFn });

        wrapper.instance()._handleSearchTextChange({ target: { value: 'new search value' } });

        expect(testFn).toHaveBeenCalledWith('new search value');
    });

    it("should not submit search if ENTER wasn't pressed", () => {
        const testMethod = jest.fn();
        const wrapper = setup({ onSearch: testMethod });

        wrapper.instance()._handleSearch({ key: 'a' });
        wrapper.update();

        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const searchFn = jest.fn();
        const blurFn = jest.fn();
        const wrapper = setup({
            searchText: 'i feel lucky',
            onSearch: searchFn,
        });

        wrapper.instance()._handleSearch({
            key: 'Enter',
            target: {
                blur: blurFn,
            },
        });
        wrapper.update();

        expect(searchFn).toBeCalled();
        expect(blurFn).toBeCalled();
    });

    it('should toggle search mode', () => {
        const testToggleFn = jest.fn();
        const wrapper = setup({
            showAdvancedSearchButton: true,
            onToggleSearchMode: testToggleFn,
        });
        wrapper.instance()._handleSearchMode();
        expect(testToggleFn).toHaveBeenCalled();
    });

    it('should toggle mobile search', () => {
        const wrapper = setup();
        wrapper.instance()._handleToggleMobile();
        expect(wrapper.state().showMobile).toBe(true);
        wrapper.instance()._handleToggleMobile();
        expect(wrapper.state().showMobile).toBe(false);
    });

    it('should handle search and notify with error message for max length for search text', () => {
        const testOnInvalidSearchFn = jest.fn();
        const wrapper = setup({ searchText: 'this is way too long', onInvalidSearch: testOnInvalidSearchFn });

        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 5;

        wrapper.instance()._handleSearch();
        expect(testOnInvalidSearchFn).toHaveBeenCalledWith('Must be 5 characters or less');
    });

    it('searchTextValidationMessage() should return a message for being too long', () => {
        const wrapper = setup();
        wrapper.setState({ searchText: 'this is way too long' });
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 5;
        wrapper.update();
        expect(wrapper.instance().searchTextValidationMessage(wrapper.state().searchText)).toEqual(
            'Must be 5 characters or less',
        );
    });

    it('searchTextValidationMessage() should return false for being fine', () => {
        const wrapper = setup();
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 20;
        wrapper.setState({ searchText: 'this is fine' });
        wrapper.update();
        expect(wrapper.instance().searchTextValidationMessage(wrapper.state().searchText)).toEqual(null);
    });

    it('should have a proper style generator', () => {
        const theme = {
            palette: {
                secondary: {
                    main: 'test1',
                },
                white: {
                    main: 'test2',
                },
            },
            typography: {
                fontWeightNormal: 'test3',
            },
        };
        expect(styles(theme)).toMatchSnapshot();
    });

    it('should have default event handler props return undefined', () => {
        const wrapper = getElement(SimpleSearchComponent, {
            onSearchTextChange: () => {},
        });
        const defaultPropMethodNames = ['onSearch', 'onToggleSearchMode', 'onInvalidSearch'];
        defaultPropMethodNames.forEach(methodName => {
            expect(wrapper.instance().props[methodName]()).toBeUndefined();
        });
    });
});
