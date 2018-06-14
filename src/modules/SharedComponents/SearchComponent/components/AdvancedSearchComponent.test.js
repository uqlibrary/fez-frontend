import AdvancedSearchComponent from './AdvancedSearchComponent';
import * as constants from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        className: 'advanced-search',

        onAdvancedSearchRowChange: jest.fn(),
        onSearch: jest.fn(),

        ...testProps
    };

    return getElement(AdvancedSearchComponent, props, isShallow);
}

describe('AdvancedSearchComponent', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render minimised view', () => {
        const wrapper = setup({isMinimised: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with open access checked', () => {
        const wrapper = setup({isOpenAccess: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render advanced search row based on props', () => {
        const wrapper = setup({isOpenAccess: true, fieldRows: [{all: 'i feel lucky'}]});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle minimised view for advanced search', () => {
        const testFn = jest.fn();
        const wrapper = setup({onToggleMinimise: testFn});
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._toggleMinimise();
        expect(testFn).toHaveBeenCalled();
    });

    it('should toggle open access for advanced search', () => {
        const testFn = jest.fn();
        const wrapper = setup({onToggleOpenAccess: testFn});

        wrapper.instance()._toggleOpenAccess({preventDefault: jest.fn()});
        expect(testFn).toHaveBeenCalled();
    });

    it('should toggle search mode from advanced to simple', () => {
        const testFn = jest.fn();
        const wrapper = setup({onToggleSearchMode: testFn});

        wrapper.instance()._toggleSearchMode();
        expect(testFn).toHaveBeenCalled();
    });

    it('should add advanced search row', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onAdvancedSearchRowAdd: testMethod});

        wrapper.instance()._addAdvancedSearchRow();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should remove advanced search row', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onAdvancedSearchRowRemove: testMethod});

        wrapper.instance()._removeAdvancedSearchRow();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should reset advanced search', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onAdvancedSearchReset: testMethod});

        wrapper.instance()._resetAdvancedSearch();
        expect(testMethod).toHaveBeenCalled();
    });

    it('should handle changes in advnced search row', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onAdvancedSearchRowChange: testMethod});

        wrapper.instance()._handleAdvancedSearchRowChange(1, {searchField: 'all', value: 'test value'});
        expect(testMethod).toHaveBeenCalledWith(1, {searchField: 'all', value: 'test value'});
    });

    it('should not submit search if ENTER wasn\'t pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.instance()._handleAdvancedSearch({key: 'a'});
        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({
            onSearch: testMethod,
            fieldRows: [{
                searchField: 'all',
                value: 'i feel lucky'
            }]
        });

        wrapper.instance()._handleAdvancedSearch({key: 'Enter'});
        expect(testMethod).toHaveBeenCalled();
    });
});
