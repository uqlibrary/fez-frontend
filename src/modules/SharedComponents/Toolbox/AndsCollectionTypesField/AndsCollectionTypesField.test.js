import AndsCollectionTypesField from './AndsCollectionTypesField';

function setup(testProps = {}) {
    const props = {
        label: 'Collection type',
        input: {
            value: 453615,
            onChange: jest.fn(),
        },
        errorText: '',
        error: false,
        ...testProps,
    };

    return getElement(AndsCollectionTypesField, props);
}

describe('AndsCollectionTypesField component', () => {
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
