import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { VOCAB_LIST_API } from 'repositories/routes';

/**
 * Load Communities List
 *
 * @returns {action}
 */
export function loadControlledVocabList() {
    return dispatch => {
        dispatch({ type: actions.VIEW_VOCAB_LOADING });

        return get(VOCAB_LIST_API())
            .then(response => {
                dispatch({
                    type: actions.VIEW_VOCAB_LOADED,
                    payload: response,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_VOCAB_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
