import { VIEWMODES } from './config';

export const emptyQuickLinksActionState = { action: 'VIEW', item: { title: '', target: '' }, data: null };
export const quickLinksActionReducer = (_, action) => {
    switch (action.type) {
        case VIEWMODES.ADD:
        case VIEWMODES.EDIT:
        case VIEWMODES.DELETE:
            return {
                action: action.type,
                item: action.item,
            };
        default:
            return { ...emptyQuickLinksActionState };
    }
};

export const emptyReportActionState = {
    type: 'none',
    report: null,
    filters: { date_from: null, date_to: null, systemAlertId: null },
};
export const reportActionReducer = (state, action) => {
    switch (action.type) {
        case 'exportReport':
        case 'displayReport':
            return {
                ...state,
                type: action.type,
                report: action.value,
                filters: { ...emptyReportActionState.filters },
            };
        case 'fromDate':
            return {
                ...state,
                filters: { ...state.filters, date_from: action.value },
            };
        case 'toDate':
            return {
                ...state,
                filters: { ...state.filters, date_to: action.value },
            };
        case 'systemAlertId':
            return {
                ...state,
                filters: { ...state.filters, systemAlertId: action.value },
            };
        default:
            return { ...emptyReportActionState };
    }
};
