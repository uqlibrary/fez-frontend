import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';


/**
 * Returns the authors list based on a query, filtered locally by filterBy function
 * @param {string} query passed on to api call
 * @param {function} filterBy function to filter/transform results from api list, eg users with org ids only
 * @returns {action}
 */
export function requestAuthorOrcidInfo(userId, params) {
    return dispatch => {
        dispatch({type: actions.AUTHOR_ORCID_DETAILS_LOADING});

        get(routes.AUTHOR_ORCID_DETAILS_API({userId: userId, params: params}))
            .then((response) => {
                dispatch({
                    type: actions.AUTHOR_ORCID_DETAILS_LOADED,
                    payload: response.data
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: actions.AUTHOR_ORCID_DETAILS_FAILED,
                    payload: error
                });
            });
    };
}
