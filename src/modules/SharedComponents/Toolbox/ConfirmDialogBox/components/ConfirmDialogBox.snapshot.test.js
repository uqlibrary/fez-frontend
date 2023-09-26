import { ConfirmDialogBox } from './ConfirmDialogBox';

const getProps = (testProps = {}) => ({
    classes: {},
    hideCancelButton: false,
    locale: {
        alternateActionButtonLabel: 'Maybe',
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
    },
    onAction: jest.fn(),
    onCancelAction: jest.fn(),
    onAlternateAction: jest.fn(),
    onRef: jest.fn(),
    showAlternateActionButton: false,
    ...testProps,
});

function setup(testProps = {}) {
    return getElement(ConfirmDialogBox, getProps(testProps));
}

describe('ConfirmDialogBox snapshots tests', () => {
    it('renders component with yes/no buttons', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders component with yes', () => {
        const wrapper = setup({ hideCancelButton: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders component with yes/no/maybe buttons', () => {
        const wrapper = setup({ showAlternateActionButton: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders component with customised locale', () => {
        const wrapper = setup({
            locale: {
                alternateActionButtonLabel: 'ENG: Maybe',
                cancelButtonLabel: 'ENG: No',
                confirmationTitle: 'ENG: Confirmation',
                confirmationMessage: 'ENG: Are you sure?',
                confirmButtonLabel: 'ENG: Yes',
            },
            showAlternateActionButton: true,
        });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call componentWillUnmount and set ref to null', () => {
        const wrapper = setup();
        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.unmount();
        expect(componentWillUnmount).toHaveBeenCalled();
    });

    it('should show and hide confirmation dialog', () => {
        const wrapper = setup();
        wrapper.instance().showConfirmation();
        expect(wrapper.state().isDialogOpen).toBeTruthy();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._hideConfirmation();
        expect(wrapper.state().isDialogOpen).toBeFalsy();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('the ok-equivalent button should work', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onAction: testFn,
        });
        wrapper
            .find('ForwardRef(Button)')
            .get(0)
            .props.onClick();

        expect(wrapper.state().isDialogOpen).toBeFalsy();
        expect(testFn).toHaveBeenCalled();
    });

    it('the cancel-equivalent button should work', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            onCancelAction: testFn,
        });

        wrapper
            .find('ForwardRef(Button)')
            .get(1)
            .props.onClick();

        expect(wrapper.state().isDialogOpen).toBeFalsy();
        expect(testFn).toHaveBeenCalled();
    });

    it('the alternate action button should work', () => {
        const testFn = jest.fn();
        const wrapper = setup({
            showAlternateActionButton: true,
            onAlternateAction: testFn,
        });

        wrapper
            .find('ForwardRef(Button)')
            .get(1)
            .props.onClick();

        expect(wrapper.state().isDialogOpen).toBeFalsy();
        expect(testFn).toHaveBeenCalled();
    });
});
