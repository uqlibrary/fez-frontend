import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardConfigData: null,
    adminDashboardConfigLoading: false,
    adminDashboardConfigSuccess: null,
    adminDashboardConfigError: null,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_CONFIG_LOADING]: () => ({
        ...initialState,
        adminDashboardConfigLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_CONFIG_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardConfigLoading: false,
        adminDashboardConfigSuccess: true,
        adminDashboardConfigData: action.payload?.data,
    }),
    [actions.ADMIN_DASHBOARD_CONFIG_FAILED]: (_, action) => ({
        ...initialState,
        adminDashboardConfigLoading: false,
        adminDashboardConfigError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_CONFIG_CLEAR]: () => ({ ...initialState }),
};

export default function adminDashboardConfigReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
