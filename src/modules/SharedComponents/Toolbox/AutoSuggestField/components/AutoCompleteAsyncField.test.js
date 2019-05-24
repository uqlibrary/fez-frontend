import { AutoCompleteAsyncField, styles } from './AutoCompleteAsyncField';
import Downshift from 'downshift';

function setup(testProps, isShallow = true) {
    const props = {
        itemsList: [],
        itemsListLoading: false,
        onChange: jest.fn(),
        loadSuggestions: jest.fn(),
        classes: {
            root: 'root',
            container: 'container',
            paper: 'paper',
            inputRoot: 'inputRoot'
        },
        itemToString: jest.fn(),
        category: null,
        floatingLabelText: '',
        error: false,
        errorText: undefined,
        hintText: null,
        allowFreeText: false,
        async: true,
        disabled: false,
        maxResults: 7,
        required: false,
        selectedValue: null,
        openOnFocus: false,
        ...testProps
    };
    return getElement(AutoCompleteAsyncField, props, isShallow);
}

describe('AutoCompleteAsyncField component', () => {

    it('should render', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with disabled flag set to true', () => {
        const wrapper = setup({ disabled: true }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render as required field', () => {
        const wrapper = setup({ required: true }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with an input which allows free text input', () => {
        const wrapper = setup({ required: true, allowFreeText: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render a spinner while loading', () => {
        const wrapper = setup({itemsListLoading: true }, false);
        expect(toJson(wrapper.find('CircularProgress'))).toMatchSnapshot();
    });

    it('should render autosuggest field and call action creator', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ loadSuggestions: testFunction, async: false }, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });

    it('should render items list on focusing on input', () => {
        const testFunction = jest.fn();
        const wrapper = setup({
            loadSuggestions: testFunction,
            async: false,
            openOnFocus: true,
            itemsList: [{
                id: 1,
                value: 'test'
            }, {
                id: 2,
                value: 'testing'
            }, {
                id: 3,
                value: 'tested'
            }]
        }, false);

        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('input').prop('onFocus')();
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with textInputRef set', () => {
        const filterFn = jest.fn((searchText, key) => searchText === key);
        const wrapper = setup({
            itemsList: [{
                id: null,
                value: ''
            }],
            filter: filterFn
        });
        wrapper.instance().textInputRef = {
            clientWidth: 50
        };
        const childrenFn = wrapper.find('Downshift').props().children;
        const renderedChild = childrenFn({
            getInputProps: () => ({ onChange: wrapper.instance().getSuggestions }),
            getMenuProps: jest.fn(),
            isOpen: true,
            inputValue: 10
        });
        const childElement = getElement(renderedChild.type, renderedChild.props);
        expect(childElement.find('WithStyles(Paper)').props().style.width).toBe(50);
    });

    it('should have a proper style generator', () => {
        expect(styles()).toMatchSnapshot();
    });

    it('should call stateReducer function on state change as free text field', () => {
        const onChangeFn = jest.fn(({ value }) => expect(value).toEqual('test'));
        const wrapper = setup({ required: true, allowFreeText: true, onChange: onChangeFn });
        const stateChangeFn = wrapper.instance().handleStateChange();
        stateChangeFn({ inputValue: 'test' });
        expect(onChangeFn).toHaveBeenCalled();
    });

    it('should call stateReducer function on state change as non free text field', () => {
        const wrapper = setup({ required: true, allowFreeText: false });
        const stateChangeFn = wrapper.instance().handleStateChange();
        expect(stateChangeFn()).toEqual(undefined);
    });

    it('should test stateReducer function correctly when free text input is allowed on blurInput event', () => {
        const wrapper = setup({ required: true, allowFreeText: true });
        const result = wrapper.instance().stateReducer(
            { inputValue: 'Test' },
            { type: Downshift.stateChangeTypes.blurInput, a: 'test', b: 'testing' }
        );
        expect(result).toEqual({
            inputValue: 'Test',
            type: Downshift.stateChangeTypes.blurInput,
            a: 'test',
            b: 'testing'
        });
    });

    it('should test stateReducer function correctly when free text input is allowed on itemMouseEnter event', () => {
        const wrapper = setup({ required: true, allowFreeText: true });
        const result = wrapper.instance().stateReducer(
            { inputValue: 'Test' },
            { type: Downshift.stateChangeTypes.itemMouseEnter, a: 'test', b: 'testing' }
        );
        expect(result).toEqual({
            type: Downshift.stateChangeTypes.itemMouseEnter,
            a: 'test',
            b: 'testing'
        });
    });

    it('should test stateReducer function correctly when free text input is not allowed on blurInput/clickItem/keyDownEnter/mouseUp event', () => {
        const wrapper = setup({ required: true });
        const result = wrapper.instance().stateReducer(
            { inputValue: 'Test' },
            { type: Downshift.stateChangeTypes.blurInput, a: 'test', b: 'testing' }
        );
        expect(result).toEqual({
            inputValue: '',
            type: Downshift.stateChangeTypes.blurInput,
            a: 'test',
            b: 'testing'
        });

        const result1 = wrapper.instance().stateReducer(
            { inputValue: 'Test' },
            { type: Downshift.stateChangeTypes.clickItem, a: 'test', b: 'testing' }
        );
        expect(result1).toEqual({
            inputValue: '',
            type: Downshift.stateChangeTypes.clickItem,
            a: 'test',
            b: 'testing'
        });

        const result2 = wrapper.instance().stateReducer(
            { inputValue: 'Test' },
            { type: Downshift.stateChangeTypes.keyDownEnter, a: 'test', b: 'testing' }
        );
        expect(result2).toEqual({
            inputValue: '',
            type: Downshift.stateChangeTypes.keyDownEnter,
            a: 'test',
            b: 'testing'
        });

        const result3 = wrapper.instance().stateReducer(
            { inputValue: 'Test' },
            { type: Downshift.stateChangeTypes.mouseUp, a: 'test', b: 'testing' }
        );
        expect(result3).toEqual({
            inputValue: '',
            type: Downshift.stateChangeTypes.mouseUp,
            a: 'test',
            b: 'testing'
        });

        const result4 = wrapper.instance().stateReducer(
            { inputValue: 'Test' },
            { type: Downshift.stateChangeTypes.blurButton, a: 'test', b: 'testing'
        });
        expect(result4).toEqual({
            type: Downshift.stateChangeTypes.blurButton,
            a: 'test',
            b: 'testing'
        });
    });

    it('should render default MenuItemComponent', () => {
        const wrapper = setup({ required: true, allowFreeText: true });
        const menuItemResult = wrapper.instance().renderSuggestion({
            suggestion: { value: 'Testing menu item' },
            index: 0,
            itemProps: {},
            highlightedIndex: 0,
            selectedItem: { value: 'Testing' }
        });
        expect(menuItemResult).toMatchSnapshot();
    });

    it('should call loadSuggestions function', () => {
        const loadSuggestionsFn = jest.fn();
        const wrapper = setup({
            required: true,
            allowFreeText: true,
            async: true,
            loadSuggestions: loadSuggestionsFn,
            category: 'testing'
        });

        wrapper.instance().getSuggestions({ target: { value: 'tes' } });
        expect(loadSuggestionsFn).toHaveBeenCalledWith('testing', 'tes');

        // Should not try to load suggestions if async
        wrapper.setProps({
            async: false
        });
        loadSuggestionsFn.mockClear();
        wrapper.instance().getSuggestions({ target: { value: 'tes' } });
        expect(loadSuggestionsFn).not.toBeCalled();
    });

    it('should call given filter function on itemsList', () => {
        const itemsList = [
            { value: 'test 1', id: 123 },
            { value: 'test 2', id: 456 }
        ];

        const filterFn = jest.fn((searchText, key) => searchText === key);
        const wrapper = setup({
            required: true,
            allowFreeText: true,
            itemsList: itemsList,
            async: true,
            maxResults: 7,
            filter: filterFn
        });
        expect(toJson(wrapper)).toMatchSnapshot();
        const childrenFn = wrapper.find('Downshift').props().children;
        childrenFn({
            getInputProps: () => ({ onChange: wrapper.instance().getSuggestions }),
            isOpen: true,
            getMenuProps: jest.fn(),
            inputValue: 'tes',
            getItemProps: jest.fn()
        });

        expect(filterFn).toHaveBeenCalled();
    });

    it('should call filter function on itemsList', () => {
        const itemsList = [
            { value: 'test 1', id: 123 },
            { value: 'test 2', id: 456 }
        ];
        const wrapper = setup({
            required: true,
            allowFreeText: true,
            itemsList: itemsList,
            async: true,
            maxResults: 7,
            clearInput: true,
            selectedValue: { value: 'test 1', id: 123 },
            error: true,
            errorText: 'This field is required'
        });

        expect(toJson(wrapper)).toMatchSnapshot();
        const ChildComponent = wrapper.find('Downshift');
        expect(toJson(ChildComponent)).toMatchSnapshot();

        const childrenFn = ChildComponent.props().children;

        const childrens1 = childrenFn({
            getInputProps: () => ({ onChange: wrapper.instance().getSuggestions }),
            isOpen: true,
            getMenuProps: jest.fn(),
            inputValue: 'tes',
            getItemProps: jest.fn()
        });

        const FirstRenderedChildren = getElement(childrens1.type, childrens1.props);
        expect(toJson(FirstRenderedChildren)).toMatchSnapshot();
        expect(FirstRenderedChildren.find('WithStyles(MenuItem)').length).toEqual(2);

        const childrens2 = childrenFn({
            getInputProps: jest.fn(),
            isOpen: true,
            getMenuProps: jest.fn(),
            inputValue: '123',
            getItemProps: jest.fn()
        });
        const SecondRenderedChildren = getElement(childrens2.type, childrens2.props);
        expect(toJson(SecondRenderedChildren)).toMatchSnapshot();
        expect(SecondRenderedChildren.find('WithStyles(MenuItem)').length).toEqual(1);

        expect(toJson(SecondRenderedChildren.find('WithStyles(MenuItem)').dive())).toMatchSnapshot();
        expect(toJson(SecondRenderedChildren.find('WithStyles(MenuItem)').dive().find('MenuItemComponent').dive())).toMatchSnapshot();
        expect(toJson(SecondRenderedChildren.find('WithStyles(TextFieldWrapper)').dive().find('TextFieldWrapper').dive().find('TextField').dive())).toMatchSnapshot();

        const childrens3 = childrenFn({
            getInputProps: jest.fn(),
            isOpen: true,
            getMenuProps: jest.fn(),
            inputValue: '123',
            getItemProps: jest.fn(),
            highlightedIndex: 1,
            selectedItem: { value: 'test 1', id: 123 }
        });

        const ThirdRenderedChildren = getElement(childrens3.type, childrens3.props);
        expect(toJson(ThirdRenderedChildren)).toMatchSnapshot();
    });
});
