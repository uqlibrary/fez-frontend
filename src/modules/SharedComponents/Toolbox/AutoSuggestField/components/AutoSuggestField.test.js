import {AutoSuggestField} from './AutoSuggestField';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        itemsList: testProps.itemsList || [],
        itemsListLoading: testProps.itemsListLoading || false,
        onChange: testProps.onChange || jest.fn(),    // : PropTypes.func.isRequired,
        loadSuggestions: testProps.loadSuggestions || jest.fn()
    };
    return getElement(AutoSuggestField, props, isShallow);
}

describe('AutoSuggestField component', () => {

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

    it('should render autosuggest field and call action creator', () => {
        const testFunction = jest.fn();
        const wrapper = setup({loadSuggestions: testFunction}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });

    it('should not set selected value if free text is not allowed', () => {
        let wrapper = setup({allowFreeText: false});
        expect(wrapper.state().selectedValue).toEqual({value: ''});
        const testValue = 'School of Math';
        wrapper.instance().valueSelected(testValue);
        expect(wrapper.state().selectedValue).toEqual({value: ''});
        wrapper = setup({allowFreeText: true});
        expect(wrapper.state().selectedValue).toEqual({value: ''});
        wrapper.instance().valueSelected(testValue);
        expect(wrapper.state().selectedValue).toEqual('School of Math');
    });

    it('should update autosuggest field value to empty if user deletes value from the field', () => {
        const onChangeTestFn = jest.fn();
        let wrapper = setup({allowFreeText: true, onChange: onChangeTestFn});
        wrapper.instance().textUpdated('Institution');
        wrapper.update();

        expect(onChangeTestFn).toHaveBeenCalledWith({value: 'Institution'});

        wrapper.instance().textUpdated('');
        wrapper.update();
        expect(onChangeTestFn).toHaveBeenCalledWith({value: ''});
    });
});
