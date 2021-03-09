import {
    AUTHOR_ADDING,
    AUTHOR_ADD_SUCCESS,
    AUTHOR_ADD_FAILED,
    AUTHOR_LIST_LOADING,
    AUTHOR_LIST_LOADED,
    AUTHOR_LIST_FAILED,
    AUTHOR_ITEM_UPDATING,
    AUTHOR_ITEM_UPDATE_SUCCESS,
    AUTHOR_ITEM_UPDATE_FAILED,
    AUTHOR_ITEM_DELETING,
    AUTHOR_ITEM_DELETE_SUCCESS,
    AUTHOR_ITEM_DELETE_FAILED,
} from './actionTypes';
import { get, put, destroy, post } from 'repositories/generic';
import { AUTHORS_SEARCH_API, AUTHOR_API } from 'repositories/routes';

export function loadAuthorList() {
    return async dispatch => {
        dispatch({ type: AUTHOR_LIST_LOADING });

        try {
            const response = await get(AUTHORS_SEARCH_API());
            dispatch({
                type: AUTHOR_LIST_LOADED,
                payload: response,
            });

            return Promise.resolve(response);
        } catch (e) {
            dispatch({
                type: AUTHOR_LIST_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function updateAuthorListItem(newData, oldData) {
    return async dispatch => {
        try {
            dispatch({ type: AUTHOR_ITEM_UPDATING });

            const response = await put(AUTHOR_API({ id: newData.aut_id }), newData);

            dispatch({
                type: AUTHOR_ITEM_UPDATE_SUCCESS,
                payload: response.data,
                oldData,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: AUTHOR_ITEM_UPDATE_FAILED,
                payload: e,
                oldData,
            });

            return Promise.reject(e);
        }
    };
}

export function deleteAuthorListItem(oldData) {
    return async dispatch => {
        dispatch({ type: AUTHOR_ITEM_DELETING });

        try {
            const response = await destroy(AUTHOR_API({ id: oldData.aut_id }));
            dispatch({
                type: AUTHOR_ITEM_DELETE_SUCCESS,
                payload: oldData,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: AUTHOR_ITEM_DELETE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function addAuthor(data) {
    return async dispatch => {
        dispatch({ type: AUTHOR_ADDING });

        try {
            const response = await post(AUTHOR_API(), data);
            dispatch({
                type: AUTHOR_ADD_SUCCESS,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: AUTHOR_ADD_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}
