import * as actions from './actionTypes';
import {get} from 'repositories/generic';
import * as routes from 'repositories/routes';

/**
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function loadPublicationTypesList() {
    return dispatch => {
        dispatch({type: actions.PUBLICATION_TYPES_LOADING});
        get(routes.GET_PUBLICATION_TYPES_API())
            .then(publicationTypes => {
                dispatch({
                    type: actions.PUBLICATION_TYPES_LOADED,
                    payload: publicationTypes.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: actions.PUBLICATION_TYPES_LOAD_FAILED,
                    payload: error
                });
            });
    };
}

/**
 * Fetches the publication sub types
 * @returns {function(*)}
 */
export function loadPublicationSubtypesList(id) {
    return dispatch => {
        dispatch({
            type: actions.PUBLICATION_SUBTYPES_LOADING
        });
        get(routes.VOCABULARIES_API({id: id}))
            .then(result => {
                dispatch({
                    type: actions.PUBLICATION_SUBTYPES_LOADED,
                    payload: result.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: actions.PUBLICATION_SUBTYPES_LOAD_FAILED,
                    payload: error
                });
            });
    };
}
