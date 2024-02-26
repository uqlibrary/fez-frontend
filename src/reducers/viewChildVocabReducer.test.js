import { VIEW_CHILD_VOCAB_LOADING, VIEW_CHILD_VOCAB_LOADED, VIEW_CHILD_VOCAB_LOAD_FAILED } from 'actions/actionTypes';

import viewChildVocabReducer from './viewChildVocabReducer';

const initialState = {
    childData: {},
    loadingChildVocab: {},
    loadingChildVocabError: null,
    totalRecords: 0,
};

describe('viewChildVocab reducer', () => {
    it('sets child controlled vocabulary loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            loadingChildVocab: { 453669: true },
            childData: { 453669: { data: [], path: [] } },
        };
        const test = viewChildVocabReducer(previousState, {
            type: VIEW_CHILD_VOCAB_LOADING,
            payload: 'test1',
            rootId: 453669,
            parentId: 453669,
        });
        expect(test).toEqual(expected);
    });

    it('sets child controlled vocabulary loaded state', () => {
        const previousState = {
            ...initialState,
            loadingChildVocab: { 451799: true },
        };
        const expected = {
            ...previousState,
            childData: { 451799: { data: [], path: [] } },
            loadingChildVocab: { 451799: false },
        };
        const test = viewChildVocabReducer(previousState, {
            type: VIEW_CHILD_VOCAB_LOADED,
            payload: { data: {} },
            rootId: 451799,
            parentId: 451799,
        });
        expect(test).toEqual(expected);
    });

    it('sets child controlled vocabulary loaded state with empty payload', () => {
        const previousState = {
            ...initialState,
            loadingChildVocab: { 451799: true },
            childData: {},
        };
        const expected = {
            ...previousState,
            loadingChildVocab: { 451799: false },
        };

        const test = viewChildVocabReducer(previousState, {
            type: VIEW_CHILD_VOCAB_LOADED,
            payload: {},
            rootId: 451799,
            parentId: 451799,
        });
        expect(test).toEqual(expected);
    });

    it('sets child controlled vocabulary failed state', () => {
        const previousState = {
            ...initialState,
            loadingChildVocab: { 451799: true },
        };
        const expected = {
            ...previousState,
            loadingChildVocab: { 451799: false },
            loadingChildVocabError: { error: true },
        };
        const test = viewChildVocabReducer(previousState, {
            type: VIEW_CHILD_VOCAB_LOAD_FAILED,
            payload: {
                error: true,
            },
            rootId: 451799,
            parentId: 451799,
        });
        expect(test).toEqual(expected);
    });
});
