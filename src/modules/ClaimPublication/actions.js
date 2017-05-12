// repositories
import {loadUsersPublicationData}  from '../../repositories/claimPublication';

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
