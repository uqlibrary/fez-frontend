# Actions

## Action types

All action types are defined in src/actions/actionTypes.js

## Error handling

- Dispatch [ACTION]\_FAILED action in case something went wrong (even if it returns Promise.reject())

## Testing

Global test setup is done in /src/test.setup.js:

- mockApi - to mock API responses
- mockActionsStore - to mock store to track all dispatched actions
- extending expect with `toHaveDispatchedActions` and `toHaveAnyOrderDispatchedActions` to easily compare received actions to expected actions

Template for actions unit tests:

```javascript

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as [ACTIONS] from './[ACTIONS]';
import * as mockData from 'mock/data';

describe('[ACTIONS NAME] actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});
    expect.extend({toHaveAnyOrderDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('dispatches expected actions for successful request', async () => {
        mockApi
            .onGet(repositories.routes.[ROUTE_API]())
            .reply(200, {data: {...mockData.record}})
            .onAny() // reply to any request
            .reply(200, {};

        const expectedActions = [
            actions.[ACTION_TYPE]_LOADING,
            actions.[ACTION_TYPE]_LOADED
        ];

        await mockActionsStore.dispatch([ACTIONS].[ACTION()]());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions for anon user', async () => {
        mockApi
            .onGet(repositories.routes.[ROUTE_API]())
            .reply(401, {});

        const expectedActions = [
            actions.[ACTION_TYPE]_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.[ACTION_TYPE]_LOADED
        ];

        await mockActionsStore.dispatch([ACTIONS].[ACTION()]());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});

```
