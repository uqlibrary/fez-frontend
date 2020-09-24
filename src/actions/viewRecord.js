import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { EXISTING_RECORD_API } from 'repositories/routes';

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
