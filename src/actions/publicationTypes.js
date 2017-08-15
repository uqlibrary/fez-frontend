// Repositories
import {getPublicationTypesList, getPublicationSubtypesList} from '../repositories';

export const PUBLICATION_TYPES_LOADING = 'PUBLICATION_TYPES_LOADING';
export const PUBLICATION_TYPES_LOAD_FAILED = 'PUBLICATION_TYPES_LOAD_FAILED';
export const PUBLICATION_TYPES_LOADED = 'PUBLICATION_TYPES_LOADED';

export const PUBLICATION_SUBTYPES_LOADING = 'PUBLICATION_SUBTYPES_LOADING';
export const PUBLICATION_SUBTYPES_LOADED = 'PUBLICATION_SUBTYPES_LOADED';
export const PUBLICATION_SUBTYPES_LOAD_FAILED = 'PUBLICATION_SUBTYPES_LOAD_FAILED';
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
                payload: publicationTypes.data
            });
        }).catch(() => {
            dispatch({
                type: PUBLICATION_TYPES_LOAD_FAILED,
                payload: []
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
            type: PUBLICATION_SUBTYPES_LOADING
        });
        getPublicationSubtypesList(id).then(data => {
            dispatch({
                type: PUBLICATION_SUBTYPES_LOADED,
                payload: data.data
            });
        }).catch(() => {
            dispatch({
                type: PUBLICATION_SUBTYPES_LOAD_FAILED,
                payload: []
            });
        });
    };
}
