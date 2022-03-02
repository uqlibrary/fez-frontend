import * as actions from 'actions/actionTypes';
import favouriteJournalsReducer, { initialState } from './favouriteJournals';

describe('favourite journals search reducer', () => {
    it('loading', () => {
        const test = favouriteJournalsReducer(initialState, { type: actions.FAVOURITE_JOURNALS_LOADING });
        expect(test).toEqual({ ...initialState, loading: true });
    });

    it('loaded', () => {
        const payload = [1, 2, 3];
        const test = favouriteJournalsReducer(initialState, {
            type: actions.FAVOURITE_JOURNALS_LOADED,
            payload: payload,
        });

        expect(test).toEqual({ ...initialState, response: payload });
    });

    it('error', () => {
        const error = {
            status: 500,
            message: 'Test error',
        };
        const test = favouriteJournalsReducer(initialState, {
            type: actions.FAVOURITE_JOURNALS_FAILED,
            payload: error,
        });
        expect(test).toEqual({ ...initialState, error: error.message });
    });

    it('invalid', () => {
        const test = favouriteJournalsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('add', () => {
        const test = favouriteJournalsReducer(initialState, { type: actions.FAVOURITE_JOURNALS_ADD_REQUESTING });
        expect(test).toEqual({ ...initialState, add: { ...initialState.add, loading: true } });
    });

    it('added', () => {
        const test = favouriteJournalsReducer(initialState, { type: actions.FAVOURITE_JOURNALS_ADD_SUCCESS });
        expect(test).toEqual({ ...initialState, add: { ...initialState.add, loading: false } });
    });

    it('add error', () => {
        const payload = {
            status: 500,
            message: 'Test error',
        };
        const test = favouriteJournalsReducer(initialState, {
            type: actions.FAVOURITE_JOURNALS_ADD_FAILED,
            payload: payload,
        });
        expect(test).toEqual({ ...initialState, add: { ...initialState.add, error: payload.message } });
    });

    it('remove', () => {
        const test = favouriteJournalsReducer(initialState, { type: actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING });
        expect(test).toEqual({ ...initialState, remove: { ...initialState.remove, loading: true } });
    });

    it('removed', () => {
        const test = favouriteJournalsReducer(initialState, { type: actions.FAVOURITE_JOURNALS_REMOVE_SUCCESS });
        expect(test).toEqual({ ...initialState, remove: { ...initialState.remove, loading: false } });
    });

    it('remove error', () => {
        const payload = {
            status: 500,
            message: 'Test error',
        };
        const test = favouriteJournalsReducer(initialState, {
            type: actions.FAVOURITE_JOURNALS_REMOVE_FAILED,
            payload: payload,
        });
        expect(test).toEqual({ ...initialState, remove: { ...initialState.remove, error: payload.message } });
    });
});
