import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import {api} from 'config';
import {authorOrcidDetails} from '../mock/data/testing/authorIdentifiers';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as authorIdentifierActions from './authorIdentifiers';

const getMockStore = () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    return mockStore({});
};

const expectStoreHasExpectedActions = (store, expectedActions) => {
    expect(store.getActions().map(action => ({type: action.type}))).toEqual(expect.arrayContaining(expectedActions));
};

describe('Author identifier action creators', () => {
    let mock;

    beforeEach(() => {
            mock = new MockAdapter(api, {delayResponse: 100});
        });

    afterEach(() => {
            mock.reset();
        });

    it('should dispatch series of 6 actions on requesting orcid access token and patching user with orcid id', () => {
        const params = {code: 'Uux34T', redirUri: 'http://localhost'};
        mock.onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({userId: 'testuser', params: params}))
            .reply(200, authorOrcidDetails);
        mock.onPatch(repositories.routes.AUTHOR_ADD_IDENTIFIER({autId: 1234}))
            .reply(200, {});

        const expectedActions = [
            {type: actions.ORCID_ACCESS_TOKEN_REQUEST},
            {type: actions.APP_NOTIFICATION},
            {type: actions.ORCID_ACCESS_TOKEN_LOADED},
            {type: actions.AUTHOR_IDENTIFIER_ADD},
            {type: actions.AUTHOR_IDENTIFIER_ADDED},
            {type: actions.APP_NOTIFICATION},
        ];

        const store = getMockStore();
        return store.dispatch(authorIdentifierActions.requestAuthorOrcidInfo('testuser', 1234, {code: 'Uux34T', redirUri: 'http://localhost'})).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch series of 4 actions on orcid access token request failed for anonymous users', () => {
        const params = {code: 'Uux34T', redirUri: 'http://localhost'};
        mock.onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({userId: 'testuser', params: params}))
            .reply(403);

        const expectedActions = [
            {type: actions.ORCID_ACCESS_TOKEN_REQUEST},
            {type: actions.APP_NOTIFICATION},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: actions.ORCID_ACCESS_TOKEN_REQUEST_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(authorIdentifierActions.requestAuthorOrcidInfo('testuser', 1234, {code: 'Uux34T', redirUri: 'http://localhost'})).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch series of 4 actions on orcid access token request failed if incorrect GET params', () => {
        const params = {code: 'Uux34T', redirUri: 'http://localhost'};
        mock.onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({userId: 'testuser', params: params}))
            .reply(500);

        const expectedActions = [
            {type: actions.ORCID_ACCESS_TOKEN_REQUEST},
            {type: actions.APP_NOTIFICATION},
            {type: actions.APP_NOTIFICATION},
            {type: actions.ORCID_ACCESS_TOKEN_REQUEST_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(authorIdentifierActions.requestAuthorOrcidInfo('testuser', 1234, {code: 'Uux34T', redirUri: 'http://localhost'})).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch series of 6 actions on PATCH author with orcid id', () => {
        const params = {code: 'Uux34T', redirUri: 'http://localhost'};
        mock.onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({userId: 'testuser', params: params}))
            .reply(200, authorOrcidDetails);
        mock.onPatch(repositories.routes.AUTHOR_ADD_IDENTIFIER({autId: 1234}))
            .reply(500);

        const expectedActions = [
            {type: actions.ORCID_ACCESS_TOKEN_REQUEST},
            {type: actions.APP_NOTIFICATION},
            {type: actions.ORCID_ACCESS_TOKEN_LOADED},
            {type: actions.AUTHOR_IDENTIFIER_ADD},
            {type: actions.APP_NOTIFICATION},
            {type: actions.AUTHOR_IDENTIFIER_ADD_FAILED}
        ];

        const store = getMockStore();
        return store.dispatch(authorIdentifierActions.requestAuthorOrcidInfo('testuser', 1234, {code: 'Uux34T', redirUri: 'http://localhost'})).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });
});
