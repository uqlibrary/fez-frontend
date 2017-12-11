import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

/**
 * Fetches the controlled vocabularies list
 * @returns {function(*)}
 */
export function loadVocabulariesList(id) {
    return dispatch => {
        dispatch({
            type: `${actions.VOCABULARIES_LOADING}@${id}`
        });
        return get(routes.VOCABULARIES_API({id: id}))
            .then(result => {
                dispatch({
                    type: `${actions.VOCABULARIES_LOADED}@${id}`,
                    payload: result.data
                });
            })
            .catch(error => {
                if (error.status === 403) dispatch({type: actions.ACCOUNT_ANONYMOUS});
                dispatch({
                    type: `${actions.VOCABULARIES_LOAD_FAILED}@${id}`,
                    payload: error
                });
            });
    };
}
