import { renderHook, act } from 'test-utils';

import { useSystemAlertDrawer, useAlertStatus } from './hooks';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

describe('hooks', () => {
    describe('useSystemAlertDrawer', () => {
        it('returns default state', () => {
            const { result } = renderHook(useSystemAlertDrawer);

            expect(result.current.open).toBe(false);
            expect(result.current.row).toEqual({});
            expect(typeof result.current.openDrawer).toEqual('function');
            expect(typeof result.current.closeDrawer).toEqual('function');
        });
        it('handles open/close state', () => {
            const { result } = renderHook(useSystemAlertDrawer);
            act(() => {
                result.current.openDrawer({ id: '123' });
            });
            expect(result.current.open).toBe(true);
            expect(result.current.row).toEqual({ id: '123' });

            act(() => {
                result.current.closeDrawer();
            });
            expect(result.current.open).toBe(false);
            expect(result.current.row).toEqual({});
        });
        it('handled row data updating when drawer is open', () => {
            const init = { id: '123', value: 1 };
            const { result, rerender } = renderHook(useSystemAlertDrawer, { initialProps: init });
            expect(result.current.row).toEqual({});
            act(() => {
                result.current.openDrawer(init);
            });
            expect(result.current.open).toBe(true);
            expect(result.current.row).toEqual(init);
            rerender([{ ...init, value: 100 }]);
            expect(result.current.row).toEqual({ id: '123', value: 100 });
        });
    });

    describe('useAlertStatus', () => {
        // afterEach(() => {
        //     jest.clearAllMocks();
        // });

        it('returns closed state', () => {
            const { result } = renderHook(() => useAlertStatus({ hideAction: jest.fn() }));

            const [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(false);
        });

        it('returns open state', () => {
            const hideFn = jest.fn();

            const { result } = renderHook(() => useAlertStatus({ message: 'test message', hideAction: hideFn }));

            const [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(true);
        });

        it('moves from closed to open state', () => {
            let message = null;
            const hideAction = jest.fn();
            const { result, rerender } = renderHook(() => useAlertStatus({ message, hideAction }));

            let [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(false);

            message = 'test';
            rerender();
            [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(true);
        });

        it('manually moves from closed to open state', () => {
            const hideAction = jest.fn();
            const { result, rerender } = renderHook(() => useAlertStatus({ hideAction }));

            const [alertIsVisible, , showAlert] = result.current;

            expect(alertIsVisible).toBe(false);

            showAlert('Test message');
            rerender();
            const [updatedAlertIsVisible, , , message] = result.current;
            expect(updatedAlertIsVisible).toBe(true);
            expect(message).toBe('Test message');
        });

        it('moves from open to closed state', () => {
            let message = 'test';
            const hideAction = jest.fn();
            const { result, rerender } = renderHook(() => useAlertStatus({ message, hideAction }));

            // eslint-disable-next-line prefer-const
            let [alertIsVisible, hideAlert] = result.current;
            expect(alertIsVisible).toBe(true);

            message = null;
            act(() => {
                hideAlert();
            });

            rerender();
            [alertIsVisible] = result.current;
            expect(alertIsVisible).toBe(false);
        });
    });
});
