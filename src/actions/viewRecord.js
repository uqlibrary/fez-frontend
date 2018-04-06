import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

/**
 * Load publication
 * @param {object}
 * @returns {action}
 */
export function loadRecordToView(pid) {
    return dispatch => {
        dispatch({type: actions.VIEW_RECORD_LOADING});

        return get(routes.EXISTING_RECORD_API({pid: pid}))
            .then(response => {
                dispatch({
                    type: actions.VIEW_RECORD_LOADED,
                    payload: response.data
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_RECORD_LOAD_FAILED,
                    payload: error.message
                });
            });
    };
}

/**
 * Set record to be viewed
 * @param {object}
 * @returns {action}
 */
export function setRecordToView(record) {
    return dispatch => {
        dispatch({
            type: actions.VIEW_RECORD_SET,
            payload: record
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
            type: actions.VIEW_RECORD_CLEAR
        });
    };
}

/**
 * Hides culture sensitivity statement application-wide
 * @returns {action}
 */
export function setHideCulturalSensitivityStatement() {
    return {
        type: actions.VIEW_RECORD_CULTURAL_SENSITIVITY_STATEMENT_HIDE
    };
}
