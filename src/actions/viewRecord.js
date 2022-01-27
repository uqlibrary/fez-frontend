import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { EXISTING_RECORD_API, EXISTING_RECORD_VERSION_API, EXISTING_RECORD_HISTORY_API } from 'repositories/routes';

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
                dispatch({
                    type: actions.VIEW_RECORD_LOADED,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                if (error.status === 410) {
                    dispatch({
                        type: actions.VIEW_RECORD_DELETED,
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
 * Remove _shadow from tables
 *
 * @param data
 * @return {{}}
 */
export const fixRecordVersionData = data => {
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
// eslint-disable-next-line no-unused-vars
export function loadRecordVersionToView(pid, version) {
    console.log('loadRecordVersionToView', pid, version);
    return dispatch => {
        dispatch({ type: actions.VIEW_RECORD_LOADING });
        return get(EXISTING_RECORD_VERSION_API(pid.replace('uq:', 'UQ:'), version.replace('uq:', 'UQ:')))
            .then(response => {
                response.data = fixRecordVersionData(response.data);
                dispatch({
                    type: actions.VIEW_RECORD_LOADED,
                    payload: response.data,
                });
                return Promise.resolve(response.data);
            })
            .catch(error => {
                if (error.status === 410) {
                    dispatch({
                        type: actions.VIEW_RECORD_DELETED,
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

/**
 * Hides culture sensitivity statement application-wide
 * @returns {action}
 */
export function setHideCulturalSensitivityStatement() {
    return {
        type: actions.VIEW_RECORD_CULTURAL_SENSITIVITY_STATEMENT_HIDE,
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
            .catch(error => {
                dispatch({
                    type: actions.DETAILED_HISTORY_LOADING_FAILED,
                    payload: error,
                });
            });
    };
}
