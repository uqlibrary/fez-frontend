import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { VOCAB_LIST_API, CHILD_VOCAB_LIST_API } from 'repositories/routes';

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
export function loadChildVocabList(params = {}) {
    const { pid, pageSize, page, direction, sortBy } = params;
    return dispatch => {
        dispatch({ type: actions.VIEW_CHILD_VOCAB_LOADING, payload: { pid: pid, pageSize: pageSize } });
        return get(
            CHILD_VOCAB_LIST_API({ pid: pid, pageSize: pageSize, page: page, direction: direction, sortBy: sortBy }),
        )
            .then(response => {
                dispatch({
                    type: actions.VIEW_CHILD_VOCAB_LOADED,
                    payload: {
                        parent: pid,
                        data: response,
                    },
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_CHILD_VOCAB_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
export function clearControlledVocabList() {
    return dispatch => {
        dispatch({ type: actions.VIEW_CHILD_VOCAB_CLEARED });
    };
}
export function setControlledVocabArray(rowObject) {
    return dispatch => {
        dispatch({
            type: actions.SET_CHILD_VOCAB_ARRAY,
            payload: {
                pid: rowObject.pid,
                open: rowObject.open,
            },
        });
    };
}
