import * as actions from 'actions/actionTypes';
import myEditorialAppointmentsReducer, { initialState } from './myEditorialAppointments';

/*
    `eap_id`
    `eap_jnl_id`
    `eap_journal_name`
    `eap_role_cvo_id`
    `eap_role_name`
    `eap_start_year`
    `eap_end_year`
*/

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
                    eap_id: 1,
                },
            ],
        });

        expect(test.myEditorialAppointmentsListLoading).toEqual(false);
        expect(test.myEditorialAppointmentsList).toEqual([{ eap_id: 1 }]);
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
            eap_id: 2,
            eap_journal_name: 'test',
            eap_jnl_id: 2134,
            eap_role_cvo_id: '454145',
            eap_role_name: 'Guest Editor',
            eap_start_year: '2010',
            eap_end_year: '2020',
        };
        const test = myEditorialAppointmentsReducer(
            {
                ...initialState,
                myEditorialAppointmentsList: [
                    {
                        eap_id: 1,
                        eap_journal_name: 'test',
                        eap_jnl_id: 'test',
                        eap_role_cvo_id: 'test',
                    },
                    oldData,
                ],
            },
            {
                type: actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS,
                payload: {
                    eap_id: 2,
                    eap_journal_name: 'test',
                    eap_jnl_id: 2134,
                    eap_role_cvo_id: '454144',
                    eap_role_name: 'Editorial Board Member',
                    eap_start_year: '2010',
                    eap_end_year: '2020',
                },
                oldData,
            },
        );
        expect(test.myEditorialAppointmentsListItemUpdating).toEqual(false);
        expect(test.myEditorialAppointmentsList).toEqual([
            {
                eap_id: 1,
                eap_journal_name: 'test',
                eap_jnl_id: 'test',
                eap_role_cvo_id: 'test',
            },
            {
                eap_id: 2,
                eap_journal_name: 'test',
                eap_jnl_id: 2134,
                eap_role_cvo_id: '454144',
                eap_role_name: 'Editorial Board Member',
                eap_start_year: '2010',
                eap_end_year: '2020',
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
            eap_id: 2,
            eap_journal_name: 'test',
            eap_jnl_id: 'tests',
            eap_role_cvo_id: 'test',
        };
        const test = myEditorialAppointmentsReducer(
            {
                ...initialState,
                myEditorialAppointmentsList: [
                    {
                        eap_id: 1,
                        eap_journal_name: 'test',
                        eap_jnl_id: 'test',
                        eap_role_cvo_id: 'test',
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
                eap_id: 1,
                eap_journal_name: 'test',
                eap_jnl_id: 'test',
                eap_role_cvo_id: 'test',
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
            payload: {
                eap_aut_id: 5283470,
                eap_jnl_id: 10805,
                eap_journal_name: 'Nature',
                eap_role_cvo_id: 454140,
                eap_start_year: 2002,
                eap_end_year: 2021,
                eap_id: 228,
                tableData: {
                    id: 0,
                },
            },
        });
        expect(test.myEditorialAppointmentsAdding).toEqual(false);
        expect(test.myEditorialAppointmentsAddSuccess).toEqual(true);
        expect(test.myEditorialAppointmentsList).toEqual([
            {
                eap_aut_id: 5283470,
                eap_jnl_id: 10805,
                eap_journal_name: 'Nature',
                eap_role_cvo_id: 454140,
                eap_start_year: 2002,
                eap_end_year: 2021,
                eap_id: 228,
                tableData: {
                    id: 0,
                },
            },
        ]);
    });

    it('returns the correct state when editorial appointment item add failed', () => {
        const test = myEditorialAppointmentsReducer(initialState, {
            type: actions.MY_EDITORIAL_APPOINTMENT_ADD_FAILED,
            payload: { status: 403, message: 'Test error message' },
        });
        expect(test.myEditorialAppointmentsAdding).toEqual(false);
        expect(test.myEditorialAppointmentsAddError).toEqual({ status: 403, message: 'Test error message' });
    });

    it('returns expected state when editorial appointment state is cleared', () => {
        const test = myEditorialAppointmentsReducer(
            { ...initialState, myEditorialAppointmentsAddSuccess: true },
            { type: actions.MY_EDITORIAL_APPOINTMENT_ADD_CLEAR },
        );
        expect(test.myEditorialAppointmentsAddSuccess).toEqual(false);
    });
});
