import * as actions from './actionTypes';
import {patch} from 'repositories/generic';
import * as routes from 'repositories/routes';
import {transformAuthorIdentifier} from './authorIdentifierTransformer';
import {AUTHOR_IDENTIFIER_GOOGLE_SCHOLAR} from 'config/general';
import {locale} from 'locale';

import {dismissAppAlert} from './app';

/**
 * Patches the author record for aut_google_scholar_id
 * @param {string} authorId
 * @param {string} googleScholarId
 * @returns {action}
 */
export function patchGoogleScholarId(authorId, googleScholarId) {
    return dispatch => {
        const patchRequest = transformAuthorIdentifier(AUTHOR_IDENTIFIER_GOOGLE_SCHOLAR, authorId, googleScholarId);
        console.log(patchRequest);
        dispatch({type: actions.AUTHOR_IDENTIFIER_UPDATING});

        return patch(routes.AUTHOR_API({authorId}), patchRequest)
            .then((response) => {
                dispatch({
                    type: actions.AUTHOR_IDENTIFIER_UPDATED,
                    payload: response.data
                });
                dispatch({
                    type: actions.APP_ALERT_SHOW,
                    payload: {
                        ...locale.pages.googleScholarLink.successAlert,
                        dismissAction: dismissAppAlert
                    }
                });

                return Promise.resolve(response.data);
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});

                dispatch({
                    type: actions.AUTHOR_IDENTIFIER_UPDATE_FAILED,
                    payload: error.message
                });

                return Promise.reject(error);
            });
    };
}
