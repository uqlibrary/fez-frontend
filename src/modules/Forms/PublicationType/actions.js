// Repositories
import {getPublicationTypes} from 'repositories/publicationTypes';

// Types
export const PUBLICATION_TYPES_LOADING = 'PUBLICATION_TYPES_LOADING';
export const PUBLICATION_TYPES_LOADED = 'PUBLICATION_TYPES_LOADED';


/**
 * Loads the user's account into the application
 * @returns {function(*)}
 */
export function loadPublicationTypes() {
    return dispatch => {
        dispatch({type: PUBLICATION_TYPES_LOADING});
        getPublicationTypes().then(publicationTypes => {
            dispatch({
                type: PUBLICATION_TYPES_LOADED,
                payload: publicationTypes
            });
        }).catch((error) => {
            throw(error);
        });
    };
}
