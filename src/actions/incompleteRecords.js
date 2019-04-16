import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import {INCOMPLETE_RECORDS_API} from 'repositories/routes';

/**
 * Load a list of incomplete NTRO Records from fez
 * @returns {action}
 */
export function loadIncompleteRecords() {
    return dispatch => {
        dispatch({type: actions.INCOMPLETE_RECORDS_LOADING});

        return get(INCOMPLETE_RECORDS_API())
            .then(response => {
                dispatch({
                    type: actions.INCOMPLETE_RECORDS_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.INCOMPLETE_RECORDS_FAILED,
                    payload: error.message
                });
            });
    };
}
