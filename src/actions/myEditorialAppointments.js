import {
    MY_EDITORIAL_APPOINTMENT_ADDING,
    MY_EDITORIAL_APPOINTMENT_ADD_SUCCESS,
    MY_EDITORIAL_APPOINTMENT_ADD_FAILED,
    MY_EDITORIAL_APPOINTMENT_LIST_LOADING,
    MY_EDITORIAL_APPOINTMENT_LIST_LOADED,
    MY_EDITORIAL_APPOINTMENT_LIST_FAILED,
    MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING,
    MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS,
    MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_FAILED,
    MY_EDITORIAL_APPOINTMENT_ITEM_DELETING,
    MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_SUCCESS,
    MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_FAILED,
} from './actionTypes';
import { get, put, destroy, post } from 'repositories/generic';
import { MY_EDITORIAL_APPOINTMENT_LIST_API } from 'repositories/routes';

export function loadMyEditorialAppointmentsList() {
    return async dispatch => {
        dispatch({ type: MY_EDITORIAL_APPOINTMENT_LIST_LOADING });

        try {
            const response = await get(MY_EDITORIAL_APPOINTMENT_LIST_API());
            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_LIST_LOADED,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_LIST_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function updateMyEditorialAppointmentsListItem(newData, oldData) {
    return async dispatch => {
        try {
            dispatch({ type: MY_EDITORIAL_APPOINTMENT_ITEM_UPDATING });

            const response = await put(MY_EDITORIAL_APPOINTMENT_LIST_API({ id: newData.eap_id }), newData);

            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_SUCCESS,
                payload: response.data,
                oldData,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_ITEM_UPDATE_FAILED,
                payload: e,
                oldData,
            });

            return Promise.reject(e);
        }
    };
}

export function deleteMyEditorialAppointmentsListItem(oldData) {
    return async dispatch => {
        dispatch({ type: MY_EDITORIAL_APPOINTMENT_ITEM_DELETING });

        try {
            const response = await destroy(MY_EDITORIAL_APPOINTMENT_LIST_API({ id: oldData.eap_id }));
            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_SUCCESS,
                payload: oldData,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_ITEM_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function addMyEditorialAppointments(data) {
    return async dispatch => {
        dispatch({ type: MY_EDITORIAL_APPOINTMENT_ADDING });

        try {
            const response = await post(MY_EDITORIAL_APPOINTMENT_LIST_API(), data);
            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_ADD_SUCCESS,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: MY_EDITORIAL_APPOINTMENT_ADD_FAILED,
                payload: e,
            });

            return false;
        }
    };
}
