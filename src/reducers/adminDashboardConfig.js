import * as actions from 'actions/actionTypes';

export const initialState = {
    adminDashboardConfigData: null,
    adminDashboardConfigLoading: false,
    adminDashboardConfigSuccess: null,
    adminDashboardConfigError: null,
};

export const transformData = data => {
    const copy = structuredClone(data);
    // concat the user's name just once
    copy.admin_users?.forEach(user => {
        const newName = [];
        !!user?.family_name && newName.push(user.family_name);
        !!user?.given_names && newName.push(user.given_names);
        user.preferred_name = newName.length > 0 ? newName.join(', ') : user.name; // fallback
    });
    return copy;
};

const handlers = {
    [actions.ADMIN_DASHBOARD_CONFIG_LOADING]: () => ({
        ...initialState,
        adminDashboardConfigLoading: true,
    }),
    [actions.ADMIN_DASHBOARD_CONFIG_SUCCESS]: (_, action) => {
        const data = transformData(action.payload?.data);
        // convert the bindings value of a report to an array
        // so we only have to do it once.
        data.export_reports = data.export_reports.map(report => ({
            ...report,
            sel_bindings: report.sel_bindings && report.sel_bindings.split(','),
        }));

        return {
            ...initialState,
            adminDashboardConfigLoading: false,
            adminDashboardConfigSuccess: true,
            adminDashboardConfigData: data,
        };
    },
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
