import * as actions from './actionTypes';
import {get, post} from 'repositories/generic';
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

        return get(routes.AUTHOR_ORCID_DETAILS_API({userId: userId, params: params}))
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

/**
 * Link ID provider to author
 *
 * @param userId
 * @param providerId
 * @returns {function(*)}
 */
export function addAcademicIdentifier(userId, providerId) {
    return dispatch => {
        dispatch({type: actions.ACADEMIC_IDENTIFIER_ADDING});
        dispatch({type: actions.ACADEMIC_IDENTIFIER_GRANT_ADD});

        const addIdentifierPromise = post(routes.ACADEMIC_IDENTIFIERS_ADD_API({userId, providerId}))
            .then(() => dispatch({type: actions.ACADEMIC_IDENTIFIER_ADDING_DONE}))
            .catch((error) => dispatch({type: actions.ACADEMIC_IDENTIFIER_ADDING_FAILED, payload: error}));

        const grantAddIdentifierPromise = post(routes.ACADEMIC_IDENTIFIERS_GRANT_ADD_API({userId, providerId}))
            .then(() => dispatch({type: actions.ACADEMIC_IDENTIFIER_GRANT_ADD_DONE}))
            .catch((error) => dispatch({type: actions.ACADEMIC_IDENTIFIER_ADDING_FAILED, payload: error}));

        return Promise.all([addIdentifierPromise, grantAddIdentifierPromise]);
    };
}
