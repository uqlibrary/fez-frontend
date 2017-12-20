import {accounts, currentAuthor, authorDetails} from '../mock/data/account';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as accountActions from './account';

describe('Account action creators', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        // Set a mock date for account API
        const DATE_TO_USE = new Date('2016');
        const _Date = Date;
        global.Date = jest.fn(() => DATE_TO_USE);
        global.Date.UTC = _Date.UTC;
        global.Date.parse = _Date.parse;
        global.Date.now = _Date.now;

        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch expected actions on successful fetch of user details', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.uqresearcher)
            .onGet(repositories.routes.AUTHOR_DETAILS_API({userId: accounts.uqresearcher.id}).apiUrl)
            .reply(200, authorDetails.uqresearcher);

        const expectedActions = [
            {type: actions.CURRENT_ACCOUNT_LOADING},
            {type: actions.CURRENT_ACCOUNT_LOADED},
            {type: actions.CURRENT_AUTHOR_LOADING},
            {type: actions.CURRENT_AUTHOR_LOADED},
            {type: actions.CURRENT_AUTHOR_DETAILS_LOADING},
            {type: actions.CURRENT_AUTHOR_DETAILS_LOADED}
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
            {type: actions.CURRENT_ACCOUNT_LOADING},
            {type: actions.CURRENT_ACCOUNT_LOADED},
            {type: actions.CURRENT_AUTHOR_LOADING},
            {type: actions.CURRENT_AUTHOR_FAILED},
            {type: actions.CURRENT_AUTHOR_DETAILS_FAILED}
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if author returns 403', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqstaff)
            .onAny()
            .reply(403, {});

        const expectedActions = [
            {type: actions.CURRENT_ACCOUNT_LOADING},
            {type: actions.CURRENT_ACCOUNT_LOADED},
            {type: actions.CURRENT_AUTHOR_LOADING},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.CURRENT_AUTHOR_FAILED},
            {type: actions.CURRENT_AUTHOR_DETAILS_FAILED}
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if account session expired', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqexpired);

        const expectedActions = [
            {type: actions.CURRENT_ACCOUNT_LOADING},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.CURRENT_AUTHOR_FAILED},
            {type: actions.CURRENT_AUTHOR_DETAILS_FAILED}
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected actions if account, author loaded, but author details failed via loadCurrentAccount()', async () => {
        mockApi
            .onGet(repositories.routes.CURRENT_ACCOUNT_API().apiUrl)
            .reply(200, accounts.uqresearcher)
            .onGet(repositories.routes.CURRENT_AUTHOR_API().apiUrl)
            .reply(200, currentAuthor.uqresearcher)
            .onAny()
            .reply(404, {});

        const expectedActions = [
            {type: actions.CURRENT_ACCOUNT_LOADING},
            {type: actions.CURRENT_ACCOUNT_LOADED},
            {type: actions.CURRENT_AUTHOR_LOADING},
            {type: actions.CURRENT_AUTHOR_LOADED},
            {type: actions.CURRENT_AUTHOR_DETAILS_LOADING},
            {type: actions.CURRENT_AUTHOR_DETAILS_FAILED}
        ];

        await mockActionsStore.dispatch(accountActions.loadCurrentAccount());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch expected action when user logs out', () => {
        const expectedActions = [{type: actions.CURRENT_ACCOUNT_ANONYMOUS}];
        mockActionsStore.dispatch(accountActions.logout());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

});
