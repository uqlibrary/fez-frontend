import * as actions from 'actions/actionTypes';
import myEditorialAppointmentsReducer, { initialState } from './myEditorialAppointments';

describe('editorial appointment reducer', () => {
    it('returns the correct state while editorial appointment are loading', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_LIST_LOADING,
        });
        expect(test.myEditorialAppointmentsListLoading).toEqual(true);
    });

    it('returns the correct state when editorial appointment are loaded', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_LIST_LOADED,
            payload: [
                {
                    fvs_id: 1,
                },
            ],
        });

        expect(test.myEditorialAppointmentsListLoading).toEqual(false);
        expect(test.myEditorialAppointmentsList).toEqual([{ fvs_id: 1 }]);
        expect(test.myEditorialAppointmentsListError).toEqual(null);
    });

    it('returns the correct state when editorial appointment fails to load data', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_LIST_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.myEditorialAppointmentsListLoading).toEqual(false);
        expect(test.myEditorialAppointmentsList).toEqual(null);
        expect(test.myEditorialAppointmentsListError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = myEditorialAppointmentsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns the correct state when editorial appointment item is being updated', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING,
        });
        expect(test.myEditorialAppointmentsListItemUpdating).toEqual(true);
    });

    it('returns the correct state when editorial appointment item is successfully updated', () => {
        const oldData = {
            fvs_id: 2,
            fvs_description: 'test',
            fvs_alias: 'tests',
            fvs_search_parameters: 'test',
        };
        const test = myEditorialAppointmentsReducer(
            {
                ...initialState,
                myEditorialAppointmentsList: [
                    {
                        fvs_id: 1,
                        fvs_description: 'test',
                        fvs_alias: 'test',
                        fvs_search_parameters: 'test',
                    },
                    oldData,
                ],
            },
            {
                type: actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS,
                payload: { fvs_id: 2, fvs_description: 'testing', fvs_alias: 'tests', fvs_search_parameters: 'test' },
                oldData,
            },
        );
        expect(test.myEditorialAppointmentsListItemUpdating).toEqual(false);
        expect(test.myEditorialAppointmentsList).toEqual([
            {
                fvs_id: 1,
                fvs_description: 'test',
                fvs_alias: 'test',
                fvs_search_parameters: 'test',
            },
            {
                fvs_id: 2,
                fvs_description: 'testing',
                fvs_alias: 'tests',
                fvs_search_parameters: 'test',
            },
        ]);
    });

    it('returns the correct state when editorial appointment item update failed', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.myEditorialAppointmentsListItemUpdating).toEqual(false);
        expect(test.myEditorialAppointmentsListItemUpdateError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state when editorial appointment item is being deleted', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETING,
        });
        expect(test.myEditorialAppointmentsListItemDeleting).toEqual(true);
    });

    it('returns the correct state when editorial appointment item is successfully deleted', () => {
        const oldData = {
            fvs_id: 2,
            fvs_description: 'test',
            fvs_alias: 'tests',
            fvs_search_parameters: 'test',
        };
        const test = myEditorialAppointmentsReducer(
            {
                ...initialState,
                myEditorialAppointmentsList: [
                    {
                        fvs_id: 1,
                        fvs_description: 'test',
                        fvs_alias: 'test',
                        fvs_search_parameters: 'test',
                    },
                    oldData,
                ],
            },
            {
                type: actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_SUCCESS,
                payload: oldData,
            },
        );
        expect(test.myEditorialAppointmentsListItemDeleting).toEqual(false);
        expect(test.myEditorialAppointmentsList).toEqual([
            {
                fvs_id: 1,
                fvs_description: 'test',
                fvs_alias: 'test',
                fvs_search_parameters: 'test',
            },
        ]);
    });

    it('returns the correct state when editorial appointment item delete failed', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.myEditorialAppointmentsListItemDeleting).toEqual(false);
        expect(test.myEditorialAppointmentsListItemDeleteError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns the correct state while adding editorial appointment', () => {
        const test = myEditorialAppointmentsReducer(initialState, { type: actions.MY_EDITORIAL_APPOINTMENT_ADDING });
        expect(test.myEditorialAppointmentsAdding).toEqual(true);
    });

    it('returns the correct state on editorial appointment added successfully', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_ADD_SUCCESS,
        });
        expect(test.myEditorialAppointmentsAdding).toEqual(false);
        expect(test.myEditorialAppointmentsAddSuccess).toEqual(true);
    });

    it('returns the correct state when editorial appointment item add failed', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_ADD_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.myEditorialAppointmentsAdding).toEqual(false);
        expect(test.myEditorialAppointmentsAddError).toEqual({ status: 403, message: 'Test error message' });
    });
});
