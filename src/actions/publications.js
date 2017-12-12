import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

/**
 * Get latest publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchLatestPublications() {
    return dispatch => {
        dispatch({type: actions.LATEST_PUBLICATIONS_LOADING});
        get(routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
            .then(response => {
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.LATEST_PUBLICATIONS_FAILED,
                    payload: []
                });
            });
    };
}

/**
 * Get author's publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchAuthorPublications({userName, page = 1, pageSize = 20, sortBy, sortDirection, facets}) {
    return dispatch => {
        dispatch({type: actions.AUTHOR_PUBLICATIONS_LOADING});

        get(routes.CURRENT_USER_RECORDS_API({
            userName: userName, page: page, pageSize: pageSize,
            sortBy: sortBy, sortDirection: sortDirection, facets: facets
        }))
            .then(response => {
                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_LOADED,
                    payload: response
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.AUTHOR_PUBLICATIONS_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Get trending publications
 * @param {string} author user name
 * @returns {action}
 */
export function searchTrendingPublications(userName) {
    return dispatch => {
        dispatch({type: actions.TRENDING_PUBLICATIONS_LOADING});
        get(routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API({userId: userName}))
            .then(response => {
                // TODO: this response will change when this api endpoint will be moved to fez
                dispatch({
                    type: actions.TRENDING_PUBLICATIONS_LOADED,
                    payload: Object.keys(response)
                        .filter(item => {
                            return item !== 'author_details';
                        })
                        .map(item => {
                            return {key: item, values: response[item]};
                        })
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.TRENDING_PUBLICATIONS_FAILED,
                    payload: error
                });
            });
    };
}
