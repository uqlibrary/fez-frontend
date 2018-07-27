import {AdvancedSearchAutoComplete} from './AdvancedSearchAutoComplete';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        itemsList: testProps.itemsList || [],
        itemsListLoading: testProps.itemsListLoading || false,
        onChange: testProps.onChange || jest.fn(),    // : PropTypes.func.isRequired,
        loadSuggestions: testProps.loadSuggestions || jest.fn()
    };
    return getElement(AdvancedSearchAutoComplete, props, isShallow);
}

describe('AdvancedSearchAutoComplete component', () => {

    it('should render', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with disabled flag set to true', () => {
        const wrapper = setup({disabled: true}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with className set', () => {
        const wrapper = setup({className: 'requiredField'}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
