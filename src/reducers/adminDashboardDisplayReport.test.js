import * as actions from 'actions/actionTypes';
import adminDashboardDisplayReportReducer, { initialState } from './adminDashboardDisplayReport';

describe('admin dashboard display report reducer', () => {
    it('returns the correct state while admin dashboard display report is loading', () => {
        const test = adminDashboardDisplayReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_LOADING,
            value: 1,
        });
        expect(test.adminDashboardDisplayReportLoading).toEqual(true);
        expect(test.adminDashboardDisplayReportDataType).toEqual(1);
    });

    it('returns the correct state when admin dashboard display report is loaded', () => {
        const test = adminDashboardDisplayReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_SUCCESS,
            payload: {
                data: [{ id: 1 }],
            },
        });

        expect(test.adminDashboardDisplayReportLoading).toEqual(false);
        expect(test.adminDashboardDisplayReportSuccess).toEqual(true);
        expect(test.adminDashboardDisplayReportData).toEqual([{ id: 1 }]);
        expect(test.adminDashboardDisplayReportFailed).toEqual(null);
    });

    it('returns the correct state when admin dashboard display report fails to load data', () => {
        const test = adminDashboardDisplayReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.adminDashboardDisplayReportLoading).toEqual(false);
        expect(test.adminDashboardDisplayReportSuccess).toEqual(null);
        expect(test.adminDashboardDisplayReportData).toEqual(null);
        expect(test.adminDashboardDisplayReportFailed).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardDisplayReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_DISPLAY_REPORT_CLEAR,
        });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardDisplayReportReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
