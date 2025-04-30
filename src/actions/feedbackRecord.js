import * as transformers from './transformers';
import * as actions from './actionTypes';
import { get, post } from 'repositories/generic';
import { EXISTING_RECORD_API, RECORDS_FEEDBACK_API } from 'repositories/routes';

/**
 * Load publication
 * @param {object}
 * @returns {action}
 */
export function loadRecordToFeedback(pid) {
    return dispatch => {
        dispatch({ type: actions.FEEDBACK_RECORD_LOADING });

        return get(EXISTING_RECORD_API({ pid: pid }))
            .then(response => {
                dispatch({
                    type: actions.FEEDBACK_RECORD_LOADED,
                    payload: response.data,
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                dispatch({
                    type: actions.FEEDBACK_RECORD_LOAD_FAILED,
                    payload: error.message,
                });
            });
    };
}

/**
 * Clear record to feedback
 * @returns {action}
 */
export function clearFeedbackRecord() {
    return dispatch => {
        dispatch({
            type: actions.FEEDBACK_RECORD_CLEAR,
        });
    };
}

/**
 * Feedback record request:
 *      send feedback message to notify espace team
 * If error occurs on any stage failed action is displayed
 *
 * @param {string} pid
 * @param {object} data to be posted to backend API
 * @returns {promise} - this method is used by form onSubmit which requires Promise resolve/reject as a return
 */
export function feedbackRecord(pid, data) {
    return dispatch => {
        dispatch({ type: actions.FEEDBACK_RECORD_PROCESSING });

        // create request for issue notification
        const feedbackRequest = transformers.getFeedbackRecordData(pid, data);

        return post(RECORDS_FEEDBACK_API({ pid }), feedbackRequest)
            .then(responses => {
                dispatch({ type: actions.FEEDBACK_RECORD_SUCCESS });
                return Promise.resolve(responses);
            })
            .catch(error => {
                dispatch({
                    type: actions.FEEDBACK_RECORD_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error);
            });
    };
}
