import * as actions from 'actions/actionTypes';
import appReducer from './app';

describe('app reducer', () => {

    const initialState = {
        hidePossiblyYourPublicationsLure: false,
        notificationAlert: null
    };

    it('returns that the lure is to be hidden', () => {
        const test = appReducer(initialState, {type: actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE});
        expect(test).toEqual({
            ...initialState,
            hidePossiblyYourPublicationsLure: true
        });
    });

    it('returns the initialState due to an invalid action type', () => {
        const test = appReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual(initialState);
    });
});