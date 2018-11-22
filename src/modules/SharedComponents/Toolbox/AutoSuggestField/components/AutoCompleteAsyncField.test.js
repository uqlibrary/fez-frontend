import {AutoCompleteAsyncField} from './AutoCompleteAsyncField';

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
        filter: jest.fn(),
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
        const wrapper = setup({disabled: true}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render as required field', () => {
        const wrapper = setup({required: true}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render autosuggest field and call action creator', () => {
        const testFunction = jest.fn();
        const wrapper = setup({loadSuggestions: testFunction, async: false}, false);
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
    })
});
