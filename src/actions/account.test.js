import { accounts, currentAuthor, authorDetails } from 'mock/data/account';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as accountActions from './account';

jest.mock('@sentry/react');

describe('Account action creators', () => {
    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
        mockSessionApi = setupSessionMockAdapter();
    });

    afterEach(() => {
        MockDate.reset();
        mockApi.reset();
        mockSessionApi.reset();
    });

    it('should dispatch expected actions on successful fetch of user details', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.uqresearcher)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({ userId: accounts.uqresearcher.id }).apiUrl)
            .reply(200, authorDetails.uqresearcher);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
            actions.CURRENT_AUTHOR_DETAILS_LOADING,
            actions.CURRENT_AUTHOR_DETAILS_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should use student username to get author details when org username not set', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s2222222)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({ userId: accounts.s2222222.id }).apiUrl)
            .reply(200, authorDetails.s2222222);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
            actions.CURRENT_AUTHOR_DETAILS_LOADING,
            actions.CURRENT_AUTHOR_DETAILS_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should return expected actions for a student with an account but no author account', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.s3333333)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s3333333);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
            actions.CURRENT_AUTHOR_DETAILS_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if author returns 404', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqstaff)
            .onAny()
            .reply(404, {});

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_FAILED,
            actions.CURRENT_AUTHOR_DETAILS_FAILED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if author returns 401', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqstaff)
            .onAny()
            .reply(401, {});

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.CURRENT_AUTHOR_FAILED,
            actions.CURRENT_AUTHOR_DETAILS_FAILED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if account session expired', async () => {
        mockApi.onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl).reply(200, accounts.uqexpired);

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.CURRENT_AUTHOR_FAILED,
            actions.CURRENT_AUTHOR_DETAILS_FAILED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it(
        'should dispatch expected actions if account, author loaded, ' +
            'but author details failed via loadCurrentAccount()',
        async () => {
            process.env = {
                ENABLE_LOG: true,
            };

            mockApi
                .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
                .reply(200, accounts.uqresearcher)
                .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
                .reply(200, currentAuthor.uqresearcher)
                .onAny()
                .reply(404, {});

            const expectedActions = [
                actions.CURRENT_ACCOUNT_LOADING,
                actions.CURRENT_ACCOUNT_LOADED,
                actions.CURRENT_AUTHOR_LOADING,
                actions.CURRENT_AUTHOR_LOADED,
                actions.CURRENT_AUTHOR_DETAILS_LOADING,
                actions.CURRENT_AUTHOR_DETAILS_FAILED,
            ];

            await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        },
    );

    it('should dispatch expected actions for a student without an author account', async () => {
        process.env = {
            ENABLE_LOG: true,
        };

        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.s3333333)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.s3333333)
            .onAny()
            .reply(404, {});

        const expectedActions = [
            actions.CURRENT_ACCOUNT_LOADING,
            actions.CURRENT_ACCOUNT_LOADED,
            actions.CURRENT_AUTHOR_LOADING,
            actions.CURRENT_AUTHOR_LOADED,
            actions.CURRENT_AUTHOR_DETAILS_LOADED,
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected action when user logs out', () => {
        const expectedActions = [actions.CURRENT_ACCOUNT_ANONYMOUS];
        mockActionsStore.dispatch(accountActions.logout());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected action for google and other bots', async () => {
        global.navigator.__defineGetter__('userAgent', function userAgent() {
            return 'Googlebot'; // customized user agent
        });

        const expectedActions = [actions.CURRENT_ACCOUNT_ANONYMOUS];
        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should check session and dispatch session valid action', async () => {
        mockSessionApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onAny()
            .reply(404, {});

        const expectedActions = [actions.CURRENT_ACCOUNT_SESSION_VALID];

        await mockActionsStore.dispatch(accountActions.checkSession());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should check session and dispatch session expired action', async () => {
        mockSessionApi.onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl).reply(401, {});

        const expectedActions = [actions.CURRENT_ACCOUNT_SESSION_EXPIRED];

        await mockActionsStore.dispatch(accountActions.checkSession());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch clear session expire action', async () => {
        const expectedActions = [actions.CLEAR_CURRENT_ACCOUNT_SESSION_FLAG];

        await mockActionsStore.dispatch(accountActions.clearSessionExpiredFlag());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
