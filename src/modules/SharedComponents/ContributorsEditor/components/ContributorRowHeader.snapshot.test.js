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

    it('should call shouldComponentUpdate when something changes', () => {
        const testFunction = jest.fn();
        const wrapper = setup({showContributorAssignment: false});
        wrapper.setProps({showContributorAssignment: true});
        wrapper.instance().shouldComponentUpdate = testFunction;
        expect(testFunction).toHaveBeenCalled;
    });

    it('applies correct classname to righthand spacer when infinite scroller is used', () => {
        const wrapper = setup({isInfinite: true});
        expect(wrapper.find('.scrollbar-spacer-infinite').length).toEqual(1);
        expect(wrapper.find('.scrollbar-spacer').length).toEqual(0);
        wrapper.setProps({isInfinite: false});
        expect(wrapper.find('.scrollbar-spacer-infinite').length).toEqual(0);
        expect(wrapper.find('.scrollbar-spacer').length).toEqual(1);
    });

    it('triggers the confirmation box', () => {
        const testFunction = jest.fn();
        const wrapper = setup({});
        wrapper.instance().confirmationBox = {showConfirmation: testFunction};
        wrapper.instance()._showConfirmation();
        expect(testFunction).toHaveBeenCalled;
    });


});
