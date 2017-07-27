import {fetchAuthors, fetchCurrentAuthor} from '../repositories';

export const AUTHORS_LOADING = 'AUTHORS_LOADING';
export const AUTHORS_LOAD_FAILED = 'AUTHORS_LOAD_FAILED';
export const AUTHORS_LOADED = 'AUTHORS_LOADED';

export const CURRENT_AUTHOR_LOADING = 'CURRENT_AUTHOR_LOADING';
export const CURRENT_AUTHOR_FAILED = 'CURRENT_AUTHOR_FAILED';
export const CURRENT_AUTHOR_LOADED = 'CURRENT_AUTHOR_LOADED';

export function searchAuthors(query, filterBy) {
    return dispatch => {
        dispatch({type: AUTHORS_LOADING});

        fetchAuthors(query).then((data) => {
            dispatch({
                type: AUTHORS_LOADED,
                payload: filterBy ? data.filter(filterBy) : data
            });
        }).catch(error => {
            dispatch({
                type: AUTHORS_LOAD_FAILED,
                payload: error
            });
        });
    };
}

export function getCurrentAuthor() {
    return dispatch => {
        dispatch({type: CURRENT_AUTHOR_LOADING});

        fetchCurrentAuthor()
            .then((data) => {
                dispatch({
                    type: CURRENT_AUTHOR_LOADED,
                    payload: data
                });
            })
            .catch(() => {
                dispatch({
                    type: CURRENT_AUTHOR_FAILED,
                    payload: {}
                });
            });
    };
}

