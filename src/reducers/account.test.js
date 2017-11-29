import * as actions from 'actions/actionTypes';
import accountReducer from './account';

describe('Authors reducer', () => {

    const initialState = {
        account: null,
        author: null,
        authorDetails: null,
        accountLoading: true,
        authorLoading: true,
        loadingAuthorDetails: true
    };

    const mockAccount = {};

    it('returns that it is loading data', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_LOADING});
        expect(test).toEqual({
            ...initialState
        })
    });

    it('returns that it has loaded data', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_LOADED, payload: mockAccount});
        expect(test).toEqual({
            ...initialState,
            account: mockAccount,
            accountLoading: false,
        })
    });

    it('returns an anon account', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_ANONYMOUS});
        expect(test).toEqual({
            ...initialState,
            accountLoading: false,
            accountAuthorLoading: false,
            accountAuthorDetailsLoading: false
        })
    });

    it('returns thats the author account failed to load', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_AUTHOR_FAILED});
        expect(test).toEqual({
            ...initialState,
            author: null,
            authorLoading: false
        })
    });

    it('returns that it has loaded author data', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_AUTHOR_LOADED, payload: mockAccount});
        expect(test).toEqual({
            ...initialState,
            author: mockAccount,
            authorLoading: false
        })
    });

    it('returns that it is loading author data', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_AUTHOR_LOADING});
        expect(test).toEqual({
            ...initialState,
            author: null,
            authorLoading: true
        })
    });

    it('returns that the author details failed to load', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_AUTHOR_DETAILS_FAILED});
        expect(test).toEqual({
            ...initialState,
            authorDetails: null,
            loadingAuthorDetails: false
        })
    });

    it('returns that the author details have loaded', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_AUTHOR_DETAILS_LOADED, payload: mockAccount});
        expect(test).toEqual({
            ...initialState,
            authorDetails: mockAccount,
            loadingAuthorDetails: false
        })
    });

    it('returns that the author details are loading', () => {
        const test = accountReducer(initialState, {type: actions.ACCOUNT_AUTHOR_DETAILS_LOADING});
        expect(test).toEqual({
            ...initialState,
            authorDetails: null,
            loadingAuthorDetails: true
        })
    });

    it('returns the initialState due to an invalid action type', () => {
        const test = accountReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual({
            ...initialState
        })
    });
});