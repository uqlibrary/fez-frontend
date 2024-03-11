import {
    VIEW_CHILD_VOCAB_LOADING,
    VIEW_CHILD_VOCAB_LOADED,
    VIEW_CHILD_VOCAB_LOAD_FAILED,
    VOCAB_SET_CURRENT_PAGE,
    VOCAB_SET_PER_PAGE,
} from 'actions/actionTypes';

import viewChildVocabReducer, { findCurrentChild } from './viewChildVocabReducer';
import { vocabsFieldResearch } from 'mock/data/vocabsFieldResearch.js';

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
            currentPage: 0,
            perPage: 10,
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
    it('sets child controlled vocabulary current page', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            currentPage: 1,
        };
        const test = viewChildVocabReducer(previousState, {
            type: VOCAB_SET_CURRENT_PAGE,
            payload: 1,
        });
        expect(test).toEqual(expected);
    });
    it('sets child controlled vocabulary rows per page', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            perPage: -1,
        };
        const test = viewChildVocabReducer(previousState, {
            type: VOCAB_SET_PER_PAGE,
            payload: -1,
        });
        expect(test).toEqual(expected);
    });
});

describe('Test findCurrentChild', () => {
    it('returns the top level when specifying 0', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 0, []);
        expect(list[0].cvr_parent_cvo_id).toEqual(451780);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([]);
    });

    it('returns the top level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451780);
        expect(list[0].cvr_parent_cvo_id).toEqual(451780);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([]);
    });

    it('returns the child level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451799);
        expect(list[0].cvr_parent_cvo_id).toEqual(451799);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([{ id: 451799, title: '01 Mathematical Sciences' }]);
    });

    it('returns the 3rd level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451800, []);
        expect(list[0].cvr_parent_cvo_id).toEqual(451800);
        expect(list[0]).toHaveProperty('controlled_vocab');
        expect(path).toEqual([
            { id: 451799, title: '01 Mathematical Sciences' },
            { id: 451800, title: '0101 Pure Mathematics' },
        ]);
    });

    it('returns the 3rd level empty', () => {
        const [listPureMath, pathPureMath] = findCurrentChild(vocabsFieldResearch.data, 451800, []);
        const [list, path] = findCurrentChild(listPureMath, 4518009, pathPureMath);
        expect(list).toEqual([]);
        expect(path).toEqual([]);
    });

    it('returns the 4th level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 451801, []);
        expect(list).toEqual([]);
        expect(path).toEqual([
            { id: 451799, title: '01 Mathematical Sciences' },
            { id: 451800, title: '0101 Pure Mathematics' },
            { id: 451801, title: '010101 Algebra and Number Theory' },
        ]);
    });

    it('returns the 4th level empty', () => {
        const [listAlgebra, pathAlgebra] = findCurrentChild(vocabsFieldResearch.data, 451801, []);
        const [list, path] = findCurrentChild(listAlgebra, 4518019, pathAlgebra);
        expect(list).toEqual([]);
        expect(path).toEqual([]);
    });

    it('returns [] for []', () => {
        const [list, path] = findCurrentChild([], 451801, []);
        expect(list).toEqual([]);
        expect(path).toEqual([]);
    });

    it('returns [] when can not find at the child and further level', () => {
        const [list, path] = findCurrentChild(vocabsFieldResearch.data, 4518019, []);
        expect(list).toEqual([]);
        expect(path).toEqual([]);
    });
});
