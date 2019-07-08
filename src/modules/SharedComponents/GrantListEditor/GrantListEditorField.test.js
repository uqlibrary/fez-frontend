import GrantListEditorField from './GrantListEditorField';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };

    return getElement(GrantListEditorField, props, isShallow);
}

describe('GrantListEditorField', () => {
    it('should render default component', () => {
        const wrapper = setup({ input: { onChange: jest.fn() } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
