import {submitRecord} from '../repositories';

// Available actions for /records/ api
export const RECORD_SUBMITTED = 'RECORD_SUBMITTED';
export const RECORD_SUBMIT_FAILED = 'RECORD_SUBMIT_FAILED';
export const RECORD_SUBMITTING = 'RECORD_SUBMITTING';
export const RECORD_SUBMIT_RESET = 'RECORD_SUBMIT_RESET';

/**
 * Submits the record for approval
 * @returns {function(*)}
 */
export function saveRecord(data) {
    return dispatch => {
        dispatch({type: RECORD_SUBMITTING});

        submitRecord(data).then((data) => {
            dispatch({
                type: RECORD_SUBMITTED,
                payload: data
            });
        }).catch(error => {
            dispatch({
                type: RECORD_SUBMIT_FAILED,
                payload: error
            });
            // throw(error);
        });
    };
}

export function resetRecord() {
    return dispatch => {
        dispatch({type: RECORD_SUBMIT_RESET});
    };
}
