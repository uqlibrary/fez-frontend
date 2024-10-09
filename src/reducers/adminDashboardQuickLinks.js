import * as actions from 'actions/actionTypes';

const initialDashboardQuickLinksUpdateState = {
    adminDashboardQuickLinksUpdating: false,
    adminDashboardQuickLinksUpdateSuccess: null,
    adminDashboardQuickLinksUpdateFailed: null,
};

export const initialState = {
    adminDashboardQuickLinksData: null,
    adminDashboardQuickLinksLoading: false,
    adminDashboardQuickLinksSuccess: null,
    adminDashboardQuickLinksError: null,
    ...initialDashboardQuickLinksUpdateState,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_QUICKLINKS_LOADING]: () => ({
        ...initialState,
        adminDashboardQuickLinksLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_SUCCESS]: (state, action) => ({
        ...initialState,
        adminDashboardQuickLinksLoading: false,
        adminDashboardQuickLinksSuccess: true,
        adminDashboardQuickLinksData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_FAILED]: (state, action) => ({
        ...initialState,
        adminDashboardQuickLinksLoading: false,
        adminDashboardQuickLinksError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATING]: state => ({
        ...initialState,
        ...state,
        adminDashboardQuickLinksUpdating: true,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_SUCCESS]: state => ({
        ...state,
        adminDashboardQuickLinksUpdating: false,
        adminDashboardQuickLinksUpdateSuccess: true,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_FAILED]: (state, action) => ({
        ...state,
        adminDashboardQuickLinksUpdating: false,
        adminDashboardQuickLinksUpdateFailed: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_UPDATE_CLEAR]: state => ({
        ...state,
        ...initialDashboardQuickLinksUpdateState,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_CLEAR]: () => ({ ...initialState }),
};

export default function adminDashboardQuickLinksReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
