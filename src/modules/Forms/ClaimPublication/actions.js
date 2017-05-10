// module imports
import {showSnackbar} from 'modules/App';

/**
 * Shows the cancel message within the snackbar
 * @returns {function(*)}
 */
export function cancelThisPublicationClaim(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}

/**
 * Shows the claim publication message within the snackbar
 * @returns {function(*)}
 */
export function claimThisPublication(message) {
    return dispatch => {
        dispatch(showSnackbar(message));
    };
}
