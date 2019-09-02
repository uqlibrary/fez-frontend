import * as actions from 'actions/actionTypes';
import appReducer from './app';

describe('app reducer', () => {
    const initialState = {
        hidePossiblyYourPublicationsLure: false,
        appAlert: null,
        redirectPath: null,
    };

    it('returns the initialState due to an invalid action type', () => {
        const test = appReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });

    it('returns that the lure is to be hidden', () => {
        const test = appReducer(initialState, { type: actions.APP_DASHBOARD_POSSIBLY_YOUR_PUBLICATIONS_LURE_HIDE });
        expect(test).toEqual({
            ...initialState,
            hidePossiblyYourPublicationsLure: true,
        });
    });

    it('sets an app alert', () => {
        const appAlert = 'This is an alert';
        const test = appReducer(initialState, { type: actions.APP_ALERT_SHOW, payload: appAlert });
        expect(test.appAlert).toEqual(appAlert);
        expect(test).toEqual({
            ...initialState,
            appAlert: appAlert,
        });
    });

    it('hides app alert', () => {
        const test = appReducer({ ...initialState, appAlert: 'A test alert' }, { type: actions.APP_ALERT_HIDE });
        expect(test.appAlert).toBeNull;
        expect(test).toEqual(initialState);
    });

    it('returns the redirect location we are setting', () => {
        const test = appReducer(initialState, {
            type: actions.SET_REDIRECT_PATH,
            payload: '/records/add/find',
        });
        expect(test).toEqual({
            ...initialState,
            redirectPath: '/records/add/find',
        });
    });

    it('clears a redirect', () => {
        const test = appReducer(
            { ...initialState, redirectPath: 'some/redirect/path' },
            { type: actions.CLEAR_REDIRECT_PATH },
        );
        expect(test.redirectPath).toBeNull;
        expect(test).toEqual(initialState);
    });
});
