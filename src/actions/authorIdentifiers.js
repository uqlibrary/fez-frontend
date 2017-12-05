import * as actions from './actionTypes';
import {get, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';
import {transformAuthorIdentifier} from './authorIdentifierTransformer';
import {AUTHOR_IDENTIFIER_ORCID} from 'config/general';
import {locale} from 'config';
import {dismissNotificationAlert} from './app';

/**
 * Returns orcid access token for an author
 * @param {string} userId
 * @param {object} params
 * @returns {action}
 */
export function requestAuthorOrcidInfo(userId, autId, params) {
    return dispatch => {
        let orcidId = null;

        dispatch({type: actions.ORCID_ACCESS_TOKEN_REQUEST});

        return get(routes.AUTHOR_ORCID_DETAILS_API({userId: userId, params: params}), true)
            .then((response) => {
                dispatch({type: actions.ORCID_ACCESS_TOKEN_LOADED});

                orcidId = response.orcid;

                const data = transformAuthorIdentifier(AUTHOR_IDENTIFIER_ORCID, autId, orcidId, response);

                dispatch({type: actions.AUTHOR_IDENTIFIER_ADD});
                return patch(routes.AUTHOR_ADD_IDENTIFIER({autId}), data);
            })
            .then((response) => {
                dispatch({type: actions.AUTHOR_IDENTIFIER_ADDED, payload: response.data});
                dispatch({
                    type: actions.APP_NOTIFICATION,
                    payload: {
                        ...locale.authorIdentifiers.orcid.successAlert,
                        dismissAction: dismissNotificationAlert
                    }
                });
            })
            .catch(error => {
                console.log(error);
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                if (!orcidId) {
                    dispatch({
                        type: actions.ORCID_ACCESS_TOKEN_REQUEST_FAILED,
                        payload: error
                    });
                } else {
                    dispatch({
                        type: actions.AUTHOR_IDENTIFIER_ADD_FAILED,
                        payload: error
                    });
                }
            });
    };
}

