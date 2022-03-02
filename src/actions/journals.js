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
import { promptForDownload } from './exportPublicationsDataTransformers';

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
                return Promise.reject(error);
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

/**
 * Reusable export journals action
 *
 * @param searchQuery
 * @return {*}
 */
export const exportJournals = searchQuery => async dispatch => {
    const requestParams = JOURNAL_SEARCH_API(searchQuery);
    const exportConfig = {
        format: requestParams.options.params.export_to,
        page: requestParams.options.params.page,
    };

    dispatch({
        type: actions.EXPORT_JOURNALS_LOADING,
        payload: exportConfig,
    });

    try {
        // set responseType to blob for the FileSaver.saveAs to work
        const response = await get(requestParams, { responseType: 'blob' });
        promptForDownload(exportConfig.format, response);
        dispatch({
            type: actions.EXPORT_JOURNALS_LOADED,
            payload: exportConfig,
        });
    } catch (error) {
        dispatch({
            type: actions.EXPORT_JOURNALS_FAILED,
            payload: {
                ...exportConfig,
                errorMessage: error.message,
            },
        });
    }
};

export const resetExportJournalsStatus = () => {
    return dispatch => {
        dispatch({
            type: actions.EXPORT_JOURNALS_RESET,
        });
    };
};

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

const randomWait = async (min, max) => {
    // add a rand delay of 200ms max to avoid requests hitting the api at the exact same time
    const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    await new Promise(resolve => {
        setTimeout(resolve, 100 + random(min, max));
    });
};

export const addToFavourites = ids => async dispatch => {
    dispatch({ type: actions.FAVOURITE_JOURNALS_ADD_REQUESTING });
    await randomWait(50, 100);
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

export const removeFromFavourites = ids => async dispatch => {
    dispatch({ type: actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING });
    await randomWait(50, 100);
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
