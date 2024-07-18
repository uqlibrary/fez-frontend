import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as viewRecordActions from './viewRecord';
import { removeShadowSuffixFromTableNames } from './viewRecord';
import * as mockData from 'mock/data';
import { recordVersion } from 'mock/data';
import { locale } from 'locale';
import { DELETED, PUBLICATION_TYPE_DATA_COLLECTION } from '../config/general';

describe('View record actions', () => {
    const testPid = 'UQ:396321';
    const testVersion = recordVersion.rek_version;

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadRecordVersionToView action', () => {
        it('test removeShadowSuffixFromTableNames', async () => {
            expect(mockData.recordVersionLegacy).toHaveProperty('fez_record_search_key_author_id_shadow');
            expect(mockData.recordVersionLegacy).not.toHaveProperty('fez_record_search_key_author_id');
            const record = removeShadowSuffixFromTableNames(mockData.recordVersionLegacy);
            expect(record).not.toHaveProperty('fez_record_search_key_author_id_shadow');
            expect(record).toHaveProperty('fez_record_search_key_author_id');
        });

        it('dispatches expected actions when loading a record to view from API successfully', async () => {
            mockApi
                .onGet(repositories.routes.EXISTING_RECORD_VERSION_API(testPid, testVersion).apiUrl)
                .reply(200, { data: { ...mockData.recordVersionLegacy } });

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_LOADED];

            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordVersionToView(testPid, testVersion));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record version to view from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.VIEW_RECORD_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_RECORD_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadRecordVersionToView(testPid, testVersion));
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
            expect(
                result.filter(action => action.type === actions.VIEW_RECORD_LOAD_FAILED).pop().payload,
            ).toHaveProperty('message', locale.global.errorMessages[500].message);
        });

        it('dispatches expected actions when loading a deleted record version to view', async () => {
            mockApi.onGet(repositories.routes.EXISTING_RECORD_VERSION_API(testPid, testVersion).apiUrl).reply(410, {
                status: 410,
                message: 'Some test message',
                data: { ...mockData.record },
            });

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_VERSION_DELETED_LOADED];

            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordVersionToView(testPid, testVersion));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('loadRecordToView action', () => {
        it('dispatches expected actions when loading a record to view from API successfully', async () => {
            mockApi
                .onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: { ...mockData.record } });

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_LOADED];

            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to view from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.VIEW_RECORD_LOADING,
                actions.APP_ALERT_SHOW,
                actions.VIEW_RECORD_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
            expect(
                result.filter(action => action.type === actions.VIEW_RECORD_LOAD_FAILED).pop().payload,
            ).toHaveProperty('message', locale.global.errorMessages[500].message);
        });

        it('dispatches expected actions when loading a deleted record to view', async () => {
            mockApi.onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl).reply(410, {
                status: 410,
                message: 'Some test message',
                data: { ...mockData.record },
            });

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_DELETED_LOADED];

            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a data collection that has been deleted', async () => {
            mockApi.onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl).reply(200, {
                status: 200,
                message: 'Some test message',
                data: {
                    ...mockData.record,
                    rek_status: DELETED,
                    rek_display_type: PUBLICATION_TYPE_DATA_COLLECTION,
                },
            });

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_DELETED_LOADED];

            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a missing record to view', async () => {
            mockApi.onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl).reply(404);

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_LOAD_FAILED];

            try {
                await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to view from API for anon user', async () => {
            mockApi.onAny().reply(401);

            const expectedActions = [
                actions.VIEW_RECORD_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.VIEW_RECORD_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
            const result = mockActionsStore.getActions();
            expect(result).toHaveDispatchedActions(expectedActions);
            expect(
                result.filter(action => action.type === actions.VIEW_RECORD_LOAD_FAILED).pop().payload,
            ).toHaveProperty('message', locale.global.errorMessages[401].message);
        });

        it('dispatches expected actions when loading a non-exist record to view from API', async () => {
            mockApi.onAny().reply(404);

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_LOAD_FAILED];

            await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('setting/clearing record to view action', () => {
        it('dispatches expected actions when clearing a loaded record to view', async () => {
            const expectedActions = [actions.VIEW_RECORD_CLEAR];

            try {
                await mockActionsStore.dispatch(viewRecordActions.clearRecordToView());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('unlock record to view action', () => {
        it('dispatches expected actions when unlocking a loaded record to view', async () => {
            const expectedActions = [actions.VIEW_RECORD_UNLOCK];

            try {
                await mockActionsStore.dispatch(viewRecordActions.unlockRecordToView());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
