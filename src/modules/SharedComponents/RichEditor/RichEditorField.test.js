import RichEditorField from './RichEditorField';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return getElement(RichEditorField, props);
}

describe('RichEditorField', () => {
    it('should render default component', () => {
        const wrapper = setup({ input: { onChange: jest.fn() } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
