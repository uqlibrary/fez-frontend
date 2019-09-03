import AccessSelectorField from './AccessSelectorField';

function setup(testProps = {}) {
    const props = {
        label: 'Access selector field',
        input: {
            value: 8,
            onChange: jest.fn(),
        },
        errorText: '',
        error: false,
        ...testProps,
    };

    return getElement(AccessSelectorField, props);
}

describe('AccessSelectorField component', () => {
    it('should render default view', () => {
        const wrapper = setup();

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error and error message', () => {
        const wrapper = setup({
            meta: {
                error: 'This field is required',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
