import * as actions from 'actions/actionTypes';
import adminDashboardSystemAlertsBatchAssignReducer, { initialState } from './adminDashboardSystemAlertsBatchAssign';

describe('admin dashboard system alerts batch assign reducer', () => {
    it('returns the correct state while admin dashboard system alerts batch assign is updating', () => {
        const test = adminDashboardSystemAlertsBatchAssignReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_UPDATING,
        });
        expect(test.adminDashboardSystemAlertsBatchAssignUpdating).toEqual(true);
    });

    it('returns the correct state when admin dashboard system alerts batch assign succeeds', () => {
        const test = adminDashboardSystemAlertsBatchAssignReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_SUCCESS,
            payload: { data: { updated: 2, not_found: 0 } },
        });

        expect(test.adminDashboardSystemAlertsBatchAssignUpdating).toEqual(false);
        expect(test.adminDashboardSystemAlertsBatchAssignSuccess).toEqual(true);
    });

    it('returns the correct state when admin dashboard system alerts batch assign failed', () => {
        const test = adminDashboardSystemAlertsBatchAssignReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_FAILED,
            payload: { status: 500, message: 'Test error' },
        });
        expect(test.adminDashboardSystemAlertsBatchAssignUpdating).toEqual(false);
        expect(test.adminDashboardSystemAlertsBatchAssignSuccess).toEqual(false);
        expect(test.adminDashboardSystemAlertsBatchAssignFailed).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardSystemAlertsBatchAssignReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_CLEAR,
        });
        expect(test).toEqual(initialState);
    });
});
