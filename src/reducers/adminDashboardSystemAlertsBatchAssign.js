import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardSystemAlertsBatchAssignUpdating: false,
    adminDashboardSystemAlertsBatchAssignSuccess: null,
    adminDashboardSystemAlertsBatchAssignFailed: null,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_UPDATING]: state => ({
        ...state,
        adminDashboardSystemAlertsBatchAssignUpdating: true,
        adminDashboardSystemAlertsBatchAssignSuccess: null,
        adminDashboardSystemAlertsBatchAssignFailed: null,
    }),

    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_SUCCESS]: state => ({
        ...state,
        adminDashboardSystemAlertsBatchAssignUpdating: false,
        adminDashboardSystemAlertsBatchAssignSuccess: true,
        adminDashboardSystemAlertsBatchAssignFailed: null,
    }),

    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_FAILED]: (state, action) => ({
        ...state,
        adminDashboardSystemAlertsBatchAssignUpdating: false,
        adminDashboardSystemAlertsBatchAssignSuccess: false,
        adminDashboardSystemAlertsBatchAssignFailed: action.payload,
    }),

    [actions.ADMIN_DASHBOARD_SYSTEM_ALERTS_BATCH_ASSIGN_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function adminDashboardSystemAlertsBatchAssignReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
