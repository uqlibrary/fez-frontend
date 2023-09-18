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
import { store } from '../config/store';
import { dismissAppAlert } from './app';
import { lastRequest, api } from '../config/axios';

// The below could potentially be applied on a broader scope
// However, judging on how dismissAppAlert is used across the app,
// it's hard to predict if that would suit all scenarios
api.interceptors.response.use(response => {
    try {
        if (lastRequest.url?.includes?.('journals/search')) {
            // dismiss error alert raised for previous error responses
            store.dispatch(dismissAppAlert());
        }
    } finally {
        return response;
    }
});

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
 * @param favourites
 * @param allJournals
 * @return {*}
 */
export const exportJournals = (searchQuery, favourites = false, allJournals = false) => async dispatch => {
    // to prevent all journals being passed down to API as a keyword search
    if (allJournals) {
        delete searchQuery.keywords;
    }
    const requestParams = favourites ? JOURNAL_FAVOURITES_API({ query: searchQuery }) : JOURNAL_SEARCH_API(searchQuery);
    const exportConfig = {
        format: requestParams.options.params.export_to,
        page: requestParams.options.params.page,
    };
    const types = {
        loading: favourites ? actions.EXPORT_FAVOURITE_JOURNALS_LOADING : actions.EXPORT_JOURNALS_LOADING,
        loaded: favourites ? actions.EXPORT_FAVOURITE_JOURNALS_LOADED : actions.EXPORT_JOURNALS_LOADED,
        failed: favourites ? actions.EXPORT_FAVOURITE_JOURNALS_FAILED : actions.EXPORT_JOURNALS_FAILED,
    };

    dispatch({ type: types.loading, payload: exportConfig });

    try {
        // set responseType to blob for the FileSaver.saveAs to work
        const response = await get(requestParams, { responseType: 'blob' });
        promptForDownload(exportConfig.format, response);
        dispatch({ type: types.loaded, payload: exportConfig });
    } catch (error) {
        dispatch({
            type: types.failed,
            payload: { ...exportConfig, errorMessage: error.message },
        });
    }
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
