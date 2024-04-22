import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardQuickLinksData: null,
    adminDashboardQuickLinksLoading: false,
    adminDashboardQuickLinksSuccess: null,
    adminDashboardQuickLinksError: null,
    adminDashboardQuickLinksAdding: false,
    adminDashboardQuickLinksAddSuccess: null,
    adminDashboardQuickLinksAddError: null,
};

const handlers = {
    [actions.ADMIN_DASHBOARD_QUICKLINKS_LOADING]: () => ({
        ...initialState,
        adminDashboardQuickLinksLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_SUCCESS]: (_, action) => ({
        ...initialState,
        adminDashboardQuickLinksLoading: false,
        adminDashboardQuickLinksSuccess: true,
        adminDashboardQuickLinksData: action.payload.data,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_FAILED]: (_, action) => ({
        ...initialState,
        adminDashboardQuickLinksLoading: false,
        adminDashboardQuickLinksError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_ADDING]: state => ({
        ...state,
        adminDashboardQuickLinksAdding: true,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_ADD_SUCCESS]: state => ({
        ...state,
        adminDashboardQuickLinksAdding: false,
        adminDashboardQuickLinksAddSuccess: true,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_ADD_FAILED]: (state, action) => ({
        ...state,
        adminDashboardQuickLinksAdding: false,
        adminDashboardQuickLinksAddError: action.payload,
    }),
    [actions.ADMIN_DASHBOARD_QUICKLINKS_ADD_CLEAR]: state => ({
        ...state,
        dminDashboardQuickLinksAdding: false,
        adminDashboardQuickLinksAddSuccess: false,
        adminDashboardQuickLinksAddError: null,
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
