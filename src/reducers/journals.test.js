import {
    JOURNAL_LOOKUP_LOADING,
    JOURNAL_LOOKUP_LOADED,
    JOURNAL_LOOKUP_FAILED,
    JOURNAL_LOADED,
    JOURNAL_LOADING,
    JOURNAL_LOAD_FAILED,
} from 'actions/actionTypes';

import journalReducer from './journals';

const initialState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
    journalDetails: false,
    journalLoading: false,
    journalLoadingError: false,
};

describe('journalReducer reducer', () => {
    it('sets lookup loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            itemsLoading: true,
        };
        const test = journalReducer(previousState, { type: JOURNAL_LOOKUP_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets lookup loaded state', () => {
        const previousState = {
            ...initialState,
            itemsLoading: true,
        };
        const expected = {
            ...previousState,
            itemsLoading: false,
            itemsList: [
                {
                    test: 'test1',
                },
            ],
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOOKUP_LOADED,
            payload: [
                {
                    test: 'test1',
                },
            ],
        });
        expect(test).toEqual(expected);
    });

    it('sets lookup failed state', () => {
        const previousState = {
            ...initialState,
            itemsLoading: true,
        };
        const expected = {
            ...previousState,
            itemsLoading: false,
            itemsLoadingError: true,
            itemsList: [],
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOOKUP_FAILED,
        });
        expect(test).toEqual(expected);
    });

    it('sets details loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            journalLoading: true,
        };
        const test = journalReducer(previousState, { type: JOURNAL_LOADING });
        expect(test).toEqual(expected);
    });

    it('sets details loaded state', () => {
        const previousState = {
            ...initialState,
            journalLoading: true,
        };
        const expected = {
            ...previousState,
            journalDetails: [
                {
                    test: 'test1',
                },
            ],
            journalLoading: false,
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOADED,
            payload: [
                {
                    test: 'test1',
                },
            ],
        });
        expect(test).toEqual(expected);
    });

    it('sets details load failed state', () => {
        const previousState = {
            ...initialState,
            journalLoading: true,
        };
        const expected = {
            ...previousState,
            journalLoading: false,
            journalLoadingError: true,
        };
        const test = journalReducer(previousState, {
            type: JOURNAL_LOAD_FAILED,
        });
        expect(test).toEqual(expected);
    });
});
