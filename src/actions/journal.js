import { get } from 'repositories/generic';
import * as actions from './actionTypes';
import { JOURNAL_LOOKUP_API } from 'repositories/routes';

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
