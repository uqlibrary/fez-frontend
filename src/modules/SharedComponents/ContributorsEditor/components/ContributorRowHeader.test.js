import { ContributorRowHeader, styles } from './ContributorRowHeader';

function setup(testProps = {}) {
    const props = {
        onDeleteAll: jest.fn(),
        showIdentifierLookup: false,
        showRoleInput: false,
        showContributorAssignment: false,
        disabled: false,
        classes: {
            right: 'right',
            header: 'header',
            text: 'text',
            paddingRight24: 'paddingRight24',
            paddingRight36: 'paddingRight36',
            paddingRight14: 'paddingRight14',
        },
        ...testProps,
    };
    return getElement(ContributorRowHeader, props);
}

describe('Component ContributorRowHeader', () => {
    it('header for contributor editor control with name and delete all button only', () => {
        const wrapper = setup();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with all options', () => {
        const wrapper = setup({ showIdentifierLookup: true, showContributorAssignment: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for creator role', () => {
        const wrapper = setup({ showRoleInput: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('header for contributor editor control with delete all disabled', () => {
        const wrapper = setup({ disabled: true });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call shouldComponentUpdate when something changes', () => {
        const testFunction = jest.fn();
        const wrapper = setup({ showContributorAssignment: false });
        wrapper.setProps({ showContributorAssignment: true });
        wrapper.instance().shouldComponentUpdate = testFunction;
        expect(testFunction).toHaveBeenCalled;
    });

    it('triggers the confirmation box', () => {
        const testFunction = jest.fn();
        const wrapper = setup();
        wrapper.instance().confirmationBox = { showConfirmation: testFunction };
        wrapper.instance()._showConfirmation();
        expect(testFunction).toHaveBeenCalled;
    });

    it('set confirmation box ref', () => {
        const wrapper = setup();
        wrapper
            .find('WithStyles(ConfirmDialogBox)')
            .props()
            .onRef('testRef');
        expect(wrapper.instance().confirmationBox).toBe('testRef');
    });

    it('should display infinite class', () => {
        const wrapper = setup({
            isInfinite: true,
            classes: {
                paddingRight36: 'test-class-1',
                paddingRight14: 'test-class-2',
            },
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should have a proper style generator', () => {
        expect(styles()).toMatchSnapshot();
    });
});
