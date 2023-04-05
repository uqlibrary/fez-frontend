import * as actions from './actionTypes';
import { get } from 'repositories/generic';
import { ORGANISATIONAL_UNITS, SUGGESTED_ORGANISATIONAL_UNITS } from 'repositories/routes';

/**
 * Load List of Organisational Units
 * @returns {action}
 */
export function loadOrganisationalUnits() {
    return dispatch => {
        dispatch({ type: actions.ORGANISATIONAL_UNITS_LOADING });
        return get(ORGANISATIONAL_UNITS())
            .then(response => {
                dispatch({
                    type: actions.ORGANISATIONAL_UNITS_LOADED,
                    payload: response,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.ORGANISATIONAL_UNITS_FAILED,
                    payload: error,
                });
            });
    };
}

// export function clearOrganisationalUnits() {
//     return dispatch => {
//         dispatch({ type: actions.ORGANISATIONAL_UNITS_CLEARED });
//     };
// }

/**
 * Load List of Suggested Organisational Units by author id
 * @returns {action}
 */
export function loadSuggestedOrganisationalUnitByAuthorId(authorId) {
    return dispatch => {
        dispatch({ type: actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADING, authorId });
        return get(SUGGESTED_ORGANISATIONAL_UNITS({ authorId }))
            .then(response => {
                dispatch({
                    type: actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADED,
                    payload: response,
                    authorId,
                });

                return Promise.resolve(response);
            })
            .catch(error => {
                dispatch({
                    type: actions.SUGGESTED_ORGANISATIONAL_UNITS_FAILED,
                    payload: error,
                });
            });
    };
}

export function clearSuggestedOrganisationalUnits() {
    return dispatch => {
        dispatch({ type: actions.SUGGESTED_ORGANISATIONAL_UNITS_CLEARED });
    };
}
