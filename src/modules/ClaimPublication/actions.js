// repositories
import {getPossibleUnclaimedPublications, postHidePossiblePublications, postClaimPossiblePublication}  from 'repositories/publications';


export const PUBLICATION_RESULTS_CLEARED = 'PUBLICATION_RESULTS_CLEARED';
export const PUBLICATION_SELECTED_CLEARED = 'PUBLICATION_SELECTED_CLEARED';
export const PUBLICATION_SELECTED = 'PUBLICATION_SELECTED';
export const USERS_PUBLICATIONS_LOADING = 'USERS_PUBLICATIONS_LOADING';
export const USERS_PUBLICATIONS_LOADED = 'USERS_PUBLICATIONS_LOADED';

export const CLAIM_SUBMITTING = 'CLAIM_SUBMITTING';
export const CLAIM_SUBMITTED = 'CLAIM_SUBMITTED';
export const CLAIM_SUBMIT_FAILED = 'CLAIM_SUBMIT_FAILED';
export const CLAIM_SUBMIT_RESET = 'CLAIM_SUBMIT_RESET';

// export const USER_PUBLICATIONS_MARKED_NOT_MINE_UPDATING = 'USER_PUBLICATIONS_MARKED_NOT_MINE_UPDATING';
export const USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED = 'USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED';

/**
 * Claims the publication for the user
 * @returns {function(*)}
 */
export function claimPublication(data) {
    return dispatch => {
        console.log('actions/records - claiming....');
        dispatch({type: CLAIM_SUBMITTING});
        postClaimPossiblePublication(data).then((data) => {
            dispatch({
                type: CLAIM_SUBMITTED,
                payload: data
            });
        }).catch(error => {
            dispatch({
                type: CLAIM_SUBMIT_FAILED,
                payload: error
            });
            // throw(error);
        });
    };
}

/**
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function loadUsersPublications(username) {
    return dispatch => {
        dispatch({type: USERS_PUBLICATIONS_LOADING});
        getPossibleUnclaimedPublications(username).then(data => {
            dispatch({
                type: USERS_PUBLICATIONS_LOADED,
                payload: data
            });
        }).catch(() => {
            // throw(error);
            // TODO: dispatch fail action
            dispatch({
                type: USERS_PUBLICATIONS_LOADED,
                payload: []
            });
        });
    };
}

/**
 * Loads the publication types into the application
 * @returns {function(*)}
 */
export function markPublicationsNotMine(username, pids) {
    return dispatch => {
        dispatch({type: USERS_PUBLICATIONS_LOADING});
        postHidePossiblePublications({username, pids}).then(data => {
            dispatch({
                type: USERS_PUBLICATIONS_LOADED,
                payload: data
            });
        }).catch(() => {
            // throw(error);
            // TODO: dispatch fail action
            dispatch({
                type: USERS_PUBLICATIONS_LOADED,
                payload: []
            });
        });
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
 * Clear the publication search results
 * @returns {object}
 */
export function clearPublicationResults() {
    return {
        type: PUBLICATION_RESULTS_CLEARED,
        payload: {}
    };
}

/**
 * Clear the claim publication flags
 * @returns {type: string}
 */
export function claimPublicationReset() {
    return {
        type: CLAIM_SUBMIT_RESET
    };
}
