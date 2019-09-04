import AuthorLinkingField from './AuthorLinkingField';

function setup(testProps = {}) {
    const props = {
        input: {
            onChange: () => {},
        },
        ...testProps,
    };
    return getElement(AuthorLinkingField, props);
}

describe('Component AuthorLinkingField', () => {
    it('should render as expected', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
