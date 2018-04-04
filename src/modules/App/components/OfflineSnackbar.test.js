jest.dontMock('../components/OfflineSnackbar');

import OfflineSnackbar from './OfflineSnackbar';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps,
    };
    return getElement(OfflineSnackbar, props, isShallow);
}

describe('Component OfflineSnackbar', () => {

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

    it('renders hidden (open: false) snackbar', () => {
        const wrapper = setup({locale});
        wrapper.instance().setState({open: false, online: true, hasDisconnected: false});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders offline snackbar', () => {
        const wrapper = setup({locale});
        wrapper.instance().setState({open: true, online: false, hasDisconnected: false});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders back online snackbar', () => {
        const wrapper = setup({locale});
        wrapper.instance().setState({open: true, online: true, hasDisconnected: true});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('updateOnlineState returns expected state', () => {
        const wrapper = setup({locale});
        wrapper.instance().updateOnlineState(true, true);
        expect(wrapper.instance().state).toEqual({"hasDisconnected": true, "online": true, "open": true});
        wrapper.instance().updateOnlineState(false, true);
        expect(wrapper.instance().state).toEqual({"hasDisconnected": true, "online": false, "open": true});
        wrapper.instance().updateOnlineState(false, false);
        expect(wrapper.instance().state).toEqual({"hasDisconnected": false, "online": false, "open": true});

    });

    it('handleRequestClose returns expected state', () => {
        const wrapper = setup({locale});
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
        const wrapper = setup({locale});
        expect(wrapper.instance().renderMessage('message', 'icon')).toMatchSnapshot();

    });

});

