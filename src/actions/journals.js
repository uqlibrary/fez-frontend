import { get, post } from 'repositories/generic';
import * as actions from './actionTypes';
import { JOURNAL_API, JOURNAL_LOOKUP_API, MASTER_JOURNAL_LIST_INGEST_API } from 'repositories/routes';

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
