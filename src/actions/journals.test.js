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
            const { apiUrl } = repositories.routes.JOURNAL_LOOKUP_API({ query: 'a' });
            mockApi.onGet(apiUrl).reply(200, { data: [] });

            const expectedActions = [actions.JOURNAL_LOOKUP_LOADING, actions.JOURNAL_LOOKUP_LOADED];

            await mockActionsStore.dispatch(journalActions.loadJournalLookup('a'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed journal name lookup', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_LOOKUP_API({ query: 'a' });
            mockApi.onGet(apiUrl).reply(500);

            const expectedActions = [
                actions.JOURNAL_LOOKUP_LOADING,
                actions.APP_ALERT_SHOW,
                actions.JOURNAL_LOOKUP_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(journalActions.loadJournalLookup('a'));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('requestMJLIngest', () => {
        it('should dispatch action for successful master journal list ingest', async () => {
            const { apiUrl } = repositories.routes.MASTER_JOURNAL_LIST_INGEST_API();
            mockApi.onPost(apiUrl).reply(200, { data: [] });

            const expectedActions = [
                actions.MASTER_JOURNAL_LIST_INGEST_REQUESTING,
                actions.MASTER_JOURNAL_LIST_INGEST_REQUESTED,
            ];

            await mockActionsStore.dispatch(journalActions.requestMJLIngest('test-dir'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed master journal list ingest', async () => {
            const { apiUrl } = repositories.routes.MASTER_JOURNAL_LIST_INGEST_API();
            mockApi.onPost(apiUrl).reply(500);

            const expectedActions = [
                actions.MASTER_JOURNAL_LIST_INGEST_REQUESTING,
                actions.APP_ALERT_SHOW,
                actions.MASTER_JOURNAL_LIST_INGEST_REQUEST_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(journalActions.requestMJLIngest('test-dir'));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
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
