import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import { ORCID_SYNC_API } from 'repositories/routes';

/**
 * Load the current sync status from ORCID
 *
 * @returns {action}
 */
export function loadOrcidSyncStatus() {
    return dispatch => {
        dispatch({ type: actions.ORCID_SYNC_STATUS_LOADING });
        return get(ORCID_SYNC_API()).then(
            response => {
                dispatch({
                    type: actions.ORCID_SYNC_STATUS_LOADED,
                    payload: response.data,
                });
            },
            error => {
                if (error.status === 404) {
                    dispatch({
                        type: actions.ORCID_SYNC_STATUS_LOADED,
                        payload: {},
                    });
                } else {
                    dispatch({
                        type: actions.ORCID_SYNC_STATUS_LOAD_FAILED,
                        payload: error.message,
                    });
                }
            },
        );
    };
}

/**
 * Request a sync to ORCID
 *
 * @returns {action}
 */
export function requestOrcidSync() {
    return dispatch => {
        dispatch({ type: actions.ORCID_SYNC_REQUESTING });
        return post(ORCID_SYNC_API())
            .then(response => {
                dispatch({
                    type: actions.ORCID_SYNC_SUCCESS,
                    payload: response.data,
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.ORCID_SYNC_FAILED,
                    payload: error.message,
                });
            })
            .finally(() => {
                loadOrcidSyncStatus()(dispatch);
            });
    };
}
