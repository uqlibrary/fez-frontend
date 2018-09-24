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
        expect(wrapper).toMatchSnapshot();
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
        wrapper.find('WithStyles(Grid)#text').simulate('click');
        expect(alertFunc).not.toHaveBeenCalled();
    });

    it('fires the action when clicking on the iconButton', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        wrapper.find('WithStyles(Grid)#icon').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('does not fire the action when clicking on the iconButton with no action assigned', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: null, actionButtonLabel: null});
        wrapper.find('WithStyles(Grid)#icon').simulate('click');
        expect(alertFunc).not.toHaveBeenCalled();
    });

    it('fires the action when clicking on the action button', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        expect(wrapper.find('WithStyles(Button)#alertButton').exists()).toBeTruthy();
        expect(wrapper.find('WithStyles(Button)#alertButton')).toHaveLength(1);
        wrapper.find('WithStyles(Button)#alertButton').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('fires the dismissAction when clicking on the dismiss button', () => {
        const dismissFunc = jest.fn();
        const wrapper = setup({dismissAction: dismissFunc, allowDismiss: true});
        expect(wrapper.find('IconButton#dismiss').exists()).toBeTruthy();
        expect(wrapper.find('IconButton#dismiss')).toHaveLength(2);
        wrapper.find('IconButton#dismiss').at(0).simulate('click');
        expect(dismissFunc).toHaveBeenCalled();
    });

});
