import * as actions from './actionTypes';
import {get} from '../repositories/generic';
import {GET_NEWS_API} from '../repositories/routes';

/**
 * Load a list of news from fez
 * @returns {action}
 */
export function loadNewsFeed() {
    return dispatch => {
        dispatch({type: actions.NEWS_LOADING});
        return get(GET_NEWS_API())
            .then(response => {
                dispatch({
                    type: actions.NEWS_LOADED,
                    payload: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.NEWS_LOAD_FAILED,
                    payload: error.message
                });
            });
    };
}
