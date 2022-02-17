import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { COMMUNITY_LIST_API } from 'repositories/routes';

// export const VIEW_COMMUNITIES_LOADING = 'VIEW_COMMUNITIES_LOADING';
// export const VIEW_COMMUNITIES_LOADED = 'VIEW_COMMUNITIES_LOADED';
// export const VIEW_COMMUNITIES_LOAD_FAILED = 'VIEW_COMMUNITIES_LOAD_FAILED';

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
