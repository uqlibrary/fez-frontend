import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardQuickLinksData: null,
    adminDashboardQuickLinksLoading: false,
    adminDashboardQuickLinksSuccess: null,
    adminDashboardQuickLinksError: null,
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
    [actions.ADMIN_DASHBOARD_QUICKLINKS_CLEAR]: () => ({ ...initialState }),
};

export default function adminDashboardQuickLinksReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
