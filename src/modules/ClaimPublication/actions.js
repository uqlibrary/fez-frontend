// repositories
import {loadUsersPublicationData}  from 'repositories/claimPublication';
// repositories

export const PUBLICATION_RESULTS_CLEARED = 'PUBLICATION_RESULTS_CLEARED';
export const PUBLICATION_SELECTED_CLEARED = 'PUBLICATION_SELECTED_CLEARED';
export const PUBLICATION_SELECTED = 'PUBLICATION_SELECTED';
export const USERS_PUBLICATIONS_LOADING = 'USERS_PUBLICATIONS_LOADING';
export const USERS_PUBLICATIONS_LOADED = 'USERS_PUBLICATIONS_LOADED';

// export const USER_PUBLICATIONS_MARKED_NOT_MINE_UPDATING = 'USER_PUBLICATIONS_MARKED_NOT_MINE_UPDATING';
export const USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED = 'USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED';


/**
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function loadUsersPublications(userId) {
    return dispatch => {
        dispatch({type: USERS_PUBLICATIONS_LOADING});
        loadUsersPublicationData(userId).then(data => {
            dispatch({
                type: USERS_PUBLICATIONS_LOADED,
                payload: data
            });
        }).catch((error) => {
            throw(error);
        });
    };
}

/**
 * TODO: Fire off call to endpoint to mark the id's that were marked as not theirs
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function markPublicationsNotMine() {
    return {
        type: USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED,
        payload: {}
    };
}


/**
 * Clear the selected publication
 * @returns {object}
 */
export function clearSelectedPublication() {
    return {
        type: PUBLICATION_SELECTED_CLEARED,
        payload: {}
    };
}

/**
 * Load the selected publication data
 * @returns {number}
 */
export function loadSelectedPublication(id) {
    return {
        type: PUBLICATION_SELECTED,
        payload: id
    };
}

/**
 * Clear the publication search results
 * @returns {object}
 */
export function clearPublicationResults() {
    return {
        type: PUBLICATION_RESULTS_CLEARED,
        payload: {}
    };
}
