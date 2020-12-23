import ContributorLinkingField from './ContributorLinkingField';

function setup(testProps = {}) {
    const props = {
        input: {
            onChange: () => {},
        },
        ...testProps,
    };
    return getElement(ContributorLinkingField, props);
}

describe('Component ContributorLinkingField', () => {
    it('should render as expected', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
