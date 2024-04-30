import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardSystemAlertsData: null,
    adminDashboardSystemAlertsLoading: false,
    adminDashboardSystemAlertsSuccess: null,
    adminDashboardSystemAlertsError: null,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_LOADING]: () => ({
        ...initialState,
        adminDashboardSystemAlertsLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardSystemAlertsLoading: false,
        adminDashboardSystemAlertsSuccess: true,
        adminDashboardSystemAlertsData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_FAILED]: (_, action) => ({
        ...initialState,
        adminDashboardSystemAlertsLoading: false,
        adminDashboardSystemAlertsError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_CLEAR]: () => ({ ...initialState }),
};

export default function adminDashboardSystemAlertsReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
