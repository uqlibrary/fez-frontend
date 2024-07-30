import { renderHook, act } from 'test-utils';

import { useSystemAlertDrawer, useValidateReport, useAlertStatus } from './hooks';

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

    describe('useValidateReport', () => {
        const locale = {
            systemAlertId: 'invalid',
            required: 'is required',
            dateNotAfter: 'invalid',
        };
        const displayReport = 'systemalertlog';

        it('returns default state for unsupported reported types', () => {
            const { result } = renderHook(() => useValidateReport({ locale, displayReport: 'unsupported' }));

            expect(result.current.isValid).toBe(true);
        });

        it('returns default state for supported reported types with no inputs', () => {
            const { result } = renderHook(() => useValidateReport({ locale, displayReport, systemAlertId: '' }));

            expect(result.current.isValid).toBe(true);
        });

        it('return expected validation results', () => {
            let displayReport = '';
            let systemAlertId = '';
            let fromDate = null;
            let toDate = null;

            // no inputs = invalid
            const { result, rerender } = renderHook(() =>
                useValidateReport({ locale, displayReport, systemAlertId, fromDate, toDate }),
            );
            expect(result.current.isValid).toBe(false);
            displayReport = 'systemalertlog';
            systemAlertId = 'abc'; // invalid system id
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.systemAlertError).toEqual(locale.systemAlertId);
            systemAlertId = '-1'; // invalid system id
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.systemAlertError).toEqual(locale.systemAlertId);
            systemAlertId = '1.1'; // invalid system id
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.systemAlertError).toEqual(locale.systemAlertId);

            displayReport = 'workshistory';
            systemAlertId = '123'; // should be ignored
            toDate = null;
            fromDate = null;
            rerender(); // invalid, works history requires dates
            expect(result.current.isValid).toBe(false);
            expect(result.current.fromDateError).toEqual(locale.required);
            expect(result.current.toDateError).toEqual(locale.required);

            displayReport = 'systemalertlog';
            systemAlertId = '123'; // valid
            toDate = '12/12/2024'; // 'to' without 'from'
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.fromDateError).toEqual(locale.required);

            fromDate = '12/12/2025'; // after 'from'
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.fromDateError).toEqual(locale.dateNotAfter);

            toDate = null; // 'from' without 'to'
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.toDateError).toEqual(locale.required);

            toDate = '12/12/2026'; // valid
            rerender();
            expect(result.current.isValid).toBe(true);

            fromDate = 'abc'; // invalid date
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.fromDateError).toEqual(locale.required);

            fromDate = '12/12/2025';
            toDate = 'abc'; // invalid date
            rerender();
            expect(result.current.isValid).toBe(false);
            expect(result.current.toDateError).toEqual(locale.required);
        });
    });

    describe('useValidateReport', () => {
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
