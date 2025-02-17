import * as actions from 'actions/actionTypes';

const initialSystemAlertUpdateState = {
    adminDashboardSystemAlertsUpdating: false,
    adminDashboardSystemAlertsUpdateSuccess: null,
    adminDashboardSystemAlertsUpdateFailed: null,
};

export const initialState = {
    adminDashboardSystemAlertsData: null,
    adminDashboardSystemAlertsLoading: false,
    adminDashboardSystemAlertsSuccess: null,
    adminDashboardSystemAlertsFailed: null,
    ...initialSystemAlertUpdateState,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING]: state => ({
        ...state,
        adminDashboardSystemAlertsLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardSystemAlertsLoading: false,
        adminDashboardSystemAlertsSuccess: true,
        adminDashboardSystemAlertsData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_FAILED]: (state, action) => ({
        ...initialState,
        ...state,
        adminDashboardSystemAlertsLoading: false,
        adminDashboardSystemAlertsFailed: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATING]: state => ({
        ...state,
        adminDashboardSystemAlertsUpdating: true,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_SUCCESS]: state => ({
        ...state,
        adminDashboardSystemAlertsUpdating: false,
        adminDashboardSystemAlertsUpdateSuccess: true,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERT_UPDATE_FAILED]: (state, action) => ({
        ...state,
        adminDashboardSystemAlertsUpdating: false,
        adminDashboardSystemAlertsUpdateFailed: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_CLEAR]: () => ({ ...initialState }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_UPDATE_CLEAR]: state => ({ ...state, ...initialSystemAlertUpdateState }),
};

export default function adminDashboardSystemAlertsReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
