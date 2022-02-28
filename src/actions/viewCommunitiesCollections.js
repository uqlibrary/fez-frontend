import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { COMMUNITY_LIST_API, COLLECTION_LIST_API } from 'repositories/routes';

/**
 * Load Communities List
 * @param {object}
 * @returns {action}
 */
export function loadCommunitiesList(params = {}) {
    const { pageSize, page } = params;
    return dispatch => {
        dispatch({ type: actions.VIEW_COMMUNITIES_LOADING });

        return get(COMMUNITY_LIST_API({ pageSize: pageSize, page: page }))
            .then(response => {
                dispatch({
                    type: actions.VIEW_COMMUNITIES_LOADED,
                    payload: response,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_COMMUNITIES_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
export function loadCCCollectionsList(params = {}) {
    const { pid, pageSize, page } = params;
    return dispatch => {
        dispatch({ type: actions.VIEW_COLLECTIONS_LOADING });
        return get(COLLECTION_LIST_API({ pid: pid, pageSize: pageSize, page: page }))
            .then(response => {
                dispatch({
                    type: actions.VIEW_COLLECTIONS_LOADED,
                    payload: {
                        parent: pid,
                        data: response,
                    },
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.VIEW_COLLECTIONS_LOAD_FAILED,
                    payload: error,
                });
            });
    };
}
