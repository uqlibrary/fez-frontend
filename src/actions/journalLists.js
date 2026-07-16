import * as actions from './actionTypes';
import { destroy, get, post, put } from '../repositories';
import { JOURNAL_FAVOURITES_API } from '../repositories/routes';

/**
 * @param searchQuery
 * @returns {AnyAction}
 */
export const loadJournalLists = searchQuery => async dispatch => {
    dispatch({ type: actions.JOURNALS_LISTS_LOADING });
    return get({ apiUrl: '/journals/lists' }).then(
        response => {
            dispatch({ type: actions.JOURNALS_LISTS_SUCCESS, payload: response });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNALS_LISTS_FAILED, payload: error });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param {object} data
 * @return {AnyAction}
 */
export const createJournalList = data => async dispatch => {
    dispatch({ type: actions.JOURNALS_LISTS_LOADING });
    return post({ apiUrl: '/journals/lists' }, data).then(
        response => {
            dispatch({ type: actions.JOURNALS_LISTS_SUCCESS });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNALS_LISTS_FAILED, payload: { message: 'Failed to create list' } });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param {object} data
 * @return {AnyAction}
 */
export const updateJournalList = data => async dispatch => {
    dispatch({ type: actions.JOURNALS_LISTS_LOADING });
    return put({ apiUrl: `/journals/lists/${data.fjl_id}` }, data).then(
        response => {
            dispatch({ type: actions.JOURNALS_LISTS_SUCCESS });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNALS_LISTS_FAILED, payload: { message: 'Failed to update list' } });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param {number} id
 * @return {AnyAction}
 */
export const deleteJournalList = id => async dispatch => {
    dispatch({ type: actions.JOURNALS_LISTS_LOADING });
    return destroy({ apiUrl: `/journals/lists/${id}` }).then(
        response => {
            dispatch({ type: actions.JOURNALS_LISTS_SUCCESS });
            return Promise.resolve(response);
        },
        error => {
            dispatch({ type: actions.JOURNALS_LISTS_FAILED, payload: { message: 'Failed to delete list' } });
            return Promise.reject(error.message);
        },
    );
};

/**
 * @param searchQuery
 * @returns {AnyAction}
 */
export const retrieveFavouriteJournals = searchQuery => async dispatch => {
    dispatch({ type: actions.FAVOURITE_JOURNALS_LOADING });
    return get(JOURNAL_FAVOURITES_API({ query: searchQuery })).then(
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
 * @param {Array<sting|number>} ids
 * @return {AnyAction}
 */
export const addToFavourites = ids => async dispatch => {
    dispatch({ type: actions.FAVOURITE_JOURNALS_ADD_REQUESTING });
    return post(JOURNAL_FAVOURITES_API(), { ids: ids }).then(
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
 * @param ids: string[]
 * @returns {AnyAction}
 */
export const removeFromFavourites = ids => async dispatch => {
    dispatch({ type: actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING });
    return destroy(JOURNAL_FAVOURITES_API(), { ids: ids }).then(
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
