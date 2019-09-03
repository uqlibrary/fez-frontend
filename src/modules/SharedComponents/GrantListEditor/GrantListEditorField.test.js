import GrantListEditorField from './GrantListEditorField';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return getElement(GrantListEditorField, props);
}

describe('GrantListEditorField', () => {
    it('should render default component', () => {
        const wrapper = setup({ input: { onChange: jest.fn() } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
