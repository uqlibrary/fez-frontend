import {
    APP_ALERT_HIDE,
    AUTHOR_ADD_FAILED,
    AUTHOR_ADD_SUCCESS,
    AUTHOR_ADDING,
    AUTHOR_ITEM_DELETE_FAILED,
    AUTHOR_ITEM_DELETE_SUCCESS,
    AUTHOR_ITEM_DELETING,
    AUTHOR_ITEM_UPDATE_FAILED,
    AUTHOR_ITEM_UPDATE_SUCCESS,
    AUTHOR_ITEM_UPDATING,
    AUTHOR_LIST_FAILED,
    AUTHOR_LIST_LOADED,
    AUTHOR_LIST_LOADING,
    AUTHOR_CLEAR_ALERTS,
    BULK_AUTHOR_ITEMS_DELETE_FAILED,
    BULK_AUTHOR_ITEMS_DELETE_SUCCESS,
    BULK_AUTHOR_ITEMS_DELETING,
    CHECKING_EXISTING_AUTHOR,
    CHECKING_EXISTING_AUTHOR_FAILED,
    EXISTING_AUTHOR_FOUND,
    EXISTING_AUTHOR_NOT_FOUND,
    SCOPUS_INGEST_REQUEST_FAILED,
    SCOPUS_INGEST_REQUEST_SUCCESS,
    SCOPUS_INGEST_REQUESTING,
} from './actionTypes';
import { destroy, get, post, put } from 'repositories/generic';
import { AUTHOR_API, AUTHORS_SEARCH_API, INGEST_WORKS_API, MANAGE_AUTHORS_LIST_API } from 'repositories/routes';
import { createSentryFriendlyError } from '../config/axios';

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

export function updateAuthorListItem(newData) {
    return async dispatch => {
        try {
            dispatch({ type: AUTHOR_ITEM_UPDATING });

            const response = await put(AUTHOR_API({ authorId: newData.aut_id }), {
                ...newData,
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
                payload: e.data,
            });

            return Promise.reject(e);
        }
    };
}

export function bulkDeleteAuthorListItems(oldData) {
    return async dispatch => {
        dispatch({ type: BULK_AUTHOR_ITEMS_DELETING });
        const authorIds = oldData.map(author => author.aut_id);
        const ids = new URLSearchParams();
        authorIds.map(id => ids.append('aut_ids[]', id));
        try {
            const response = await post(AUTHOR_API({ authorIds }), ids);
            dispatch({
                type: BULK_AUTHOR_ITEMS_DELETE_SUCCESS,
                payload: response.data,
            });

            return Promise.resolve(response.data);
        } catch (e) {
            dispatch({
                type: BULK_AUTHOR_ITEMS_DELETE_FAILED,
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

export function checkForExistingAuthor(search, searchField, id, validation, asyncErrors) {
    let exceptionCaught = true;
    return async dispatch => {
        dispatch({ type: CHECKING_EXISTING_AUTHOR });
        return get(AUTHORS_SEARCH_API({ query: search }))
            .then(response => {
                exceptionCaught = false;
                if (
                    response.total > 0 &&
                    response.data.filter(author => author.aut_id !== id && author[searchField] === search).length > 0
                ) {
                    dispatch({
                        type: EXISTING_AUTHOR_FOUND,
                    });
                    return Promise.reject(
                        createSentryFriendlyError(validation[searchField], {
                            ...asyncErrors,
                            [searchField]: validation[searchField],
                        }),
                    );
                } else {
                    dispatch({
                        type: EXISTING_AUTHOR_NOT_FOUND,
                    });
                    if (!!asyncErrors && Object.keys(asyncErrors).length > 0) {
                        // eslint-disable-next-line no-unused-vars
                        const { [searchField]: discardKey, ...restAsyncErrors } = asyncErrors;
                        return Promise.reject(
                            createSentryFriendlyError(validation[searchField], { ...restAsyncErrors }),
                        );
                    } else {
                        return Promise.resolve();
                    }
                }
            })
            .catch(e => {
                if (exceptionCaught) {
                    dispatch({
                        type: CHECKING_EXISTING_AUTHOR_FAILED,
                        payload: e,
                    });
                }

                return Promise.reject(e);
            });
    };
}

export function ingestFromScopus(autId) {
    return async dispatch => {
        dispatch({ type: SCOPUS_INGEST_REQUESTING });

        try {
            const response = await post(INGEST_WORKS_API(), { aut_id: autId, source: 'scopus' });

            dispatch({
                type: SCOPUS_INGEST_REQUEST_SUCCESS,
                payload: response.data,
            });

            return Promise.resolve();
        } catch (e) {
            dispatch({
                type: SCOPUS_INGEST_REQUEST_FAILED,
                payload: e.message,
            });

            return Promise.reject(e);
        }
    };
}
/* istanbul ignore next */
export function clearAuthorAlerts() {
    return dispatch => {
        dispatch({ type: AUTHOR_CLEAR_ALERTS });
        dispatch({ type: APP_ALERT_HIDE });
    };
}
