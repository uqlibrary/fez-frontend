import * as actions from 'actions/actionTypes';
import favouriteSearchReducer from './favouriteSearch';

export const initialState = {
    favouriteSearchListLoading: true,
    favouriteSearchList: null,
    favouriteSearchListError: null,
};

describe('favourite search reducer', () => {
    it('returns the correct state while favourite search are loading', () => {
        const test = favouriteSearchReducer(initialState, { type: actions.FAVOURITE_SEARCH_LIST_LOADING });
        expect(test.favouriteSearchListLoading).toEqual(true);
    });

    it('returns the correct state when favourite search are loaded', () => {
        const test = favouriteSearchReducer(initialState, {
            type: actions.FAVOURITE_SEARCH_LIST_LOADED,
            payload: [
                {
                    fvs_id: 1,
                },
            ],
        });

        expect(test.favouriteSearchListLoading).toEqual(false);
        expect(test.favouriteSearchList).toEqual([{ fvs_id: 1 }]);
        expect(test.favouriteSearchListError).toEqual(null);
    });

    it('returns the correct state when favourite search fails to load data', () => {
        const test = favouriteSearchReducer(initialState, {
            type: actions.FAVOURITE_SEARCH_LIST_FAILED,
            payload: {
                status: 500,
                message: 'Test error',
            },
        });
        expect(test.favouriteSearchListLoading).toEqual(false);
        expect(test.favouriteSearchList).toEqual(null);
        expect(test.favouriteSearchListError).toEqual({ status: 500, message: 'Test error' });
    });

    it('returns the state when an invalid action type is supplied', () => {
        const test = favouriteSearchReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
