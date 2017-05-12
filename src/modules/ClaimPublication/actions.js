// repositories
import {loadUsersPublicationData}  from '../../repositories/claimPublication';

// export const USER_PUBLICATIONS_MARKED_NOT_MINE_UPDATING = 'USER_PUBLICATIONS_MARKED_NOT_MINE_UPDATING';
export const USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED = 'USER_PUBLICATIONS_MARKED_NOT_MINE_COMPLETED';

// module imports
import {USERS_PUBLICATIONS_LOADING, USERS_PUBLICATIONS_LOADED} from '../Forms/ClaimPublication/actions';

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
