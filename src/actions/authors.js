import * as actions from './actionTypes';
import {get} from 'repositories/generic';
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

        return get(routes.AUTHORS_SEARCH_API({query: query}))
            .then(response => {
                return Promise.resolve(
                    response.data.map((item) => {
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
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.AUTHORS_LOAD_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Returns the authors details from app.libarary api
 * @param {string} author username
 * @returns {action}
 */
export function loadAuthorDetails(authorId) {
    return dispatch => {
        dispatch({type: actions.AUTHOR_DETAILS_LOADING});

        return get(routes.AUTHOR_DETAILS_API({userId: authorId}))
            .then((data) => {
                dispatch({
                    type: actions.AUTHOR_DETAILS_LOADED,
                    payload: data
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.AUTHOR_DETAILS_FAILED,
                    payload: error
                });
            });
    };
}
