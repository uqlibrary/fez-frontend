import * as actions from './actionTypes';

export function updateAdminAuthors(authors) {
    return dispatch => {
        dispatch({ type: actions.ADMIN_AUTHORS_UPDATED, payload: authors });
    };
}
