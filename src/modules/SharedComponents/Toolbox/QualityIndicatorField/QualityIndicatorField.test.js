import QualityIndicatorField from './QualityIndicatorField';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(QualityIndicatorField, props, isShallow);
}

describe('QualityIndicatorField component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            input: {
                value: ['One', 'Two'],
                onChange: jest.fn(),
            },
            meta: {
                error: 'Test error',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
