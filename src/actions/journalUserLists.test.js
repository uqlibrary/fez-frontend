import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as _actions from './journalUserLists';
import { JOURNAL_FAVOURITE_LIST_ID } from '../config/general';
import { JOURNAL_USER_LISTS_CRUD_SUCCESS } from './actionTypes';

describe('JournalUserLists', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('lists', () => {
        describe('loadLists', () => {
            it('should dispatch action for successful', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API();
                mockApi.onGet(apiUrl).reply(200, { data: [] });
                const expectedActions = [actions.JOURNAL_USER_LISTS_LOADING, actions.JOURNAL_USER_LISTS_SUCCESS];
                await mockActionsStore.dispatch(_actions.loadLists());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
            it('should dispatch action for failure', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API();
                mockApi.onGet(apiUrl).reply(500);
                const expectedActions = [
                    actions.JOURNAL_USER_LISTS_LOADING,
                    actions.APP_ALERT_SHOW,
                    actions.JOURNAL_USER_LISTS_FAILED,
                ];
                try {
                    await mockActionsStore.dispatch(_actions.loadLists());
                } catch {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });
        describe('createList', () => {
            it('should dispatch action for successful', async () => {
                const data = { fjl_label: 'Test list' };
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API();
                mockApi.onPost(apiUrl).reply(200, { data });
                const expectedActions = [actions.JOURNAL_USER_LISTS_LOADING, actions.JOURNAL_USER_LISTS_CRUD_SUCCESS];
                await mockActionsStore.dispatch(_actions.createList(data));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
            it('should dispatch action for failure', async () => {
                const data = { fjl_label: 'Test list' };
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API();
                mockApi.onPost(apiUrl).reply(500);
                const expectedActions = [
                    actions.JOURNAL_USER_LISTS_LOADING,
                    actions.APP_ALERT_SHOW,
                    actions.JOURNAL_USER_LISTS_FAILED,
                ];
                try {
                    await mockActionsStore.dispatch(_actions.createList(data));
                } catch {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });
        describe('updateList', () => {
            it('should dispatch action for successful', async () => {
                const data = { fjl_id: 1, fjl_label: 'Updated list' };
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API(data.fjl_id);
                mockApi.onPut(apiUrl).reply(200, { data });
                const expectedActions = [actions.JOURNAL_USER_LISTS_LOADING, actions.JOURNAL_USER_LISTS_CRUD_SUCCESS];
                await mockActionsStore.dispatch(_actions.updateList(data));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
            it('should dispatch action for failure', async () => {
                const data = { fjl_id: 1, fjl_label: 'Updated list' };
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API(data.fjl_id);
                mockApi.onPut(apiUrl).reply(500);
                const expectedActions = [
                    actions.JOURNAL_USER_LISTS_LOADING,
                    actions.APP_ALERT_SHOW,
                    actions.JOURNAL_USER_LISTS_FAILED,
                ];
                try {
                    await mockActionsStore.dispatch(_actions.updateList(data));
                } catch {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });
        describe('deleteList', () => {
            it('should dispatch action for successful', async () => {
                const id = 1;
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API(id);
                mockApi.onDelete(apiUrl).reply(200);
                const expectedActions = [actions.JOURNAL_USER_LISTS_LOADING, actions.JOURNAL_USER_LISTS_CRUD_SUCCESS];
                await mockActionsStore.dispatch(_actions.deleteList(id));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
            it('should dispatch action for failure', async () => {
                const id = 1;
                const { apiUrl } = repositories.routes.JOURNAL_USE_LISTS_API(id);
                mockApi.onDelete(apiUrl).reply(500);
                const expectedActions = [
                    actions.JOURNAL_USER_LISTS_LOADING,
                    actions.APP_ALERT_SHOW,
                    actions.JOURNAL_USER_LISTS_FAILED,
                ];
                try {
                    await mockActionsStore.dispatch(_actions.deleteList(id));
                } catch {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });
    });

    describe('favourites', () => {
        describe('loadListItems', () => {
            it('should dispatch action for successful journal favourites', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USER_LIST_ITEMS_API();
                mockApi.onGet(apiUrl).reply(200, { data: [] });
                const expectedActions = [actions.FAVOURITE_JOURNALS_LOADING, actions.FAVOURITE_JOURNALS_LOADED];
                await mockActionsStore.dispatch(_actions.loadListItems({ id: JOURNAL_FAVOURITE_LIST_ID }));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
            it('should dispatch action for failed journal favourites', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USER_LIST_ITEMS_API({ searchQuery: 'a' });
                mockApi.onGet(apiUrl).reply(500);
                const expectedActions = [
                    actions.FAVOURITE_JOURNALS_LOADING,
                    actions.APP_ALERT_SHOW,
                    actions.FAVOURITE_JOURNALS_FAILED,
                ];
                try {
                    await mockActionsStore.dispatch(
                        _actions.loadListItems({ id: JOURNAL_FAVOURITE_LIST_ID, searchQuery: 'a' }),
                    );
                } catch {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });
        describe('AddListItems', () => {
            it('should dispatch action for successful adding journal favourites', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USER_LIST_ITEMS_API({ id: 1 });
                mockApi.onPost(apiUrl).reply(200, { data: [] });
                const expectedActions = [
                    actions.FAVOURITE_JOURNALS_ADD_REQUESTING,
                    actions.FAVOURITE_JOURNALS_ADD_SUCCESS,
                ];
                await mockActionsStore.dispatch(_actions.addListItems({ id: 1 }));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
            it('should dispatch action for failed adding journal favourites', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USER_LIST_ITEMS_API({ id: 1 });
                mockApi.onPost(apiUrl).reply(500);
                const expectedActions = [
                    actions.FAVOURITE_JOURNALS_ADD_REQUESTING,
                    actions.APP_ALERT_SHOW,
                    actions.FAVOURITE_JOURNALS_ADD_FAILED,
                ];
                try {
                    await mockActionsStore.dispatch(_actions.addListItems({ id: 1 }));
                } catch {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });
        describe('DeleteListItems', () => {
            it('should dispatch action for successful removal journal favourites', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USER_LIST_ITEMS_API({ id: 1 });
                mockApi.onDelete(apiUrl).reply(200, { data: [] });
                const expectedActions = [
                    actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING,
                    actions.FAVOURITE_JOURNALS_REMOVE_SUCCESS,
                ];
                await mockActionsStore.dispatch(_actions.deleteListItems({ id: 1 }));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
            it('should dispatch action for failed removal journal favourites', async () => {
                const { apiUrl } = repositories.routes.JOURNAL_USER_LIST_ITEMS_API({ id: 1 });
                mockApi.onDelete(apiUrl).reply(500);
                const expectedActions = [
                    actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING,
                    actions.APP_ALERT_SHOW,
                    actions.FAVOURITE_JOURNALS_REMOVE_FAILED,
                ];
                try {
                    await mockActionsStore.dispatch(_actions.deleteListItems({ id: 1 }));
                } catch {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });
    });
});
