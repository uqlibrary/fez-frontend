import * as actions from 'actions/actionTypes';
import adminDashboardExportReportReducer, { initialState } from './adminDashboardExportReport';

describe('admin dashboard export report reducer', () => {
    it('returns the correct state while admin dashboard export report is loading', () => {
        const test = adminDashboardExportReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_LOADING,
        });
        expect(test.adminDashboardExportReportLoading).toEqual(true);
    });

    it('returns the correct state when admin dashboard export report is loaded', () => {
        const test = adminDashboardExportReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_SUCCESS,
            payload: {
                data: [{ id: 1 }],
            },
        });

        expect(test.adminDashboardExportReportLoading).toEqual(false);
        expect(test.adminDashboardExportReportSuccess).toEqual(true);
        expect(test.adminDashboardExportReportData).toEqual([{ id: 1 }]);
        expect(test.adminDashboardExportReportFailed).toEqual(null);
    });

    it('returns the correct state when admin dashboard export report fails to load data', () => {
        const test = adminDashboardExportReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.adminDashboardExportReportLoading).toEqual(false);
        expect(test.adminDashboardExportReportSuccess).toEqual(null);
        expect(test.adminDashboardExportReportData).toEqual(null);
        expect(test.adminDashboardExportReportFailed).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when CLEAR is supplied', () => {
        const test = adminDashboardExportReportReducer(initialState, {
            type: actions.ADMIN_DASHBOARD_EXPORT_REPORT_CLEAR,
        });
        expect(test).toEqual(initialState);
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = adminDashboardExportReportReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
