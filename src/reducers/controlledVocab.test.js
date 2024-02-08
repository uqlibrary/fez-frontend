import { VIEW_VOCAB_LOADING, VIEW_VOCAB_LOADED, VIEW_VOCAB_LOAD_FAILED, SET_OPENED_VOCAB } from 'actions/actionTypes';

import viewVocabReducer from './controlledVocab';

const initialState = {
    vocabList: [],
    loadingVocab: false,
    loadingVocabError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

describe('viewVocab reducer', () => {
    it('sets controlled vocabulary loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            loadingVocab: true,
        };
        const test = viewVocabReducer(previousState, { type: VIEW_VOCAB_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets controlled vocabulary loaded state', () => {
        const previousState = {
            ...initialState,
            loadingVocab: true,
        };
        const expected = {
            ...previousState,
            vocabList: [{ item: 'test' }],
            loadingVocab: false,
            startRecord: 1,
            endRecord: 10,
            totalRecords: 10,
        };
        const test = viewVocabReducer(previousState, {
            type: VIEW_VOCAB_LOADED,
            payload: {
                per_page: 10,
                page: 1,
                current_page: 1,
                from: 1,
                to: 10,
                total: 10,
                data: [{ item: 'test' }],
            },
        });
        expect(test).toEqual(expected);
    });

    it('sets controlled vocabulary failed state', () => {
        const previousState = {
            ...initialState,
            loadingVocab: true,
        };
        const expected = {
            ...previousState,
            loadingVocab: false,
            loadingVocabError: { error: true },
        };
        const test = viewVocabReducer(previousState, {
            type: VIEW_VOCAB_LOAD_FAILED,
            payload: {
                error: true,
            },
        });
        expect(test).toEqual(expected);
    });

    it('sets controlled vocabulary children close', () => {
        const previousState = {
            ...initialState,
            vocabOpened: [1],
        };
        const expected = {
            ...previousState,
            vocabOpened: [],
        };
        const test = viewVocabReducer(previousState, {
            type: SET_OPENED_VOCAB,
            payload: {
                open: false,
                id: 1,
            },
        });
        expect(test).toEqual(expected);
    });

    it('sets controlled vocabulary children open', () => {
        const previousState = {
            ...initialState,
            vocabOpened: [],
        };
        const expected = {
            ...previousState,
            vocabOpened: [1],
        };
        const test = viewVocabReducer(previousState, {
            type: SET_OPENED_VOCAB,
            payload: {
                open: true,
                id: 1,
            },
        });
        expect(test).toEqual(expected);
    });
});
