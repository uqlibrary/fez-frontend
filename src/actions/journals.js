import { destroy, get, post } from 'repositories/generic';
import * as actions from './actionTypes';
import {
    JOURNAL_API,
    JOURNAL_FAVOURITES_API,
    JOURNAL_KEYWORDS_LOOKUP_API,
    JOURNAL_LOOKUP_API,
    JOURNAL_SEARCH_API,
    MASTER_JOURNAL_LIST_INGEST_API,
} from 'repositories/routes';

export const loadJournalLookup = searchText => dispatch => {
    dispatch({ type: actions.JOURNAL_LOOKUP_LOADING, payload: searchText });
    return (
        searchText &&
        searchText.trim().length > 0 &&
        get(JOURNAL_LOOKUP_API({ query: searchText })).then(
            response => {
                dispatch({
                    type: actions.JOURNAL_LOOKUP_LOADED,
                    payload: response.data,
                });
                return Promise.resolve(response.data);
            },
            error => {
                dispatch({
                    type: actions.JOURNAL_LOOKUP_FAILED,
                    payload: error.message,
                });
                // return Promise.reject(error.message);
            },
        )
    );
};

export const requestMJLIngest = directory => dispatch => {
    dispatch({ type: actions.MASTER_JOURNAL_LIST_INGEST_REQUESTING, payload: directory });
    return (
        directory &&
        post(MASTER_JOURNAL_LIST_INGEST_API(), directory).then(
            response => {
                dispatch({
                    type: actions.MASTER_JOURNAL_LIST_INGEST_REQUESTED,
                    payload: response.data,
                });
                return Promise.resolve(response.data);
            },
            error => {
                dispatch({
                    type: actions.MASTER_JOURNAL_LIST_INGEST_REQUEST_FAILED,
                    payload: error.message,
                });
                return Promise.reject(error.message);
            },
        )
    );
};

export const loadJournal = id => dispatch => {
    dispatch({ type: actions.JOURNAL_LOADING });
    return (
        id &&
        !isNaN(id) &&
        get(JOURNAL_API({ id })).then(
            response => {
                dispatch({
                    type: actions.JOURNAL_LOADED,
                    payload: response.data,
                });
            },
            error => {
                dispatch({
                    type: actions.JOURNAL_LOAD_FAILED,
                    payload: error.message,
                });
            },
        )
    );
};

export const loadJournalSearchKeywords = searchQuery => async dispatch => {
    dispatch({ type: actions.JOURNAL_SEARCH_KEYWORDS_LOADING });
    try {
        const keywordsResponse = await get(JOURNAL_KEYWORDS_LOOKUP_API({ query: searchQuery }));
        dispatch({ type: actions.JOURNAL_SEARCH_KEYWORDS_LOADED, payload: keywordsResponse.data, query: searchQuery });
    } catch (e) {
        dispatch({ type: actions.JOURNAL_SEARCH_KEYWORDS_FAILED, payload: e });
    }
};

export const clearJournalSearchKeywords = () => ({
    type: actions.CLEAR_JOURNAL_SEARCH_KEYWORDS,
});

export const searchJournals = searchQuery => async dispatch => {
    dispatch({ type: actions.SEARCH_JOURNALS_LOADING });
    try {
        const searchResponse = await get(JOURNAL_SEARCH_API(searchQuery));
        dispatch({ type: actions.SEARCH_JOURNALS_LOADED, payload: searchResponse });
    } catch (e) {
        dispatch({ type: actions.SEARCH_JOURNALS_FAILED, payload: e });
    }
};

export const retrieveFavouriteJournals = () => async dispatch => {
    dispatch({ type: actions.FAVOURITE_JOURNALS_LOADING });
    try {
        const response = await get(JOURNAL_FAVOURITES_API());
        dispatch({ type: actions.FAVOURITE_JOURNALS_LOADED, payload: response });
    } catch (e) {
        dispatch({ type: actions.FAVOURITE_JOURNALS_FAILED, payload: e });
    }
};

export const toggleFavouriteJournal = (id, isFavourite) => async dispatch => {
    dispatch({ type: actions.FAVOURITE_JOURNALS_TOGGLE_REQUESTING, payload: { id } });
    // add a delay to encourage minimizing request load
    await new Promise(resolve => {
        setTimeout(resolve, 200);
    });
    try {
        if (isFavourite) {
            await destroy(JOURNAL_FAVOURITES_API(id));
        } else {
            await post(JOURNAL_FAVOURITES_API(), { fvj_jid: id });
        }
        dispatch({ type: actions.FAVOURITE_JOURNALS_TOGGLE_SUCCESS, payload: { id, isFavourite: !isFavourite } });
    } catch (e) {
        dispatch({ type: actions.FAVOURITE_JOURNALS_TOGGLE_FAILED, payload: { id, e } });
    }
};
