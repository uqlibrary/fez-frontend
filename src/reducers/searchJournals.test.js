import { SEARCH_JOURNALS_LOADING, SEARCH_JOURNALS_LOADED, SEARCH_JOURNALS_FAILED } from 'actions/actionTypes';

import searchJournalReducer from './searchJournals';

const initialState = {
    journalsListLoading: false,
    journalsList: null,
    journalsListLoaded: false,
    journalsListError: false,
};

describe('searchJournals reducer', () => {
    it('sets search loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            journalsListLoading: true,
        };
        const test = searchJournalReducer(previousState, { type: SEARCH_JOURNALS_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets search loaded state', () => {
        const previousState = {
            ...initialState,
            journalsListLoading: true,
        };
        const payload = { data: [] };
        const expected = {
            ...previousState,
            journalsListLoading: false,
            journalsListLoaded: true,
            journalsList: { ...payload },
        };
        const test = searchJournalReducer(previousState, {
            type: SEARCH_JOURNALS_LOADED,
            payload: { ...payload },
        });
        expect(test).toEqual(expected);
    });

    it('sets search failed state', () => {
        const previousState = {
            ...initialState,
            journalsListLoading: true,
        };
        const expected = {
            ...previousState,
            journalsListLoading: false,
            journalsListLoaded: true,
            journalsListError: 'error',
        };
        const test = searchJournalReducer(previousState, {
            type: SEARCH_JOURNALS_FAILED,
            payload: 'error',
        });
        expect(test).toEqual(expected);
    });
});
