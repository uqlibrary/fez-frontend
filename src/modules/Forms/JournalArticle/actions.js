// Repositories
import {getPublicationSubTypes} from '../../../repositories/publicationSubTypes';

// Types
export const PUBLICATION_SUB_TYPES_LOADING = 'PUBLICATION_SUB_TYPES_LOADING';
export const PUBLICATION_SUB_TYPES_LOADED = 'PUBLICATION_SUB_TYPES_LOADED';


/**
 * Loads the user's account into the application
 * @returns {function(*)}
 */
export function loadPublicationSubTypes() {
    return dispatch => {
        dispatch({type: PUBLICATION_SUB_TYPES_LOADING});
        getPublicationSubTypes().then(publicationTypes => {
            dispatch({
                type: PUBLICATION_SUB_TYPES_LOADED,
                payload: publicationTypes
            });
        }).catch((error) => {
            throw(error);
        });
    };
}
