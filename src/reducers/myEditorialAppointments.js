import * as actions from 'actions/actionTypes';

export const initialState = {
    myEditorialAppointmentsListLoading: true,
    myEditorialAppointmentsList: null,
    myEditorialAppointmentsListError: null,
    myEditorialAppointmentsListItemUpdating: false,
    myEditorialAppointmentsListItemUpdateError: null,
    myEditorialAppointmentsListItemDeleting: false,
    myEditorialAppointmentsListItemDeleteError: null,
    myEditorialAppointmentsAdding: false,
    myEditorialAppointmentsAddSuccess: false,
    myEditorialAppointmentsAddError: null,
};

const handlers = {
    [actions.MY_EDITORIAL_APPOINTMENT_LIST_LOADING]: state => ({
        ...state,
        myEditorialAppointmentsListLoading: true,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_LIST_LOADED]: (state, action) => ({
        ...state,
        myEditorialAppointmentsListLoading: false,
        myEditorialAppointmentsList: action.payload,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_LIST_FAILED]: (state, action) => ({
        ...state,
        myEditorialAppointmentsListLoading: false,
        myEditorialAppointmentsList: null,
        myEditorialAppointmentsListError: action.payload,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING]: state => ({
        ...state,
        myEditorialAppointmentsListItemUpdating: true,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS]: (state, action) => {
        const index = state.myEditorialAppointmentsList.indexOf(action.oldData);
        return {
            ...state,
            myEditorialAppointmentsListItemUpdating: false,
            myEditorialAppointmentsList: [
                ...state.myEditorialAppointmentsList.slice(0, index),
                action.payload,
                ...state.myEditorialAppointmentsList.slice(index + 1),
            ],
        };
    },

    [actions.MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_FAILED]: (state, action) => ({
        ...state,
        myEditorialAppointmentsListItemUpdating: false,
        myEditorialAppointmentsListItemUpdateError: action.payload,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETING]: state => ({
        ...state,
        myEditorialAppointmentsListItemDeleting: true,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_SUCCESS]: (state, action) => {
        const index = state.myEditorialAppointmentsList.indexOf(action.payload);
        return {
            ...state,
            myEditorialAppointmentsListItemDeleting: false,
            myEditorialAppointmentsList: [
                ...state.myEditorialAppointmentsList.slice(0, index),
                ...state.myEditorialAppointmentsList.slice(index + 1),
            ],
        };
    },

    [actions.MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_FAILED]: (state, action) => ({
        ...state,
        myEditorialAppointmentsListItemDeleting: false,
        myEditorialAppointmentsListItemDeleteError: action.payload,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_ADDING]: state => ({
        ...state,
        myEditorialAppointmentsAdding: true,
        myEditorialAppointmentsAddSuccess: false,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_ADD_SUCCESS]: state => ({
        ...state,
        myEditorialAppointmentsAdding: false,
        myEditorialAppointmentsAddSuccess: true,
    }),

    [actions.MY_EDITORIAL_APPOINTMENT_ADD_FAILED]: (state, action) => ({
        ...state,
        myEditorialAppointmentsAdding: false,
        myEditorialAppointmentsAddSuccess: false,
        myEditorialAppointmentsAddError: action.payload,
    }),
};

export default function myEditorialAppointmentsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
