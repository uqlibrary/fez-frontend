import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as viewRecordActions from './viewRecord';
import * as mockData from 'mock/data';

describe('View record actions', () => {
    const testPid = "UQ:396321";

    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadRecordToView action', () => {
        it('dispatches expected actions when loading a record to view from API successfully', async () => {
            mockApi
                .onGet(repositories.routes.EXISTING_RECORD_API({pid: testPid}).apiUrl)
                .reply(200, {data: {...mockData.record}});

            const expectedActions = [
                actions.VIEW_RECORD_LOADING,
                actions.VIEW_RECORD_LOADED
            ];

            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to view from API failed', async () => {
            mockApi
                .onAny()
                .reply(500);

            const expectedActions = [
                actions.VIEW_RECORD_LOADING,
                actions.VIEW_RECORD_LOAD_FAILED
            ];
            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to view from API for anon user', async () => {
            mockApi
                .onAny()
                .reply(403);

            const expectedActions = [
                actions.VIEW_RECORD_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.VIEW_RECORD_LOAD_FAILED
            ];
            await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('setting/clearing record to view action', () => {
        it('dispatches expected actions when setting a loaded record to view', async () => {
            const expectedActions = [
                actions.VIEW_RECORD_SET
            ];
            try {
                await mockActionsStore.dispatch(viewRecordActions.setRecordToView(mockData.record));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when clearing a loaded record to view', async () => {
            const expectedActions = [
                actions.VIEW_RECORD_CLEAR
            ];

            try {
                await mockActionsStore.dispatch(viewRecordActions.clearRecordToView());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

});
