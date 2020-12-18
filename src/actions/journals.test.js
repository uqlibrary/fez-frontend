import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as journalActions from './journals';

describe('Search action creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadJournalLookup', () => {
        it('should dispatch action for successful journal name lookup', async () => {
            const { apiUrl, options } = repositories.routes.JOURNAL_LOOKUP_API({ query: 'a' });
            mockApi.onGet(apiUrl, options).reply(200, { data: [] });

            const expectedActions = [actions.JOURNAL_LOOKUP_LOADING, actions.JOURNAL_LOOKUP_LOADED];

            await mockActionsStore.dispatch(journalActions.loadJournalLookup('a'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed journal name lookup', async () => {
            const { apiUrl, options } = repositories.routes.JOURNAL_LOOKUP_API({ query: 'a' });
            mockApi.onGet(apiUrl, options).reply(500);

            const expectedActions = [
                actions.JOURNAL_LOOKUP_LOADING,
                actions.APP_ALERT_SHOW,
                actions.JOURNAL_LOOKUP_FAILED,
            ];

            await mockActionsStore.dispatch(journalActions.loadJournalLookup('a'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('loadJournal', () => {
        it('should dispatch action for successful journal details lookup', async () => {
            const { apiUrl, options } = repositories.routes.JOURNAL_API({ id: 1 });
            mockApi.onGet(apiUrl, options).reply(200, { data: [] });

            const expectedActions = [actions.JOURNAL_LOADING, actions.JOURNAL_LOADED];

            await mockActionsStore.dispatch(journalActions.loadJournal(1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed journal name lookup', async () => {
            const { apiUrl, options } = repositories.routes.JOURNAL_API({ id: 1 });
            mockApi.onGet(apiUrl, options).reply(500);

            const expectedActions = [actions.JOURNAL_LOADING, actions.APP_ALERT_SHOW, actions.JOURNAL_LOAD_FAILED];

            await mockActionsStore.dispatch(journalActions.loadJournal(1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
