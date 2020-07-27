import {
    FAVOURITE_SEARCH_LIST_LOADING,
    FAVOURITE_SEARCH_LIST_LOADED,
    FAVOURITE_SEARCH_LIST_FAILED,
} from './actionTypes';
import { get } from 'repositories/generic';
import { FAVOURITE_SEARCH_LIST_API } from 'repositories/routes';

export function loadFavouriteSearchList() {
    return async dispatch => {
        dispatch({ type: FAVOURITE_SEARCH_LIST_LOADING });

        try {
            const response = await get(FAVOURITE_SEARCH_LIST_API());
            dispatch({
                type: FAVOURITE_SEARCH_LIST_LOADED,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: FAVOURITE_SEARCH_LIST_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}
