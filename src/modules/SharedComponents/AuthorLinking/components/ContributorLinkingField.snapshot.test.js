import ContributorLinkingField from './ContributorLinkingField';

function setup(testProps, isShallow = true) {
    const props = {
        input: {
            onChange: () => {},
        },
        ...testProps,
    };
    return getElement(ContributorLinkingField, props, isShallow);
}

describe('Component ContributorLinkingField', () => {
    it('should render as expected', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
