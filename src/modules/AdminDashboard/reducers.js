import { VIEWMODES } from './config';

export const emptyQuickLinksActionState = { action: 'VIEW', item: { title: '', target: '' }, data: null };
export const quickLinksActionReducer = (_, action) => {
    switch (action.type) {
        case VIEWMODES.ADD:
            return {
                action: action.type,
                item: action.item,
            };
        case VIEWMODES.EDIT:
            return {
                action: action.type,
                item: action.item,
            };
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
    exportReport: null,
    displayReport: null,
    fromDate: null,
    toDate: null,
    systemAlertId: '',
};
export const reportActionReducer = (state, action) => {
    switch (action.type) {
        case 'exportReport':
            return {
                ...state,
                exportReport: action.value,
            };
        case 'displayReport':
            return {
                ...state,
                displayReport: action.value,
            };
        case 'fromDate':
            return {
                ...state,
                fromDate: action.value,
            };
        case 'toDate':
            return {
                ...state,
                toDate: action.value,
            };
        case 'systemAlertId':
            return {
                ...state,
                systemAlertId: action.value,
            };
        default:
            return { ...emptyReportActionState };
    }
};
