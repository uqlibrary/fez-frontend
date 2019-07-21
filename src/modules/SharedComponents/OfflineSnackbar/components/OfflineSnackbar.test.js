import { OfflineSnackbar, styles } from './OfflineSnackbar';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
    };
    return getElement(OfflineSnackbar, props);
}

describe('Component OfflineSnackbar', () => {
    it('renders hidden (open: false) snackbar', () => {
        const wrapper = setup();
        wrapper.instance().setState({ open: false, online: true, hasDisconnected: false });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders offline snackbar', () => {
        const wrapper = setup();
        wrapper.instance().setState({ open: true, online: false });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders back online snackbar', () => {
        const wrapper = setup();
        wrapper.instance().setState({ open: true, online: true });
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('handleRequestClose returns expected state', () => {
        const wrapper = setup();

        wrapper.instance().setState({ open: true });
        wrapper.update();
        wrapper.instance().handleRequestClose('timeout');
        expect(wrapper.instance().state.open).toBeFalsy();

        wrapper.instance().setState({ open: true });
        wrapper.update();
        wrapper.instance().handleRequestClose('clickaway');
        expect(wrapper.instance().state.open).toBeTruthy();
    });

    it('renderMessage returns expected message', () => {
        const wrapper = setup();
        expect(wrapper.instance().renderMessage('message', 'icon')).toMatchSnapshot();
    });

    it('updateOnlineState returns expected state when online', () => {
        Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
        const wrapper = setup();
        wrapper.instance().updateOnlineState();
        expect(wrapper.instance().state).toEqual({ online: true, open: true });
    });

    it('updateOnlineState returns expected state when online', () => {
        Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
        const wrapper = setup();
        wrapper.instance().updateOnlineState();
        expect(wrapper.instance().state).toEqual({ online: false, open: true });
    });

    it('updateOnlineState returns expected state when window event offline is fired', () => {
        Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
        const goOffline = new window.Event('offline', { bubbles: true });
        const wrapper = setup();
        document.dispatchEvent(goOffline);
        expect(wrapper.state()).toEqual({ open: true, online: false });
    });

    it('updateOnlineState returns expected state when window event online is fired', () => {
        Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
        const goOnline = new window.Event('online', { bubbles: true });
        const wrapper = setup();
        document.dispatchEvent(goOnline);
        expect(wrapper.state()).toEqual({ online: true, open: true });
    });

    it('should unmount component', () => {
        const wrapper = setup();
        const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
        wrapper.unmount();
        expect(componentWillUnmount).toHaveBeenCalled();
    });

    it('should have a proper style generator', () => {
        const theme = {
            palette: {
                success: {
                    light: 'test1',
                },
                error: {
                    light: 'test2',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette.success;
        delete theme.palette.error;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });
});
