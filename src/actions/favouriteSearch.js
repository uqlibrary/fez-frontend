import {
    FAVOURITE_SEARCH_LIST_LOADING,
    FAVOURITE_SEARCH_LIST_LOADED,
    FAVOURITE_SEARCH_LIST_FAILED,
    FAVOURITE_SEARCH_ITEM_UPDATING,
    FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS,
    FAVOURITE_SEARCH_ITEM_UPDATE_FAILED,
    FAVOURITE_SEARCH_ITEM_DELETING,
    FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS,
    FAVOURITE_SEARCH_ITEM_DELETE_FAILED,
} from './actionTypes';
import { get, put, destroy } from 'repositories/generic';
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

export function updateFavouriteSearchListItem(newData, oldData) {
    return async dispatch => {
        dispatch({ type: FAVOURITE_SEARCH_ITEM_UPDATING });

        try {
            const response = await put(FAVOURITE_SEARCH_LIST_API({ id: newData.fvs_id }), newData);
            dispatch({
                type: FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS,
                payload: response.data,
                oldData,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: FAVOURITE_SEARCH_ITEM_UPDATE_FAILED,
                payload: e,
                oldData,
            });

            return Promise.reject(e);
        }
    };
}

export function deleteFavouriteSearchListItem(oldData) {
    return async dispatch => {
        dispatch({ type: FAVOURITE_SEARCH_ITEM_DELETING });

        try {
            const response = await destroy(FAVOURITE_SEARCH_LIST_API({ id: oldData.fvs_id }));
            dispatch({
                type: FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS,
                payload: oldData,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: FAVOURITE_SEARCH_ITEM_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}
