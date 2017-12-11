import * as actions from 'actions/actionTypes';
import authorDetailsReducer from './authorDetails'

describe('authorDetails reducer', () => {

    const initialState = {
        accountAuthorDetailsLoading: true,
        authorDetails: null
    };

    const mockAuthorDetails = {"aut_id":410,"aut_org_username":"uqifraze"};

    it('returns that it is loading data', () => {
        const test = authorDetailsReducer(initialState, {type: actions.AUTHOR_DETAILS_LOADING});
        expect(test).toEqual({
            accountAuthorDetailsLoading: true,
            authorDetails: null
        });
    });

    it('returns that it has loaded data', () => {
        const test = authorDetailsReducer(initialState, {type: actions.AUTHOR_DETAILS_LOADED, payload: mockAuthorDetails});
        expect(test).toEqual({
            accountAuthorDetailsLoading: false,
            authorDetails: mockAuthorDetails
        });
    });

    it('returns that it has failed to load data', () => {
        const test = authorDetailsReducer(initialState, {type: actions.AUTHOR_DETAILS_FAILED});
        expect(test).toEqual({
            accountAuthorDetailsLoading: false,
            authorDetails: null
        });
    });

    it('returns the initialState due to being supplied an invalid action type', () => {
        const test = authorDetailsReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual(initialState);
    });
});
