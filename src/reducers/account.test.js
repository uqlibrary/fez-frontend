import * as actions from 'actions/actionTypes';
import accountReducer from './account';

describe('account reducer', () => {

    const initialState = {
        account: null,
        author: null,
        authorDetails: null,
        accountLoading: true,
        accountAuthorLoading: true,
        accountAuthorDetailsLoading: true
    };

    const mockAccount = {};

    it('returns that it is loading data', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_ACCOUNT_LOADING});
        expect(test).toEqual({
            ...initialState
        })
    });

    it('returns that it has loaded data', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_ACCOUNT_LOADED, payload: mockAccount});
        expect(test).toEqual({
            ...initialState,
            account: mockAccount,
            accountLoading: false,
        })
    });

    it('returns an anon account', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_ACCOUNT_ANONYMOUS});
        expect(test).toEqual({
            ...initialState,
            accountLoading: false,
            accountAuthorLoading: false,
            accountAuthorDetailsLoading: false
        })
    });

    it('returns thats the author account failed to load', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_AUTHOR_FAILED});
        expect(test).toEqual({
            ...initialState,
            author: null,
            accountAuthorLoading: false
        })
    });

    it('returns that it has loaded author data', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_AUTHOR_LOADED, payload: mockAccount});
        expect(test).toEqual({
            ...initialState,
            author: mockAccount,
            accountAuthorLoading: false
        })
    });

    it('returns that it is loading author data', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_AUTHOR_LOADING});
        expect(test).toEqual({
            ...initialState,
            author: null,
            accountAuthorLoading: true
        })
    });

    it('returns that the author details failed to load', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_AUTHOR_DETAILS_FAILED});
        expect(test).toEqual({
            ...initialState,
            authorDetails: null,
            accountAuthorDetailsLoading: false
        })
    });

    it('returns that the author details have loaded', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_AUTHOR_DETAILS_LOADED, payload: mockAccount});
        expect(test).toEqual({
            ...initialState,
            authorDetails: mockAccount,
            accountAuthorDetailsLoading: false
        })
    });

    it('returns that the author details are loading', () => {
        const test = accountReducer(initialState, {type: actions.CURRENT_AUTHOR_DETAILS_LOADING});
        expect(test).toEqual({
            ...initialState,
            authorDetails: null,
            accountAuthorDetailsLoading: true
        })
    });

    it('returns the initialState due to an invalid action type', () => {
        const test = accountReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual({
            ...initialState,
            authorDetails: null,
            accountAuthorDetailsLoading: true
        })
    });




});