import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as viewRecordActions from './viewControlledVocab';
import * as mockData from 'mock/data';

describe('View controlled vocabulary actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadControlledVocabList action', () => {
        it('dispatches expected actions when loading top level controlled vocabularies from API successfully', async () => {
            mockApi.onGet(repositories.routes.VOCAB_LIST_API().apiUrl).reply(200, { data: { ...mockData.vocabList } });

            const expectedActions = [actions.VIEW_VOCAB_LOADING, actions.VIEW_VOCAB_LOADED];
            await mockActionsStore.dispatch(viewRecordActions.loadControlledVocabList());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when loading top level controlled vocabularies from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.VIEW_VOCAB_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_VOCAB_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadControlledVocabList());
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when loading child level controlled vocabularies from API successfully', async () => {
            mockApi
                .onGet(repositories.routes.CHILD_VOCAB_LIST_API(453669).apiUrl)
                .reply(200, { data: { ...mockData.childVocabList['453669'] } });

            const expectedActions = [actions.VIEW_CHILD_VOCAB_LOADING, actions.VIEW_CHILD_VOCAB_LOADED];
            await mockActionsStore.dispatch(viewRecordActions.loadChildVocabList({ pid: 453669, rootId: 453669 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when loading child level controlled vocabularies from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.VIEW_CHILD_VOCAB_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_CHILD_VOCAB_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadChildVocabList({ pid: 453669, rootId: 453669 }));
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('admin', () => {
        it('dispatches expected actions when adding a controlled vocabularies from API successfully', async () => {
            mockApi.onPost(repositories.routes.VOCAB_API().apiUrl).reply(200, { data: {} });

            const expectedActions = [actions.VOCAB_ADMIN_BUSY, actions.VOCAB_ADMIN_SUCCESS];

            await mockActionsStore.dispatch(viewRecordActions.adminControlledVocabulary({ pid: 453669 }, 'add'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when adding a controlled vocabularies from API fails', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [actions.VOCAB_ADMIN_BUSY, actions.APP_ALERT_SHOW, actions.VOCAB_ADMIN_FAILED];

            await mockActionsStore
                .dispatch(viewRecordActions.adminControlledVocabulary({ pid: 453669 }, 'add'))
                .catch(() => {
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                });
        });
        it('dispatches expected actions when editing a controlled vocabularies from API successfully', async () => {
            mockApi.onPut(repositories.routes.VOCAB_API().apiUrl).reply(200, { data: {} });

            const expectedActions = [actions.VOCAB_ADMIN_BUSY, actions.VOCAB_ADMIN_SUCCESS];

            await mockActionsStore.dispatch(viewRecordActions.adminControlledVocabulary({ pid: 453669 }, 'edit'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when setting a selected controlled vocabularies', async () => {
            const expectedActions = [actions.VOCAB_ADMIN_ACTION];

            await mockActionsStore.dispatch(viewRecordActions.setAdminActionVocab({ pid: 453669 }));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when clearing controlled vocabularies', async () => {
            const expectedActions = [actions.VOCAB_ADMIN_CLEAR];

            await mockActionsStore.dispatch(viewRecordActions.clearAdminControlledVocabulary());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when set rows per page', async () => {
            const expectedActions = [actions.VOCAB_SET_PER_PAGE];

            await mockActionsStore.dispatch(viewRecordActions.setVocabPerPage(25));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
        it('dispatches expected actions when set current page', async () => {
            const expectedActions = [actions.VOCAB_SET_CURRENT_PAGE];

            await mockActionsStore.dispatch(viewRecordActions.setCurrentPage(1));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
