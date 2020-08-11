import {
    FAVOURITE_SEARCH_ADDING,
    FAVOURITE_SEARCH_ADD_SUCCESS,
    FAVOURITE_SEARCH_ADD_FAILED,
    FAVOURITE_SEARCH_LIST_LOADING,
    FAVOURITE_SEARCH_LIST_LOADED,
    FAVOURITE_SEARCH_LIST_FAILED,
    FAVOURITE_SEARCH_ITEM_UPDATING,
    FAVOURITE_SEARCH_ITEM_UPDATE_SUCCESS,
    FAVOURITE_SEARCH_ITEM_UPDATE_FAILED,
    FAVOURITE_SEARCH_ITEM_DELETING,
    FAVOURITE_SEARCH_ITEM_DELETE_SUCCESS,
    FAVOURITE_SEARCH_ITEM_DELETE_FAILED,
    EXISTING_ALIAS_CHECK_IN_PROGRESS,
    EXISTING_ALIAS_FOUND,
    EXISTING_ALIAS_NOT_FOUND,
    EXISTING_ALIAS_CHECK_FAILED,
} from './actionTypes';
import { get, put, destroy, post } from 'repositories/generic';
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

export function checkForExistingFavouriteSearchAlias(newData) {
    return async dispatch => {
        dispatch({ type: EXISTING_ALIAS_CHECK_IN_PROGRESS });
        try {
            const response = await get(FAVOURITE_SEARCH_LIST_API({ id: newData.fvs_alias }));
            // successful response means api found existing alias
            dispatch({
                type: EXISTING_ALIAS_FOUND,
                payload: response.data.fvs_alias,
            });
            // reject the promise to indicate that it's not OK to go ahead with saving favourite search
            return Promise.reject({ message: 'Alias found' });
        } catch (e) {
            // api returns 404 if alias has not found
            if (e.status === 404) {
                dispatch({
                    type: EXISTING_ALIAS_NOT_FOUND,
                });

                // resolve promise to indicate that it's OK to go ahead with saving favourite search
                return Promise.resolve();
            } else {
                dispatch({
                    type: EXISTING_ALIAS_CHECK_FAILED,
                    payload: e,
                });
                return Promise.reject(e);
            }
        }
    };
}

export function updateFavouriteSearchListItem(newData, oldData) {
    return async dispatch => {
        // check for existing alias if alias has changed from previous value
        if (newData.fvs_alias !== oldData.fvs_alias) {
            await dispatch(checkForExistingFavouriteSearchAlias(newData));
        }

        // go ahead with updating favourite search list item
        try {
            dispatch({ type: FAVOURITE_SEARCH_ITEM_UPDATING });

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

export function addFavouriteSearch(data) {
    return async dispatch => {
        dispatch({ type: FAVOURITE_SEARCH_ADDING });

        try {
            const response = await post(FAVOURITE_SEARCH_LIST_API(), data);
            dispatch({
                type: FAVOURITE_SEARCH_ADD_SUCCESS,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: FAVOURITE_SEARCH_ADD_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}
