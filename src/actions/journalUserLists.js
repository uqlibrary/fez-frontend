import * as actions from './actionTypes';
import { destroy, get, post, put } from '../repositories';
import { JOURNAL_USER_LIST_ITEMS_API, JOURNAL_USE_LISTS_API } from '../repositories/routes';

/**
 * @param searchQuery
 * @returns {AnyAction}
 */
export const loadLists = () => async dispatch => {
    dispatch({ type: actions.JOURNAL_USER_LISTS_LOADING });
    return get(JOURNAL_USE_LISTS_API()).then(
        response => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_SUCCESS, payload: response });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_FAILED, payload: error });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param {object} data
 * @return {AnyAction}
 */
export const createList = data => async dispatch => {
    dispatch({ type: actions.JOURNAL_USER_LISTS_LOADING });
    return post(JOURNAL_USE_LISTS_API(), data).then(
        response => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_SUCCESS });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_FAILED, payload: { message: 'Failed to create list' } });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param {object} data
 * @return {AnyAction}
 */
export const updateList = data => async dispatch => {
    dispatch({ type: actions.JOURNAL_USER_LISTS_LOADING });
    return put(JOURNAL_USE_LISTS_API(data.fjl_id), data).then(
        response => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_SUCCESS });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_FAILED, payload: { message: 'Failed to update list' } });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param {number} id
 * @return {AnyAction}
 */
export const deleteList = id => async dispatch => {
    dispatch({ type: actions.JOURNAL_USER_LISTS_LOADING });
    return destroy(JOURNAL_USE_LISTS_API(id)).then(
        response => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_SUCCESS });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNAL_USER_LISTS_FAILED, payload: { message: 'Failed to delete list' } });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param {{id: string|number|undefined|null, searchQuery?: *}} props
 * @returns {AnyAction}
 */
export const loadListItems =
    ({ id, searchQuery = {} }) =>
    async dispatch => {
        dispatch({ type: actions.FAVOURITE_JOURNALS_LOADING });
        return get(JOURNAL_USER_LIST_ITEMS_API({ id, query: searchQuery })).then(
            response => {
                dispatch({ type: actions.FAVOURITE_JOURNALS_LOADED, payload: response });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.FAVOURITE_JOURNALS_FAILED, payload: error });
                return Promise.reject(error.message);
            },
        );
    };

/**
 * @param {{id: string|number|undefined|null, ids: Array<string|number>}} ids
 * @return {AnyAction}
 */
export const addListItems =
    ({ id, ids }) =>
    async dispatch => {
        dispatch({ type: actions.FAVOURITE_JOURNALS_ADD_REQUESTING });
        return post(JOURNAL_USER_LIST_ITEMS_API({ id }), { ids }).then(
            response => {
                dispatch({ type: actions.FAVOURITE_JOURNALS_ADD_SUCCESS });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.FAVOURITE_JOURNALS_ADD_FAILED, payload: error });
                return Promise.reject(error.message);
            },
        );
    };

/**
 * @param {{id: string|number|undefined|null, ids: Array<string|number>}} ids
 * @returns {AnyAction}
 */
export const deleteListItems =
    ({ id, ids }) =>
    async dispatch => {
        dispatch({ type: actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING });
        return destroy(JOURNAL_USER_LIST_ITEMS_API({ id }), { ids }).then(
            response => {
                dispatch({ type: actions.FAVOURITE_JOURNALS_REMOVE_SUCCESS });
                return Promise.resolve(response);
            },
            error => {
                dispatch({ type: actions.FAVOURITE_JOURNALS_REMOVE_FAILED, payload: error });
                return Promise.reject(error.message);
            },
        );
    };
