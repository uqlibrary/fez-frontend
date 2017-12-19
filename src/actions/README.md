# Actions 

## Action types

All action types are defined in src/actions/actionTypes.js

### Action types naming conventions

Keep to the following naming format `[OBJECT]_[STATUS]` or `[NOUN]_[VERB]`:

- LATEST_PUBLICATIONS_LOADING
- LATEST_PUBLICATIONS_LOADED
- LATEST_PUBLICATIONS_FAILED

or

- APP_ALERT_SHOW
- APP_ALERT_HIDE


## Actions

TBA

## Error handling

TBA

## Testing

Global test setup is done in /src/test.setup.js:
- mockApi - to mock API responses
- mockActionsStore - to mock store to track all dispatched actions
- extending expect with `toHaveDispatchedActions` to easily compare received actions to expected actions
  
Temple for actions unit tests:

```` 

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as [ACTIONS] from './[ACTIONS]';
import * as mockData from 'mock/data';

describe('[ACTIONS NAME] actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

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
            .reply(200, {data: {...mockData.record}});

        const expectedActions = [
            {type: actions.[ACTION_TYPE]_LOADING},
            {type: actions.[ACTION_TYPE]_LOADED}
        ];

        await mockActionsStore.dispatch([ACTIONS].[ACTION()]());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions for anon user', async () => {
        mockApi
            .onGet(repositories.routes.[ROUTE_API]())
            .reply(403, {});

        const expectedActions = [
            {type: actions.[ACTION_TYPE]_LOADING},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.[ACTION_TYPE]_FAILED}
        ];
       
        try {
          await mockActionsStore.dispatch([ACTIONS].[ACTION()]());
          expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch(e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });
});


````
