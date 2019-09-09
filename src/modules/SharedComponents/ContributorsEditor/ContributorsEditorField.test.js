import ContributorsEditorField from './ContributorsEditorField';

function setup(testProps = {}) {
    const props = {
        ...testProps,
    };

    return getElement(ContributorsEditorField, props);
}

describe('ContributorsEditorField', () => {
    it('should render default component', () => {
        const wrapper = setup({ input: { onChange: jest.fn() } });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
