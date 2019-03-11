import {Alert} from './Alert';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        theme: {},
        title: testProps.title || 'Title',
        message: testProps.message || 'Message',
        type: testProps.type || 'warning',
        allowDismiss: testProps.allowDismiss || true,
        dismissAction: testProps.dismissAction || jest.fn(),
        action: testProps.action || jest.fn(),
        actionButtonLabel: testProps.actionButtonLabel || 'button',
        showLoader: testProps.showLoader || false,
        ...testProps,
    };
    return getElement(Alert, props, isShallow);
}

describe('Alert component functionality test ', () => {

    it('matches snapshot', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('fires the action when clicking on the message text', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        wrapper.find('WithStyles(Button)').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('does not fire any action when clicking on the message text with no action assigned', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: null, actionButtonLabel: null});
        wrapper.find('#text').simulate('click');
        expect(alertFunc).not.toHaveBeenCalled();
    });

    it('fires the action when clicking on the iconButton', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        wrapper.find('#icon').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('does not fire the action when clicking on the iconButton with no action assigned', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: null, actionButtonLabel: null});
        wrapper.find('#icon').simulate('click');
        expect(alertFunc).not.toHaveBeenCalled();
    });

    it('fires the action when clicking on the action button', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        expect(wrapper.find('#alertButton').exists()).toBeTruthy();
        expect(wrapper.find('#alertButton')).toHaveLength(1);
        wrapper.find('#alertButton').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('fires the dismissAction when clicking on the dismiss button', () => {
        const dismissFunc = jest.fn();
        const wrapper = setup({dismissAction: dismissFunc, allowDismiss: true});
        expect(wrapper.find('#dismiss').exists()).toBeTruthy();
        expect(wrapper.find('#dismiss')).toHaveLength(2);
        wrapper.find('#dismiss').at(0).simulate('click');
        expect(dismissFunc).toHaveBeenCalled();
    });

    it('should render correct icon based on type "error_outline"', () => {
        const wrapper = setup({
            type: 'error_outline'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render correct icon based on type "info"', () => {
        const wrapper = setup({
            type: 'info'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render correct icon based on type "info_outline"', () => {
        const wrapper = setup({
            type: 'info_outline'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render correct icon based on type "help"', () => {
        const wrapper = setup({
            type: 'help'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render correct icon based on type "help_outline"', () => {
        const wrapper = setup({
            type: 'help_outline'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should render correct icon based on type "done"', () => {
        const wrapper = setup({
            type: 'done'
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correct icon for default', () => {
        const wrapper = setup({type: null});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
