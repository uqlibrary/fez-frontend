import * as actions from 'actions/actionTypes';
import authorsReducer from './authors';

describe('Authors reducer', () => {
    const initialState = {
        authorsListLoading: false,
        authorsListLoadingError: false,
        authorsList: [],
    };
    const mockAuthor = { aut_id: 410, aut_org_username: 'uqifraze' };

    it('fails to load data', () => {
        const test = authorsReducer(initialState, { type: actions.AUTHORS_LOAD_FAILED });
        expect(test).toEqual({
            authorsList: [],
            authorsListLoading: false,
            authorsListLoadingError: true,
        });
    });

    it('successfully loads authors data', () => {
        const test = authorsReducer(initialState, { type: actions.AUTHORS_LOADED, payload: mockAuthor });
        expect(test).toEqual({
            authorsList: mockAuthor,
            authorsListLoading: false,
            authorsListLoadingError: false,
        });
    });

    it('returns that it is loading author data', () => {
        const test = authorsReducer(initialState, { type: actions.AUTHORS_LOADING });
        expect(test).toEqual({
            authorsList: [],
            authorsListLoading: true,
            authorsListLoadingError: false,
        });
    });

    it('returns that it has cleared authors list', () => {
        const test = authorsReducer(initialState, { type: actions.CLEAR_AUTHORS_LIST });
        expect(test).toEqual({
            authorsList: [],
            authorsListLoading: false,
            authorsListLoadingError: false,
        });
    });

    it('returns the initialState when supplied an invalid action type', () => {
        const test = authorsReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
