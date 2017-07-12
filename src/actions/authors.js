import {fetchAuthors} from '../repositories';

export const AUTHORS_LOADING = 'AUTHORS_LOADING';
export const AUTHORS_LOAD_FAILED = 'AUTHORS_LOAD_FAILED';
export const AUTHORS_LOADED = 'AUTHORS_LOADED';

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
