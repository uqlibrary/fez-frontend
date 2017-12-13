import * as actions from './actionTypes';
import {get, patch} from 'repositories/generic';
import * as routes from 'repositories/routes';

import {transformAuthorIdentifier} from './authorIdentifierTransformer';
import {APP_URL, AUTHOR_IDENTIFIER_ORCID} from 'config/general';
import {locale} from 'locale';
import {dismissAppAlert} from './app';

/**
 * Returns orcid access token for an author and updates author details with linked ORCID id
 * @param {string} userId
 * @param {string} authorId
 * @param {string} orcidCode - code return in query string from ORCID authorisation process
 * @returns {action}
 */
export function linkAuthorOrcidId(userId, authorId, orcidCode) {
    return dispatch => {
        dispatch({type: actions.CURRENT_AUTHOR_SAVING});

        dispatch({
            type: actions.APP_ALERT_SHOW,
            payload: {
                ...locale.pages.orcidLink.progressAlert
            }
        });

        let orcidId = null;

        // parameters required for AUTHOR_ORCID_DETAILS_API call
        const params = {
            code: orcidCode,
            redirUri: APP_URL
        };

        // get ORCID id for current user
        return get(routes.AUTHOR_ORCID_DETAILS_API({userId: userId, params: params}), false)
            .then((response) => {
                orcidId = response.data.orcid;
                if (!orcidId) return Promise.reject({message: 'ORCID id is missing from response. '});
                const authorPatchRequest = transformAuthorIdentifier(AUTHOR_IDENTIFIER_ORCID, authorId, orcidId, response.data);
                // patch author record with corresponding ORCID id
                return patch(routes.AUTHOR_API({authorId}), authorPatchRequest);
            })
            .then((response) => {
                // author details saved successfully
                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVED,
                    payload: response.data
                });

                dispatch({
                    type: actions.APP_ALERT_SHOW,
                    payload: {
                        ...locale.pages.orcidLink.successAlert,
                        dismissAction: () => dispatch(dismissAppAlert())
                    }
                });
            })
            .catch(error => {
                console.log(error);
                if (error.status === 403) dispatch({type: actions.CURRENT_ACCOUNT_ANONYMOUS});

                dispatch({
                    type: actions.CURRENT_AUTHOR_SAVE_FAILED,
                    payload: error.message
                });

                dispatch({
                    type: actions.APP_ALERT_SHOW,
                    payload: {
                        ...{...locale.pages.orcidLink, message: locale.pages.orcidLink.message ? locale.pages.orcidLink.message(error.message) : error.message},
                        dismissAction: () => dispatch(dismissAppAlert())
                    }
                });
            });
    };
}

