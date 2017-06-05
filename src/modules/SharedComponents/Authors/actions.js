// Types
export const REMOVE_AUTHOR = 'REMOVE_AUTHOR';
export const ADD_AUTHOR = 'ADD_AUTHOR';
export const CLEAR_AUTHORS = 'CLEAR_AUTHORS';

export function removeAuthor(authorIndex) {
    return dispatch => {
        dispatch({
            type: REMOVE_AUTHOR,
            payload: authorIndex
        });
    };
}

export function addAuthor(author) {
    return dispatch => {
        dispatch({
            type: ADD_AUTHOR,
            payload: author
        });
    };
}

export function clearAuthors() {
    return dispatch => {
        dispatch({
            type: CLEAR_AUTHORS,
            payload: {}
        });
    };
}
