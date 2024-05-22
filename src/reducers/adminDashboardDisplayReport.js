import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardDisplayReportData: null,
    adminDashboardDisplayReportLoading: false,
    adminDashboardDisplayReportSuccess: null,
    adminDashboardDisplayReportError: null,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_DISPLAY_REPORT_LOADING]: () => ({
        ...initialState,
        adminDashboardDisplayReportLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_DISPLAY_REPORT_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardDisplayReportLoading: false,
        adminDashboardDisplayReportSuccess: true,
        adminDashboardDisplayReportData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_DISPLAY_REPORT_FAILED]: (_, action) => ({
        ...initialState,
        adminDashboardDisplayReportLoading: false,
        adminDashboardDisplayReportError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_DISPLAY_REPORT_CLEAR]: () => ({ ...initialState }),
};

export default function adminDashboardDisplayReportReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
