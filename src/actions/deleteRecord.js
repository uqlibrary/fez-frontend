import {
    DELETE_RECORD_LOADING,
    DELETE_RECORD_LOADED,
    DELETE_RECORD_LOAD_FAILED,
    DELETE_RECORD_SET,
    DELETE_RECORD_CLEAR,
    DELETE_RECORD_PROCESSING,
    DELETE_RECORD_SUCCESS,
    DELETE_RECORD_FAILED,
} from './actionTypes';
import { get, destroy } from 'repositories/generic';
import { EXISTING_RECORD_API } from 'repositories/routes';

/**
 * Load publication
 * @param {object} pid
 * @returns {action}
 */
export function loadRecordToDelete(pid) {
    return dispatch => {
        dispatch({ type: DELETE_RECORD_LOADING });
        return get(EXISTING_RECORD_API({ pid: pid }))
            .then(response => {
                dispatch({
                    type: DELETE_RECORD_LOADED,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: DELETE_RECORD_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Set record to be fixed
 * @param {object} record
 * @returns {action}
 */
export function setDeleteRecord(record) {
    return dispatch => {
        dispatch({
            type: DELETE_RECORD_SET,
            payload: record,
        });
    };
}

/**
 * Clear record to be deleted
 * @returns {action}
 */
export function clearDeleteRecord() {
    return dispatch => {
        dispatch({
            type: DELETE_RECORD_CLEAR,
        });
    };
}

/**
 * Delete record request:
 * If error occurs on any stage failed action is displayed
 * @param {object} data to be posted: {reason: reason}
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function deleteRecord(data) {
    const reason = !!data.reason ? { reason: data.reason } : {};
    return dispatch => {
        dispatch({ type: DELETE_RECORD_PROCESSING });
        return Promise.resolve([])
            .then(() => destroy(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), reason))
            .then(responses => {
                dispatch({
                    type: DELETE_RECORD_SUCCESS,
                });
                return Promise.resolve(responses);
            })
            .catch(error => {
                dispatch({
                    type: DELETE_RECORD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
