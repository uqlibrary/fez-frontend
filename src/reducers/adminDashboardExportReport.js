import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardExportReportData: null,
    adminDashboardExportReportLoading: false,
    adminDashboardExportReportSuccess: null,
    adminDashboardExportReportError: null,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_EXPORT_REPORT_LOADING]: () => ({
        ...initialState,
        adminDashboardExportReportLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_EXPORT_REPORT_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardExportReportLoading: false,
        adminDashboardExportReportSuccess: true,
        adminDashboardExportReportData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_EXPORT_REPORT_FAILED]: (_, action) => ({
        ...initialState,
        adminDashboardExportReportLoading: false,
        adminDashboardExportReportError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_EXPORT_REPORT_CLEAR]: () => ({ ...initialState }),
};

export default function adminDashboardExportReportReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
