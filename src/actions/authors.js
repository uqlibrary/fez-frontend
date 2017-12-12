import * as actions from './actionTypes';
import {get, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';

/**
 * Returns the authors list based on a query, filtered locally by filterBy function
 * @param {string} query passed on to api call
 * @param {function} filterBy function to filter/transform results from api list, eg users with org ids only
 * @returns {action}
 */
export function searchAuthors(query, filterBy) {
    return dispatch => {
        dispatch({type: actions.AUTHORS_LOADING});

        get(routes.AUTHORS_SEARCH_API({query: query}))
            .then(response => {
                return Promise.resolve(
                    response.data.data.map((item) => {
                        item.displayName = item.aut_title + ' ' + item.aut_display_name +
                            (item.aut_org_username ? ' (' + item.aut_org_username + ')' : '');
                        return item;
                    })
                );
            })
            .then((data) => {
                dispatch({
                    type: actions.AUTHORS_LOADED,
                    payload: filterBy ? data.filter(filterBy) : data
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.AUTHORS_LOAD_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Update current author record
 * @param {string} authorId
 * @param {object} patch request
 * @returns {Promise}
 */
export function updateCurrentAuthor(authorId, data) {
    return dispatch => {
        dispatch({type: actions.CURRENT_AUTHOR_SAVING});

        return patch(routes.AUTHOR_API({authorId}), data)
            .then((response) => {
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVED,
                    payload: response.data
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});

                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVE_FAILED,
                    payload: error.message
                });

                return Promise.reject(error);
            });
    };
}
