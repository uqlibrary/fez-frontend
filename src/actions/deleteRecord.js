import {
    DELETE_RECORD_LOADING,
    DELETE_RECORD_LOADED,
    DELETE_RECORD_LOAD_FAILED,
    DELETE_RECORD_SET,
    DELETE_RECORD_CLEAR,
    DELETE_RECORD_PROCESSING,
    DELETE_RECORD_SUCCESS,
    DELETE_RECORD_FAILED,
    UPDATE_DELETED_RECORD_PROCESSING,
    UPDATE_DELETED_RECORD_FAILED,
    UPDATE_DELETED_RECORD_SUCCESS,
} from './actionTypes';
import { get, destroy, patch } from 'repositories/generic';
import { EXISTING_RECORD_API } from 'repositories/routes';
import * as actions from './actionTypes';
import { DELETED } from '../config/general';

export const createPayload = data => ({
    rek_status: DELETED,
    ...(!!data.reason ? { reason: data.reason } : {}),
    ...{
        fez_record_search_key_doi_resolution_url: !!data.publication?.fez_record_search_key_doi_resolution_url
            ?.rek_doi_resolution_url
            ? data.publication?.fez_record_search_key_doi_resolution_url
            : null,
    },
    ...{
        fez_record_search_key_new_doi: !!data.publication?.fez_record_search_key_new_doi?.rek_new_doi
            ? data.publication?.fez_record_search_key_new_doi
            : null,
    },
    ...{
        fez_record_search_key_deletion_notes: !!data.publication?.fez_record_search_key_deletion_notes
            ?.rek_deletion_notes
            ? data.publication?.fez_record_search_key_deletion_notes
            : null,
    },
});

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
                if (error.status === 410) {
                    dispatch({
                        type: actions.DELETE_RECORD_LOADED,
                        payload: error.data,
                    });
                } else {
                    dispatch({
                        type: DELETE_RECORD_LOAD_FAILED,
                        payload: error.message,
                    });
                }
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
 * @returns {Promise}
 */
export function deleteRecord(data) {
    return dispatch => {
        dispatch({ type: DELETE_RECORD_PROCESSING });
        return Promise.resolve([])
            .then(() => destroy(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), createPayload(data)))
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

/**
 * @returns {Promise}
 */
export function deleteUpdatePartial(data) {
    return dispatch => {
        dispatch({ type: UPDATE_DELETED_RECORD_PROCESSING });
        return Promise.resolve([])
            .then(() => patch(EXISTING_RECORD_API({ pid: data.publication.rek_pid }), createPayload(data)))
            .then(responses => {
                dispatch({
                    type: UPDATE_DELETED_RECORD_SUCCESS,
                });
                return Promise.resolve(responses);
            })
            .catch(error => {
                dispatch({
                    type: UPDATE_DELETED_RECORD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
