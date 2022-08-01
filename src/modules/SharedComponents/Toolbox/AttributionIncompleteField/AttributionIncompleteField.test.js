import AttributionIncompleteField from './AttributionIncompleteField';

function setup(testProps) {
    const props = {
        input: {
            onChange: jest.fn(),
            value: true,
        },
        ...testProps,
    };

    return getElement(AttributionIncompleteField, props);
}

describe('Component AttributionIncompleteField', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
