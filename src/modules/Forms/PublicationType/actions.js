// Repositories
import {getPublicationTypes} from '../../../repositories/publicationTypes';

// Types
export const PUBLICATION_TYPES_LOADING = 'PUBLICATION_TYPES_LOADING';
export const PUBLICATION_TYPES_LOADED = 'PUBLICATION_TYPES_LOADED';
export const SELECTED_PUBLICATION_TYPE = 'SELECTED_PUBLICATION_TYPE';

/**
 * Loads the publication types into the application
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

/**
 * Selects the publication type id
 * @returns {{type: string, payload: int}}
 */
export function getSelectedPublicationType(selectedId) {
    return {
        type: SELECTED_PUBLICATION_TYPE,
        payload: selectedId
    };
}
