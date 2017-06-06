// Repositories
import {loadPublicationTypesData} from 'repositories/publicationTypes';

// Types
export const PUBLICATION_TYPES_LOADING = 'PUBLICATION_TYPES_LOADING';
export const PUBLICATION_TYPES_LOADED = 'PUBLICATION_TYPES_LOADED';
export const ADD_RECORD_STEPPER_INDEX_INCREASED = 'ADD_RECORD_STEPPER_INDEX_INCREASED';
export const ADD_RECORD_STEPPER_INDEX_DECREASED = 'ADD_RECORD_STEPPER_INDEX_DECREASED';


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
 * Controls the stepper index by increasing the index
 * @returns {{type: string}}
 */
export function increaseStep() {
    return {
        type: ADD_RECORD_STEPPER_INDEX_INCREASED
    };
}

/**
 * Controls the stepper index by decreasing the index
 * @returns {{type: string}}
 */
export function decreaseStep() {
    return {
        type: ADD_RECORD_STEPPER_INDEX_DECREASED
    };
}
