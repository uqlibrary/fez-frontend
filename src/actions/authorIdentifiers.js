import * as actions from './actionTypes';
import {get, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';
import {transformIdentifierResponse} from './authorIdentifierTransformer';

/**
 * Returns orcid access token for an author
 * @param {string} userId
 * @param {object} params
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
 * Link author identifier to an author
 *
 * @param {string}  type    Type of an identifier e.g. orcid/scopus/researcher_id/google_scholar
 * @param {string}  userId
 * @param {string}  identifier ID
 * @param {object}  response object (entire response - oauth access token)
 * @returns {function(*)}
 */
export function addAuthorIdentifier(type, userId, identifierId, response = null) {
    return dispatch => {
        const data = transformIdentifierResponse(type, userId, identifierId, response);
        dispatch({type: actions.ACADEMIC_IDENTIFIER_ADDING});
        return patch(routes.AUTHOR_ADD_IDENTIFIER({userId}), data)
            .then(() => dispatch({type: actions.ACADEMIC_IDENTIFIER_ADDING_DONE}))
            .catch((error) => dispatch({type: actions.ACADEMIC_IDENTIFIER_ADDING_FAILED, payload: error}));
    };
}
