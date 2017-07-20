// Repositories
import {getPublicationTypesList} from 'repositories/getPublicationTypesList';

export const PUBLICATION_TYPES_LOADING = 'PUBLICATION_TYPES_LOADING';
export const PUBLICATION_TYPES_LOAD_FAILED = 'PUBLICATION_TYPES_LOAD_FAILED';
export const PUBLICATION_TYPES_LOADED = 'PUBLICATION_TYPES_LOADED';


/**
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function loadPublicationTypesList() {
    return dispatch => {
        dispatch({type: PUBLICATION_TYPES_LOADING});
        getPublicationTypesList().then(publicationTypes => {
            dispatch({
                type: PUBLICATION_TYPES_LOADED,
                payload: publicationTypes
            });
        }).catch(() => {
            dispatch({
                type: PUBLICATION_TYPES_LOAD_FAILED,
                payload: []
            });
        });
    };
}


