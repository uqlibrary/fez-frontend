import React from 'react';
import { OfflineSnackbar } from './OfflineSnackbar';
import { act, rtlRender } from 'test-utils';
import { waitForElementToBeRemoved } from '@testing-library/react';

function setup() {
    return rtlRender(<OfflineSnackbar />);
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
        const { container, getByRole } = setup();
        act(() => {
            document.dispatchEvent(goOnline);
        });
        expect(container).toMatchSnapshot();

        // ensure the alert hides after a timeout
        await waitForElementToBeRemoved(getByRole('presentation'), { timeout: 6000 });
        expect(container).toMatchSnapshot();
    });

    it('should unmount component', () => {
        const removeEventListenerFn = jest.spyOn(window, 'removeEventListener');
        const { unmount } = setup();
        unmount();
        expect(removeEventListenerFn).toHaveBeenCalled();
    });
});
