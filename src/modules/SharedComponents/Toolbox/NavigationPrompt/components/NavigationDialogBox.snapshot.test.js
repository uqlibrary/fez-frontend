import NavigationDialogBox from './NavigationDialogBox';

function setup(testProps, isShallow = true) {
    const props = { ...testProps };
    return getElement(NavigationDialogBox, props, isShallow);
}

describe('NavigationDialogBox component', () => {
    it('should render', () => {
        const wrapper = setup({
            when: true,
            txt: {
                confirmationTitle: 'Confirmation',
                confirmationMessage: 'Are you sure?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes',
            },
        }, false);
        const smallWrapper = wrapper.find('NavigationDialogBox');
        expect(toJson(smallWrapper)).toMatchSnapshot();
    });

    it('should not render', () => {
        const wrapper = setup({ when: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
