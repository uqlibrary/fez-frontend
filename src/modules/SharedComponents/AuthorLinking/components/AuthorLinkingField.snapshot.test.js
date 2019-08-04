import AuthorLinkingField from './AuthorLinkingField';

function setup(testProps, isShallow = true) {
    const props = {
        input: {
            onChange: () => {},
        },
        ...testProps,
    };
    return getElement(AuthorLinkingField, props, isShallow);
}

describe('Component AuthorLinkingField', () => {
    it('should render as expected', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
