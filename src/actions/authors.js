import {
    fetchAuthors,
    fetchAuthorDetails
} from 'repositories';
import * as actions from './actionTypes';

/**
 * Returns the authors list based on a query, filtered locally by filterBy function
 * @param {string} query passed on to api call
 * @param {function} filterBy function to filter/transform results from api list, eg users with org ids only
 * @returns {action}
 */
export function searchAuthors(query, filterBy) {
    return dispatch => {
        dispatch({type: actions.AUTHORS_LOADING});

        fetchAuthors(query).then((data) => {
            dispatch({
                type: actions.AUTHORS_LOADED,
                payload: filterBy ? data.filter(filterBy) : data
            });
        }).catch(error => {
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

        fetchAuthorDetails(authorId).then((data) => {
            dispatch({
                type: actions.AUTHOR_DETAILS_LOADED,
                payload: data
            });
        }).catch(error => {
            dispatch({
                type: actions.AUTHOR_DETAILS_FAILED,
                payload: error
            });
        });
    };
}
