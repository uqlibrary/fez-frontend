// Repositories
import {loadPublicationTypesData} from '../../repositories/publicationTypes';

// Types
export const PUBLICATION_TYPES_LOADING = 'PUBLICATION_TYPES_LOADING';
export const PUBLICATION_TYPES_LOADED = 'PUBLICATION_TYPES_LOADED';

// module imports
import {showSnackbar} from 'modules/App';

/**
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function loadPublicationTypesList() {
    return dispatch => {
        dispatch({type: PUBLICATION_TYPES_LOADING});
        loadPublicationTypesData().then(publicationTypes => {
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
 * Cancels the add record functionality
 * @returns {function(*)}
 */
export function cancelAddRecord(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Saves the record for later edits
 * @returns {function(*)}
 */
export function saveForLater(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Submits the record for approval
 * @returns {function(*)}
 */
export function submitRecord(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}
