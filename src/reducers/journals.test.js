import { JOURNAL_LOOKUP_LOADING, JOURNAL_LOOKUP_LOADED, JOURNAL_LOOKUP_FAILED } from 'actions/actionTypes';

import journalReducer from './journals';

const initialState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
};

describe('journalReducer reducer', () => {
    it('sets loading state', () => {
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

    it('sets loaded state', () => {
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

    it('sets load failed state', () => {
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
});
