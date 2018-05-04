jest.dontMock('./Alert');

import {mount} from 'enzyme';
import React from 'react';
import Alert from './Alert';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

function setup({title, message, type, allowDismiss, dismissAction, action, actionButtonLabel, showLoader}){
    const props = {
        title: title || 'Title',
        message: message || 'Message',
        type: type || 'warning',
        allowDismiss: allowDismiss || true,
        dismissAction: dismissAction || jest.fn(),
        action: action || jest.fn(),
        actionButtonLabel: actionButtonLabel || 'button',
        showLoader: showLoader || false
    };
    return mount(<Alert {...props} />, {
        context: {
            muiTheme: getMuiTheme()
        },
        childContextTypes: {
            muiTheme: PropTypes.object.isRequired
        }
    });
}

beforeAll(() => {

});

describe('Alert component functionality test ', () => {
    it('fires the action when clicking on the message text', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        wrapper.find('div.alertText').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('does not fire any action when clicking on the message text with no action assigned', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: null, actionButtonLabel: null});
        wrapper.find('div.alertText').simulate('click');
        expect(alertFunc).not.toHaveBeenCalled();
    });

    it('fires the action when clicking on the iconButton', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        wrapper.find('div.alertIcon').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('does not fire the action when clicking on the iconButton with no action assigned', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: null, actionButtonLabel: null});
        wrapper.find('div.alertIcon').simulate('click');
        expect(alertFunc).not.toHaveBeenCalled();
    });

    it('fires the action when clicking on the action button', () => {
        const alertFunc = jest.fn();
        const wrapper = setup({action: alertFunc, actionButtonLabel: 'button'});
        expect(wrapper.find('button.alertAction').exists()).toBeTruthy();
        expect(wrapper.find('button.alertAction')).toHaveLength(1);
        wrapper.find('button.alertAction').simulate('click');
        expect(alertFunc).toHaveBeenCalled();
    });

    it('fires the dismissAction when clicking on the dismiss button', () => {
        const dismissFunc = jest.fn();
        const wrapper = setup({dismissAction: dismissFunc, allowDismiss: true});
        expect(wrapper.find('button.alertDismissButton').exists()).toBeTruthy();
        expect(wrapper.find('button.alertDismissButton')).toHaveLength(2);
        wrapper.find('button.alertDismissButton').at(0).simulate('click');
        expect(dismissFunc).toHaveBeenCalled();
    });

});
