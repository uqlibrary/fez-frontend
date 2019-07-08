import ConfirmDialogBox from './ConfirmDialogBox';
import { exportEspacePublications } from 'actions';

function setup(testProps, isShallow = true) {
    const props = {
        locale: {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes',
        },
        onAction: jest.fn(),
        onCancelAction: jest.fn(),
        hideCancelButton: false,
        onRef: jest.fn(),
        ...testProps,
    };
    return getElement(ConfirmDialogBox, props, isShallow);
}

describe('ConfirmDialogBox snapshots tests', () => {
    it('renders component with yes/no buttons', () => {
        const wrapper = setup({});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('renders component with yes', () => {
        const wrapper = setup({ hideCancelButton: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
    it('renders component with customised locale', () => {
        const wrapper = setup({ locale: {
            confirmationTitle: 'ENG: Confirmation',
            confirmationMessage: 'ENG: Are you sure?',
            cancelButtonLabel: 'ENG: No',
            confirmButtonLabel: 'ENG: Yes',
        } });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should call componentWillUnmount and set ref to null', () => {
        const onRefFn = jest.fn();
        const wrapper = setup({
            onRef: onRefFn,
        });
        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.unmount();
        expect(componentWillUnmount).toHaveBeenCalled();
        expect(onRefFn).toHaveBeenCalled();
    });

    it('should show and hide confirmation dialog', () => {
        const wrapper = setup({});
        wrapper.instance().showConfirmation();
        expect(wrapper.state().isDialogOpen).toBeTruthy();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance()._hideConfirmation();
        expect(wrapper.state().isDialogOpen).toBeFalsy();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call callback function on confirming positive on dialog', () => {
        const onActionFn = jest.fn();
        const wrapper = setup({
            onAction: onActionFn,
        });
        wrapper.find('WithStyles(Button)').get(0).props.onClick();

        expect(wrapper.state().isDialogOpen).toBeFalsy();
        expect(onActionFn).toHaveBeenCalled();
    });

    it('should call callback function on confirming negative on dialog', () => {
        const onCancelActionFn = jest.fn();
        const wrapper = setup({
            onCancelAction: onCancelActionFn,
        });
        wrapper.find('WithStyles(Button)').get(1).props.onClick();

        expect(wrapper.state().isDialogOpen).toBeFalsy();
        expect(onCancelActionFn).toHaveBeenCalled();
    });
});
