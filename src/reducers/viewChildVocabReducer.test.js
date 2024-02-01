import { VIEW_CHILD_VOCAB_LOADING, VIEW_CHILD_VOCAB_LOADED, VIEW_CHILD_VOCAB_LOAD_FAILED } from 'actions/actionTypes';

import viewChildVocabReducer from './viewChildVocabReducer';

const initialState = {
    openedVocabLists: [],
    loadingChildVocab: false,
    loadingChildVocabError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

describe('viewChildVocab reducer', () => {
    it('sets child controlled vocabulary loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            loadingChildVocab: true,
        };
        const test = viewChildVocabReducer(previousState, { type: VIEW_CHILD_VOCAB_LOADING, payload: 'test1' });
        expect(test).toEqual(expected);
    });

    it('sets child controlled vocabulary loaded state', () => {
        const previousState = {
            ...initialState,
            loadingChildVocab: true,
        };
        const expected = {
            ...previousState,
            openedVocabLists: [
                {
                    total: 1,
                    data: [{ item: 'test' }],
                },
            ],
            loadingChildVocab: false,
        };
        const test = viewChildVocabReducer(previousState, {
            type: VIEW_CHILD_VOCAB_LOADED,
            payload: {
                total: 1,
                data: [{ item: 'test' }],
            },
        });
        expect(test).toEqual(expected);
    });

    it('sets child controlled vocabulary loaded state with empty payload', () => {
        const previousState = {
            ...initialState,
            loadingChildVocab: true,
            openedVocabLists: [
                {
                    total: 1,
                    data: [{ item: 'test' }],
                },
            ],
        };
        const expected = {
            ...previousState,
            loadingChildVocab: false,
        };

        const test = viewChildVocabReducer(previousState, {
            type: VIEW_CHILD_VOCAB_LOADED,
            payload: {},
        });
        expect(test).toEqual(expected);
    });

    it('sets child controlled vocabulary failed state', () => {
        const previousState = {
            ...initialState,
            loadingChildVocab: true,
        };
        const expected = {
            ...previousState,
            loadingChildVocab: false,
            loadingChildVocabError: { error: true },
        };
        const test = viewChildVocabReducer(previousState, {
            type: VIEW_CHILD_VOCAB_LOAD_FAILED,
            payload: {
                error: true,
            },
        });
        expect(test).toEqual(expected);
    });
});
