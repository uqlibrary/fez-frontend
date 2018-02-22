import ContributorRowHeader from './ContributorRowHeader';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        onDeleteAll: testProps.onDeleteAll || jest.fn(),
        showIdentifierLookup: testProps.showIdentifierLookup || false,
        showContributorAssignment: testProps.showContributorAssignment || false,
        disabled: testProps.disabled || false
    };
    return getElement(ContributorRowHeader, props, isShallow);
}

describe('Component ContributorRowHeader', () => {

    it('header for contributor editor control with name and delete all button only', () => {
        const wrapper = setup({ });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with all options', () => {
        const wrapper = setup({ showIdentifierLookup: true, showContributorAssignment: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
