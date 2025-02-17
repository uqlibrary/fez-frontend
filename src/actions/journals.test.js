import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as journalActions from './journals';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';
import * as ExportPublicationsTransformers from './exportPublicationsDataTransformers';

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

            const expectedActions = [actions.VIEW_JOURNAL_LOADING, actions.VIEW_JOURNAL_LOADED];

            await mockActionsStore.dispatch(journalActions.loadJournal(1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed journal name lookup', async () => {
            const { apiUrl, options } = repositories.routes.JOURNAL_API({ id: 1 });
            mockApi.onGet(apiUrl, options).reply(500);

            const expectedActions = [
                actions.VIEW_JOURNAL_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_JOURNAL_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(journalActions.loadJournal(1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('loadJournalSearchKeywords', () => {
        it('should dispatch action for successful journal search keywords', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_KEYWORDS_LOOKUP_API({ query: 'a' });
            mockApi.onGet(apiUrl).reply(200, { data: [] });

            const expectedActions = [actions.JOURNAL_SEARCH_KEYWORDS_LOADING, actions.JOURNAL_SEARCH_KEYWORDS_LOADED];

            await mockActionsStore.dispatch(journalActions.loadJournalSearchKeywords('a'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed journal search keywords', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_KEYWORDS_LOOKUP_API({ query: 'a' });
            mockApi.onGet(apiUrl).reply(500);

            const expectedActions = [
                actions.JOURNAL_SEARCH_KEYWORDS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.JOURNAL_SEARCH_KEYWORDS_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(journalActions.loadJournalSearchKeywords('a'));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('should dispatch action for clear journal search keywords', async () => {
            const expectedActions = [actions.CLEAR_JOURNAL_SEARCH_KEYWORDS];
            await mockActionsStore.dispatch(journalActions.clearJournalSearchKeywords());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('loadJournalSearch', () => {
        it('should dispatch action for successful journal search', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_SEARCH_API({ query: 'a' });
            mockApi.onGet(apiUrl).reply(200, { data: [] });

            const expectedActions = [actions.SEARCH_JOURNALS_LOADING, actions.SEARCH_JOURNALS_LOADED];

            await mockActionsStore.dispatch(journalActions.searchJournals('a'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed journal search', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_SEARCH_API({ query: 'a' });
            mockApi.onGet(apiUrl).reply(500);

            const expectedActions = [
                actions.SEARCH_JOURNALS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.SEARCH_JOURNALS_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(journalActions.searchJournals('a'));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('adminJournalUpdate', () => {
        it('should dispatch action for successful journal search', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_API({ id: 1 }, {});
            mockApi.onPut(apiUrl).reply(200, { data: [] });

            const expectedActions = [actions.ADMIN_UPDATE_JOURNAL_PROCESSING, actions.ADMIN_UPDATE_JOURNAL_SUCCESS];

            await mockActionsStore.dispatch(journalActions.adminJournalUpdate({ jnl_jid: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch action for failed journal search', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_API({ id: 1 }, {});
            mockApi.onPut(apiUrl).reply(200, { data: [] });

            const expectedActions = [
                actions.ADMIN_UPDATE_JOURNAL_PROCESSING,
                actions.APP_ALERT_SHOW,
                actions.ADMIN_UPDATE_JOURNAL_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(journalActions.adminJournalUpdate({ jnl_jid: 1 }));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('exportJournals', () => {
        let promptForDownload;
        const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
        it('should dispatch action for successful journal export', async () => {
            promptForDownload = jest.spyOn(ExportPublicationsTransformers, 'promptForDownload');
            promptForDownload.mockImplementation(() => exportPublicationsFormat);
            const { apiUrl } = repositories.routes.JOURNAL_SEARCH_API({
                query: 'a',
                exportPublicationsFormat: 'excel',
            });
            mockApi.onGet(apiUrl).reply(200, { data: [] });

            await mockActionsStore.dispatch(
                journalActions.exportJournals({ query: 'a', exportPublicationsFormat: 'excel' }),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.EXPORT_JOURNALS_LOADING,
                actions.EXPORT_JOURNALS_LOADED,
            ]);
        });

        it('should dispatch action for successful favourite journal export', async () => {
            promptForDownload = jest.spyOn(ExportPublicationsTransformers, 'promptForDownload');
            promptForDownload.mockImplementation(() => exportPublicationsFormat);
            const { apiUrl } = repositories.routes.JOURNAL_FAVOURITES_API({
                query: 'a',
                exportPublicationsFormat: 'excel',
            });
            mockApi.onGet(apiUrl).reply(200, { data: [] });

            // export favourite journals
            await mockActionsStore.dispatch(
                journalActions.exportJournals({ query: 'a', exportPublicationsFormat: 'excel' }, true),
            );
            expect(mockActionsStore.getActions()).toHaveDispatchedActions([
                actions.EXPORT_FAVOURITE_JOURNALS_LOADING,
                actions.EXPORT_FAVOURITE_JOURNALS_LOADED,
            ]);
        });

        it('should dispatch action for failed journal export api', async () => {
            promptForDownload = jest.spyOn(ExportPublicationsTransformers, 'promptForDownload');
            promptForDownload.mockImplementation(() => exportPublicationsFormat);
            const { apiUrl } = repositories.routes.JOURNAL_SEARCH_API({
                query: 'a',
                exportPublicationsFormat: 'excel',
            });
            mockApi.onGet(apiUrl).reply(500);

            const expectedActions = [
                actions.EXPORT_JOURNALS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.EXPORT_JOURNALS_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(
                    journalActions.exportJournals({ query: 'a', exportPublicationsFormat: 'excel' }),
                );
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('should dispatch action on unexpected export format', async () => {
            promptForDownload.mockImplementation(() => {
                throw 'Error';
            });
            const { apiUrl } = repositories.routes.JOURNAL_SEARCH_API({
                query: 'a',
                exportPublicationsFormat: 'excel',
            });

            mockApi.onGet(apiUrl).reply(200, { data: [] });

            const expectedActions = [actions.EXPORT_JOURNALS_LOADING, actions.EXPORT_JOURNALS_FAILED];

            try {
                await mockActionsStore.dispatch(
                    journalActions.exportJournals({ query: 'a', exportPublicationsFormat: 'excel' }),
                );
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
    describe('retrieveFavouriteJournals', () => {
        it('should dispatch action for successful journal favourites', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_FAVOURITES_API();
            mockApi.onGet(apiUrl).reply(200, { data: [] });
            const expectedActions = [actions.FAVOURITE_JOURNALS_LOADING, actions.FAVOURITE_JOURNALS_LOADED];
            await mockActionsStore.dispatch(journalActions.retrieveFavouriteJournals());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('should dispatch action for failed journal favourites', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_FAVOURITES_API({ query: 'a' });
            mockApi.onGet(apiUrl).reply(500);
            const expectedActions = [
                actions.FAVOURITE_JOURNALS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.FAVOURITE_JOURNALS_FAILED,
            ];
            try {
                await mockActionsStore.dispatch(journalActions.retrieveFavouriteJournals('a'));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
    describe('AddToFavourites', () => {
        it('should dispatch action for successful adding journal favourites', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_FAVOURITES_API();
            mockApi.onPost(apiUrl).reply(200, { data: [] });
            const expectedActions = [actions.FAVOURITE_JOURNALS_ADD_REQUESTING, actions.FAVOURITE_JOURNALS_ADD_SUCCESS];
            await mockActionsStore.dispatch(journalActions.addToFavourites({ id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('should dispatch action for failed adding journal favourites', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_FAVOURITES_API();
            mockApi.onPost(apiUrl).reply(500);
            const expectedActions = [
                actions.FAVOURITE_JOURNALS_ADD_REQUESTING,
                actions.APP_ALERT_SHOW,
                actions.FAVOURITE_JOURNALS_ADD_FAILED,
            ];
            try {
                await mockActionsStore.dispatch(journalActions.addToFavourites({ id: 1 }));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
    describe('RemoveFromFavourites', () => {
        it('should dispatch action for successful removal journal favourites', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_FAVOURITES_API();
            mockApi.onDelete(apiUrl).reply(200, { data: [] });
            const expectedActions = [
                actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING,
                actions.FAVOURITE_JOURNALS_REMOVE_SUCCESS,
            ];
            await mockActionsStore.dispatch(journalActions.removeFromFavourites({ id: 1 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('should dispatch action for failed removal journal favourites', async () => {
            const { apiUrl } = repositories.routes.JOURNAL_FAVOURITES_API();
            mockApi.onDelete(apiUrl).reply(500);
            const expectedActions = [
                actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING,
                actions.APP_ALERT_SHOW,
                actions.FAVOURITE_JOURNALS_REMOVE_FAILED,
            ];
            try {
                await mockActionsStore.dispatch(journalActions.removeFromFavourites({ id: 1 }));
            } catch {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
