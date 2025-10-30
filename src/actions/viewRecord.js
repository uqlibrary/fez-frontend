import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { EXISTING_RECORD_API, EXISTING_RECORD_HISTORY_API, EXISTING_RECORD_VERSION_API } from 'repositories/routes';
import { DELETED, PUBLICATION_TYPE_DATA_COLLECTION } from '../config/general';

/**
 * Load publication
 * @param {object}
 * @returns {action}
 */
export function loadRecordToView(pid, isEdit = false) {
    return dispatch => {
        dispatch({ type: actions.VIEW_RECORD_LOADING });

        return get(EXISTING_RECORD_API({ pid: pid.replace('uq:', 'UQ:'), isEdit }))
            .then(response => {
                // if it has been deleted and it's a data collection, handle it as a deleted record
                // this is for cached api responses sitting on public S3 bucket
                if (
                    response.data.rek_status === DELETED &&
                    response.data.rek_display_type === PUBLICATION_TYPE_DATA_COLLECTION
                ) {
                    const error = new Error();
                    error.data = response.data;
                    error.status = 410;
                    return Promise.reject(error);
                }

                dispatch({
                    type: actions.VIEW_RECORD_LOADED,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                if (error.status === 410) {
                    dispatch({
                        type: actions.VIEW_RECORD_DELETED_LOADED,
                        payload: error.data,
                    });
                } else {
                    dispatch({
                        type: actions.VIEW_RECORD_LOAD_FAILED,
                        payload: error,
                    });
                }
            });
    };
}

/**
 * @param data
 * @return {{}}
 */
export const removeShadowSuffixFromTableNames = data => {
    const normalised = {};
    for (const [key, value] of Object.entries(data)) {
        normalised[key.replace('_shadow', '')] = value;
    }
    return normalised;
};

/**
 * @param {object}
 * @returns {action}
 */
export function loadRecordVersionToView(pid, version) {
    return dispatch => {
        dispatch({ type: actions.VIEW_RECORD_LOADING });
        return get(EXISTING_RECORD_VERSION_API(pid.replace('uq:', 'UQ:'), version.replace('uq:', 'UQ:')))
            .then(response => {
                response.data = removeShadowSuffixFromTableNames(response.data);
                dispatch({
                    type: actions.VIEW_RECORD_LOADED,
                    payload: response.data,
                });
                return Promise.resolve(response.data);
            })
            .catch(error => {
                if (error.status === 410) {
                    dispatch({
                        type: actions.VIEW_RECORD_VERSION_DELETED_LOADED,
                        payload: removeShadowSuffixFromTableNames(error.data),
                    });
                } else {
                    dispatch({
                        type: actions.VIEW_RECORD_LOAD_FAILED,
                        payload: error,
                    });
                }
            });
    };
}

/**
 * Clear record to be viewed
 * @returns {action}
 */
export function clearRecordToView() {
    return dispatch => {
        dispatch({
            type: actions.VIEW_RECORD_CLEAR,
        });
    };
}

export function unlockRecordToView() {
    return {
        type: actions.VIEW_RECORD_UNLOCK,
    };
}

export function loadDetailedHistory(pid) {
    return dispatch => {
        dispatch({ type: actions.DETAILED_HISTORY_LOADING });
        return get(EXISTING_RECORD_HISTORY_API({ pid: pid.replace('uq:', 'UQ:') }))
            .then(response => {
                dispatch({
                    type: actions.DETAILED_HISTORY_LOADING_SUCCESS,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(
                /* c8 ignore next */ error => {
                    /* c8 ignore next */
                    dispatch({
                        type: actions.DETAILED_HISTORY_LOADING_FAILED,
                        payload: error,
                    });
                },
            );
    };
}
