import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import {INCOMPLETE_NTRO_API} from 'repositories/routes';

/**
 * Load a list of incomplete NTRO Records from fez
 * @returns {action}
 */
export function loadIncompleteNTROList() {
    return dispatch => {
        dispatch({type: actions.INCOMPLETE_NTRO_LOADING});

        return get(INCOMPLETE_NTRO_API())
            .then(response => {
                dispatch({
                    type: actions.INCOMPLETE_NTRO_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.INCOMPLETE_NTRO_FAILED,
                    payload: error.message
                });
            });
    };
}
