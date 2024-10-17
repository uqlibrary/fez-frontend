import * as actions from 'actions/actionTypes';
import adminDashboardTodayReducer, { initialState } from './adminDashboardToday';

describe('admin dashboard today reducer', () => {
    it('returns the correct state while admin dashboard today is loading', () => {
        const test = adminDashboardTodayReducer(initialState, { type: actions.ADMIN_DASHBOARD_TODAY_LOADING });
        expect(test.adminDashboardTodayLoading).toEqual(true);
    });

    it('returns the correct state when admin dashboard today is loaded', () => {
        const test = adminDashboardTodayReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_TODAY_SUCCESS,
            payload: {
                data: [{ id: 1 }],
            },
        });

        expect(test.adminDashboardTodayLoading).toEqual(false);
        expect(test.adminDashboardTodaySuccess).toEqual(true);
        expect(test.adminDashboardTodayData).toEqual([{ id: 1 }]);
        expect(test.adminDashboardTodayError).toEqual(null);
    });

    it('returns the correct state when admin dashboard today fails to load data', () => {
        const test = adminDashboardTodayReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_TODAY_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.adminDashboardTodayLoading).toEqual(false);
        expect(test.adminDashboardTodaySuccess).toEqual(null);
        expect(test.adminDashboardTodayData).toEqual(null);
        expect(test.adminDashboardTodayError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardTodayReducer(initialState, { type: actions.ADMIN_DASHBOARD_TODAY_CLEAR });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardTodayReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
