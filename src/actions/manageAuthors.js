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
import { AUTHOR_API, MANAGE_AUTHORS_LIST_API } from 'repositories/routes';

export function loadAuthorList({ page, pageSize, search }) {
    return async dispatch => {
        dispatch({ type: AUTHOR_LIST_LOADING });

        try {
            const response = await get(MANAGE_AUTHORS_LIST_API({ page, pageSize, query: search }));
            dispatch({
                type: AUTHOR_LIST_LOADED,
            });
            return Promise.resolve({
                data: response.data,
                page: response.current_page - 1,
                totalCount: response.total,
            });
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

            const response = await put(AUTHOR_API({ authorId: newData.aut_id }), {
                ...newData,
                aut_description: oldData.aut_description,
            });

            dispatch({
                type: AUTHOR_ITEM_UPDATE_SUCCESS,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: AUTHOR_ITEM_UPDATE_FAILED,
                payload: e,
            });

            return Promise.reject(e);
        }
    };
}

export function deleteAuthorListItem(oldData) {
    return async dispatch => {
        dispatch({ type: AUTHOR_ITEM_DELETING });

        try {
            const response = await destroy(AUTHOR_API({ authorId: oldData.aut_id }));
            dispatch({
                type: AUTHOR_ITEM_DELETE_SUCCESS,
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
