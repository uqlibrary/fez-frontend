import ConfirmDialogBox from './ConfirmDialogBox';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
        locale: testProps.locale || {
            confirmationTitle: 'Confirmation',
            confirmationMessage: 'Are you sure?',
            cancelButtonLabel: 'No',
            confirmButtonLabel: 'Yes'
        },
        onAction: testProps.action || jest.fn(),
        onCancelAction: testProps.cancelAction || jest.fn(),
        hideCancelButton: testProps.hideCancelButton || false,
        onRef: jest.fn()
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
        const wrapper = setup({hideCancelButton: true});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
    it('renders component with customised locale', () => {
        const wrapper = setup({locale: {
            confirmationTitle: 'ENG: Confirmation',
            confirmationMessage: 'ENG: Are you sure?',
            cancelButtonLabel: 'ENG: No',
            confirmButtonLabel: 'ENG: Yes'
        }});
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });
});
