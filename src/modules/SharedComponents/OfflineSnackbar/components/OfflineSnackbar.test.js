import React from 'react';
import { OfflineSnackbar, styles } from './OfflineSnackbar';
import { act, rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        classes: {},
        ...testProps,
    };
    return rtlRender(<OfflineSnackbar {...props} />);
}

describe('Component OfflineSnackbar', () => {
    const online = navigator.onLine;
    afterEach(() => {
        navigator.onLine = online;
    });
    it('renders hidden (open: false) snackbar', () => {
        Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
        const goOnline = new window.Event('online', { bubbles: true });
        document.dispatchEvent(goOnline);
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders offline snackbar', () => {
        Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
        const goOffline = new window.Event('offline', { bubbles: true });
        document.dispatchEvent(goOffline);
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('renders back online snackbar', async () => {
        Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
        const goOnline = new window.Event('online', { bubbles: true });
        jest.useFakeTimers();
        const { container } = setup();
        act(() => {
            document.dispatchEvent(goOnline);
            // trigger handleRequestClose
            jest.advanceTimersByTime(5001);
        });

        expect(container).toMatchSnapshot();
    });

    it('should unmount component', () => {
        const removeEventListenerFn = jest.spyOn(window, 'removeEventListener');
        const { unmount } = setup();
        unmount();
        expect(removeEventListenerFn).toHaveBeenCalled();
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
