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
