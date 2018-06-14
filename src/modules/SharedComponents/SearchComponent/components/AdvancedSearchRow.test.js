import AdvancedSearchRow from './AdvancedSearchRow';
import * as constants from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        searchField: '0',
        value: '',
        disabledFields: [],
        rowIndex: 0,
        onSearchRowChange: jest.fn(),
        onSearchRowDelete: jest.fn(),
        ...testProps
    };

    return getElement(AdvancedSearchRow, props, isShallow);
}

describe('AdvancedSearchRow', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render search field row with select field and search text', () => {
        const wrapper = setup({searchField: 'all', value: 'i feel lucky'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render search field row with given disabled options', () => {
        const wrapper = setup({searchField: 'all', value: 'i feel lucky', disabledFields: ['all', 0]});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle search field dropdown change', () => {
        const testFn = jest.fn();
        const wrapper = setup({rowIndex: 1, onSearchRowChange: testFn});
        wrapper.instance()._handleSearchFieldChange({}, 2, 'rek_title');
        expect(testFn).toHaveBeenCalledWith(1, {searchField: 'rek_title', value: ''});
    });

    it('should handle search field text change', () => {
        const testFn = jest.fn();
        const wrapper = setup({rowIndex: 1, onSearchRowChange: testFn});
        wrapper.instance()._handleTextChange({}, 'i feel lucky');
        expect(testFn).toHaveBeenCalledWith(1, {searchField: '0', value: 'i feel lucky'});
    });

    it('should handle delete row', () => {
        const testFn = jest.fn();
        const wrapper = setup({rowIndex: 3, onSearchRowDelete: testFn});
        wrapper.instance()._deleteRow();
        expect(testFn).toHaveBeenCalledWith(3);
    });

    it('searchTextValidationMessage() should return a message for being too long', () => {
        const wrapper = setup({});
        wrapper.setState({searchText: 'this is way too long'});
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 5;
        wrapper.update();
        expect(wrapper.instance().searchTextValidationMessage(wrapper.state().searchText)).toEqual('Must be 5 characters or less');
    });

    it('searchTextValidationMessage() should return false for being fine', () => {
        const wrapper = setup({});
        constants.MAX_PUBLIC_SEARCH_TEXT_LENGTH = 20;
        wrapper.setState({searchText: 'this is fine'});
        wrapper.update();
        expect(wrapper.instance().searchTextValidationMessage(wrapper.state().searchText)).toEqual(null);
    });
});
