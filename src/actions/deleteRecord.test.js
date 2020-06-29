import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as deleteRecordActions from './deleteRecord';
import * as mockData from 'mock/data/testing/records';
import { DELETE_RECORD_PROCESSING } from './actionTypes';

describe('Delete record actions', () => {
    const testPid = 'UQ:41878';

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadRecordToDelete action', () => {
        it('dispatches expected actions when loading a record to delete from API successfully', async () => {
            mockApi
                .onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: { ...mockData.mockRecordToDelete } });

            const expectedActions = [actions.DELETE_RECORD_LOADING, actions.DELETE_RECORD_LOADED];

            try {
                await mockActionsStore.dispatch(deleteRecordActions.loadRecordToDelete(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to delete from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.DELETE_RECORD_LOADING,
                actions.APP_ALERT_SHOW,
                actions.DELETE_RECORD_LOAD_FAILED,
            ];
            try {
                await mockActionsStore.dispatch(deleteRecordActions.loadRecordToDelete(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to fix from API for anon user', async () => {
            mockApi.onAny().reply(403);

            const expectedActions = [
                actions.DELETE_RECORD_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.DELETE_RECORD_LOAD_FAILED,
            ];
            await mockActionsStore.dispatch(deleteRecordActions.loadRecordToDelete(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('setting/clearing record to delete action', () => {
        it('dispatches expected actions when setting a loaded record to delete', async () => {
            const expectedActions = [actions.DELETE_RECORD_SET];
            try {
                await mockActionsStore.dispatch(deleteRecordActions.setDeleteRecord(mockData.mockRecordToDelete));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when clearing a loaded record to delete', async () => {
            const expectedActions = [actions.DELETE_RECORD_CLEAR];

            try {
                await mockActionsStore.dispatch(deleteRecordActions.clearDeleteRecord());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('deleteRecord action', () => {
        it('dispatches expected actions with invalid data (missing publication data)', async () => {
            const testInput = {};

            const expectedActions = [actions.DELETE_RECORD_PROCESSING, actions.DELETE_RECORD_FAILED];

            try {
                await mockActionsStore.dispatch(deleteRecordActions.deleteRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions - deleting edited book record', async () => {
            const testInput = {
                publication: {
                    ...mockData.mockRecordToDelete,
                },
            };

            const expectedActions = [actions.DELETE_RECORD_PROCESSING, actions.DELETE_RECORD_SUCCESS];

            mockApi
                .onDelete(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: 'Record deleted' });

            try {
                await mockActionsStore.dispatch(deleteRecordActions.deleteRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for successful delete a record with reason', async () => {
            const testInput = {
                publication: {
                    ...mockData.mockRecordToDelete,
                },
                reason: 'reason',
            };

            const expectedActions = [actions.DELETE_RECORD_PROCESSING, actions.DELETE_RECORD_SUCCESS];

            mockApi
                .onDelete(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: 'Record deleted' });

            try {
                await mockActionsStore.dispatch(deleteRecordActions.deleteRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions for record delete with API returning error', async () => {
            const testInput = {
                publication: {
                    ...mockData.mockRecordToDelete,
                },
            };

            const expectedActions = [
                actions.DELETE_RECORD_PROCESSING,
                actions.APP_ALERT_SHOW,
                actions.DELETE_RECORD_FAILED,
            ];

            mockApi.onAny().reply(500, {});

            try {
                await mockActionsStore.dispatch(deleteRecordActions.deleteRecord(testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
