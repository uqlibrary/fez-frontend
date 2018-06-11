import AdvancedSearchComponent from './AdvancedSearchComponent';
import * as constants from 'config/general';

function setup(testProps, isShallow = true){
    const props = {
        searchQueryParams: {},
        className: 'advanced-search',

        isOpenAccessInAdvancedMode: false,
        isAdvancedSearchMinimised: false,

        onSearch: jest.fn(),
        onToggle: jest.fn(),

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
        const wrapper = setup({isAdvancedSearchMinimised: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render default view with open access checked', () => {
        const wrapper = setup({isOpenAccessInAdvancedMode: true});
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.state().openAccess).toBeTruthy();
    });

    it('should set search value from prop', () => {
        const wrapper = setup({isOpenAccessInAdvancedMode: true, searchQueryParams: {all: 'i feel lucky'}});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state when receiving new props', () => {
        // componentWillReceiveProps
        const wrapper = setup({});
        wrapper.instance().componentWillReceiveProps({searchQueryParams: {all: 'i feel lucky'}});
        wrapper.update();
        expect(wrapper.state().fieldRows[0]).toEqual({searchField: 'all', value: 'i feel lucky'});
    });

    it('should toggle minimised view for advanced search', () => {
        const wrapper = setup({});
        wrapper.instance().toggleMinimisedView();
        wrapper.update();
        console.log(wrapper.state());
        expect(wrapper.state().minimised).toBeTruthy();
    });

    it('should not submit search if ENTER wasn\'t pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.instance().handleAdvancedSearch({key: 'a'});

        expect(testMethod).not.toHaveBeenCalled();
    });

    it('should submit search if search text is not null and ENTER is pressed', () => {
        const testMethod = jest.fn();
        const wrapper = setup({onSearch: testMethod});

        wrapper.state().fieldRows = [
            {
                searchField: 'all',
                value: 'i feel lucky'
            }
        ];
        wrapper.update();

        wrapper.instance().handleAdvancedSearch({key: 'Enter'});

        expect(testMethod).toHaveBeenCalled();
    });
});
