import * as actions from 'actions/actionTypes';
import adminDashboardSystemAlertsReducer, { initialState } from './adminDashboardSystemAlerts';

describe('admin dashboard system alerts reducer', () => {
    it('returns the correct state while admin dashboard system alerts are loading', () => {
        const test = adminDashboardSystemAlertsReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING,
        });
        expect(test.adminDashboardSystemAlertsLoading).toEqual(true);
    });

    it('returns the correct state when admin dashboard system alerts are loaded', () => {
        const test = adminDashboardSystemAlertsReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_SUCCESS,
            payload: {
                data: [{ id: 1 }],
            },
        });

        expect(test.adminDashboardSystemAlertsLoading).toEqual(false);
        expect(test.adminDashboardSystemAlertsSuccess).toEqual(true);
        expect(test.adminDashboardSystemAlertsData).toEqual([{ id: 1 }]);
        expect(test.adminDashboardSystemAlertsFailed).toEqual(null);
    });

    it('returns the correct state when admin dashboard system alerts fail to load data', () => {
        const test = adminDashboardSystemAlertsReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.adminDashboardSystemAlertsLoading).toEqual(false);
        expect(test.adminDashboardSystemAlertsSuccess).toEqual(null);
        expect(test.adminDashboardSystemAlertsData).toEqual(null);
        expect(test.adminDashboardSystemAlertsFailed).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardSystemAlertsReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_CLEAR,
        });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardSystemAlertsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});

describe('admin dashboard system alert updating reducer', () => {
    it('returns the correct state while admin dashboard system alert updating is loading', () => {
        const test = adminDashboardSystemAlertsReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATING,
        });
        expect(test.adminDashboardSystemAlertsUpdating).toEqual(true);
    });

    it('returns the correct state when admin dashboard system alert updating succeeds', () => {
        const test = adminDashboardSystemAlertsReducer(
            { ...initialState, adminDashboardSystemAlertsData: [{ id: 2 }] },
            {
                type: actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_SUCCESS,
                payload: {
                    data: [{ id: 1 }],
                },
            },
        );

        expect(test.adminDashboardSystemAlertsData).toEqual([{ id: 2 }]); // other state should remain
        expect(test.adminDashboardSystemAlertsUpdating).toEqual(false);
        expect(test.adminDashboardSystemAlertsUpdateSuccess).toEqual(true);
    });

    it('returns the correct state when admin dashboard system alert updating fails to load data', () => {
        const test = adminDashboardSystemAlertsReducer(
            { ...initialState, adminDashboardSystemAlertsData: [{ id: 3 }] },
            {
                type: actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_FAILED,
                payload: {
                    status: 500,
                    message: 'Test error',
                },
            },
        );
        expect(test.adminDashboardSystemAlertsData).toEqual([{ id: 3 }]); // other state should remain
        expect(test.adminDashboardSystemAlertsUpdating).toEqual(false);
        expect(test.adminDashboardSystemAlertsUpdateSuccess).toEqual(null);
        expect(test.adminDashboardSystemAlertsUpdateFailed).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardSystemAlertsReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_UPDATE_CLEAR,
        });
        expect(test).toEqual(initialState);
    });
});
