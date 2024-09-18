import * as actions from 'actions/actionTypes';
import adminDashboardConfigReducer, { initialState } from './adminDashboardConfig';

describe('admin dashboard config reducer', () => {
    it('returns the correct state while admin dashboard config is loading', () => {
        const test = adminDashboardConfigReducer(initialState, { type: actions.ADMIN_DASHBOARD_CONFIG_LOADING });
        expect(test.adminDashboardConfigLoading).toEqual(true);
    });

    it('returns the correct state when admin dashboard config is loaded', () => {
        const test = adminDashboardConfigReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_CONFIG_SUCCESS,
            payload: {
                data: { export_reports: [{ id: 1, sel_bindings: ':one, :two' }] },
            },
        });

        expect(test.adminDashboardConfigLoading).toEqual(false);
        expect(test.adminDashboardConfigSuccess).toEqual(true);
        expect(test.adminDashboardConfigData).toEqual({ export_reports: [{ id: 1, sel_bindings: [':one', ' :two'] }] });
        expect(test.adminDashboardConfigError).toEqual(null);
    });

    it('returns the correct state when admin dashboard config fails to load data', () => {
        const test = adminDashboardConfigReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_CONFIG_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.adminDashboardConfigLoading).toEqual(false);
        expect(test.adminDashboardConfigSuccess).toEqual(null);
        expect(test.adminDashboardConfigData).toEqual(null);
        expect(test.adminDashboardConfigError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardConfigReducer(initialState, { type: actions.ADMIN_DASHBOARD_CONFIG_CLEAR });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardConfigReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
