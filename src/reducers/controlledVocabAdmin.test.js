import * as actions from 'actions/actionTypes';

import vocabAdminReducer from './controlledVocabAdmin';

const initialState = {
    vocab: null,
    vocabAdminBusy: false,
    vocabAdminSuccess: null,
    vocabAdminError: null,
};

describe('vocabAdminReducer', () => {
    // Test the initial state
    test('should return the initial state', () => {
        expect(vocabAdminReducer(undefined, {})).toEqual(initialState);
    });

    // Test the VOCAB_ADMIN_BUSY action
    test('should handle VOCAB_ADMIN_BUSY', () => {
        const action = { type: actions.VOCAB_ADMIN_BUSY };
        const expectedState = {
            ...initialState,
            vocabAdminBusy: true,
        };
        expect(vocabAdminReducer(initialState, action)).toEqual(expectedState);
    });

    // Test the VOCAB_ADMIN_SUCCESS action
    test('should handle VOCAB_ADMIN_SUCCESS', () => {
        const action = {
            type: actions.VOCAB_ADMIN_SUCCESS,
            payload: { data: 'some vocab data' },
        };
        const expectedState = {
            ...initialState,
            vocabAdminBusy: false,
            vocabAdminSuccess: true,
            vocab: 'some vocab data',
        };
        expect(vocabAdminReducer(initialState, action)).toEqual(expectedState);
    });

    // Test the VOCAB_ADMIN_ACTION action
    test('should handle VOCAB_ADMIN_ACTION', () => {
        const action = {
            type: actions.VOCAB_ADMIN_ACTION,
            payload: 'some vocab action',
        };
        const expectedState = {
            ...initialState,
            vocab: 'some vocab action',
        };
        expect(vocabAdminReducer(initialState, action)).toEqual(expectedState);
    });

    // Test the VOCAB_ADMIN_FAILED action
    test('should handle VOCAB_ADMIN_FAILED', () => {
        const action = {
            type: actions.VOCAB_ADMIN_FAILED,
            payload: 'some vocab error',
        };
        const expectedState = {
            ...initialState,
            vocabAdminBusy: false,
            vocabAdminError: 'some vocab error',
        };
        expect(vocabAdminReducer(initialState, action)).toEqual(expectedState);
    });

    // Test the VOCAB_ADMIN_CLEAR action
    test('should handle VOCAB_ADMIN_CLEAR', () => {
        const action = { type: actions.VOCAB_ADMIN_CLEAR };
        expect(vocabAdminReducer(initialState, action)).toEqual(initialState);
    });
});
