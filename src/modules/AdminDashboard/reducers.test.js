import { VIEWMODES } from './config';
import {
    emptyQuickLinksActionState,
    emptyReportActionState,
    quickLinksActionReducer,
    reportActionReducer,
} from './reducers';

describe('reducers', () => {
    describe('quickLinksActionReducer', () => {
        it('should handle amin actions', () => {
            const action = {
                type: VIEWMODES.ADD,
                item: { title: 'New Link', target: '/new-link' },
            };
            expect(quickLinksActionReducer(null, action)).toEqual({
                action: VIEWMODES.ADD,
                item: { title: 'New Link', target: '/new-link' },
            });

            action.type = VIEWMODES.EDIT;
            action.item.title = 'Edit Link';
            expect(quickLinksActionReducer(null, action)).toEqual({
                action: VIEWMODES.EDIT,
                item: { title: 'Edit Link', target: '/new-link' },
            });

            action.type = VIEWMODES.DELETE;
            action.item.title = 'Delete Link';
            expect(quickLinksActionReducer(null, action)).toEqual({
                action: VIEWMODES.DELETE,
                item: { title: 'Delete Link', target: '/new-link' },
            });
        });

        it('should handle default case', () => {
            const action = { type: 'UNKNOWN_ACTION' }; // An unknown action type

            const newState = quickLinksActionReducer(null, action);

            expect(newState).toEqual(emptyQuickLinksActionState);
        });
    });

    describe('reportActionReducer', () => {
        it('should handle exportReport action', () => {
            const initialState = { ...emptyReportActionState };
            const action = {
                type: 'exportReport',
                value: 'some export data',
            };

            const newState = reportActionReducer(initialState, action);

            expect(newState).toEqual({
                ...initialState,
                report: 'some export data',
                type: 'exportReport',
            });
        });

        it('should handle displayReport action', () => {
            const initialState = { ...emptyReportActionState };
            const action = {
                type: 'displayReport',
                value: 'some export data',
            };

            const newState = reportActionReducer(initialState, action);

            expect(newState).toEqual({
                ...initialState,
                report: 'some export data',
                type: 'displayReport',
            });
        });

        it('should handle fromDate action', () => {
            const initialState = { ...emptyReportActionState };
            const action = {
                type: 'fromDate',
                value: 'some export data',
            };

            const newState = reportActionReducer(initialState, action);

            expect(newState).toEqual({
                ...initialState,
                filters: { ...initialState.filters, date_from: 'some export data' },
            });
        });

        it('should handle toDate action', () => {
            const initialState = { ...emptyReportActionState };
            const action = {
                type: 'toDate',
                value: 'some export data',
            };

            const newState = reportActionReducer(initialState, action);

            expect(newState).toEqual({
                ...initialState,
                filters: { ...initialState.filters, date_to: 'some export data' },
            });
        });

        it('should handle record_id action', () => {
            const initialState = { ...emptyReportActionState };
            const action = {
                type: 'record_id',
                value: 'some export data',
            };

            const newState = reportActionReducer(initialState, action);

            expect(newState).toEqual({
                ...initialState,
                filters: { ...initialState.filters, record_id: 'some export data' },
            });
        });

        it('should handle default case', () => {
            const initialState = { ...emptyReportActionState };
            const action = { type: 'UNKNOWN_ACTION' }; // An unknown action type

            const newState = reportActionReducer(initialState, action);

            expect(newState).toEqual(emptyReportActionState);
        });
    });
});
