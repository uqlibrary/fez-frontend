jest.dontMock('../components/OfflineSnackbar');

import OfflineSnackbar from './OfflineSnackbar';
import React from 'react';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };
    return getElement(OfflineSnackbar, props, isShallow);
}

const locale = {
    online: {
        message: 'Online',
        autoHideDuration: 5000
    },
    offline: {
        message: 'Offline',
        autoHideDuration: 0
    }
};

describe('Component OfflineSnackbar', () => {

    it('renders hidden (open: false) snackbar', () => {
        const wrapper = setup({});
        wrapper.instance().setState({open: false, online: true, hasDisconnected: false});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders offline snackbar', () => {
        const wrapper = setup({});
        wrapper.instance().setState({open: true, online: false, hasDisconnected: false});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders back online snackbar', () => {
        const wrapper = setup({});
        wrapper.instance().setState({open: true, online: true, hasDisconnected: true});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('handleRequestClose returns expected state', () => {
        const wrapper = setup({});

        wrapper.instance().setState({open: true});
        wrapper.update();
        wrapper.instance().handleRequestClose('timeout');
        expect(wrapper.instance().state.open).toBeFalsy();

        wrapper.instance().setState({open: true});
        wrapper.update();
        wrapper.instance().handleRequestClose('clickaway');
        expect(wrapper.instance().state.open).toBeTruthy();

    });

    it('renderMessage returns expected message', () => {
        const wrapper = setup({});
        expect(wrapper.instance().renderMessage('message', 'icon')).toMatchSnapshot();

    });

    it('updateOnlineState returns expected state when online', () => {
        Object.defineProperty(navigator, "onLine", {value: true, writable: true});
        const wrapper = setup({});
        wrapper.instance().updateOnlineState();
        expect(wrapper.instance().state).toEqual({"hasDisconnected": true, "online": true, "open": true});
    });

    it('updateOnlineState returns expected state when online', () => {
        Object.defineProperty(navigator, "onLine", {value: false, writable: true});
        const wrapper = setup({});
        wrapper.instance().updateOnlineState();
        expect(wrapper.instance().state).toEqual({"hasDisconnected": true, "online": false, "open": true});
    });

    it('updateOnlineState returns expected state when window event offline is fired', () => {
        Object.defineProperty(navigator, "onLine", {value: false, writable: true});
        const goOffline = new window.Event('offline', {bubbles: true});
        const wrapper = setup();
        document.dispatchEvent(goOffline);
        expect(wrapper.state()).toEqual({ open: true, online: false, hasDisconnected: true });
    });

    it('updateOnlineState returns expected state when window event online is fired', () => {
        Object.defineProperty(navigator, "onLine", {value: true, writable: true});
        const goOnline = new window.Event('online', {bubbles: true});
        const wrapper = setup();
        document.dispatchEvent(goOnline);
        expect(wrapper.state()).toEqual({"hasDisconnected": true, "online": true, "open": true});
    });

});
