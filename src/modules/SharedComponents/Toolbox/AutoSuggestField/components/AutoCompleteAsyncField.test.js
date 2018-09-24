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
        const wrapper = setup({loadSuggestions: testFunction}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(testFunction).toBeCalled();
    });
});
