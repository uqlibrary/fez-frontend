import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as viewRecordActions from './viewRecord';
import * as mockData from 'mock/data';
import { locale } from 'locale';

describe('View record actions', () => {
    const testPid = 'UQ:396321';

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
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            expect(mockActionsStore.getActions()).toContainEqual({
                type: actions.VIEW_RECORD_LOAD_FAILED,
                payload: locale.global.errorMessages[500],
            });
        });

        it('dispatches expected actions when loading a deleted record to view', async () => {
            mockApi.onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl).reply(410, {
                status: 410,
                message: 'Some test message',
                data: { ...mockData.record },
            });

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_DELETED];

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
            mockApi.onAny().reply(403);

            const expectedActions = [
                actions.VIEW_RECORD_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.VIEW_RECORD_LOAD_FAILED,
            ];

            await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            expect(mockActionsStore.getActions()).toContainEqual({
                type: actions.VIEW_RECORD_LOAD_FAILED,
                payload: locale.global.errorMessages[403],
            });
        });

        it('dispatches expected actions when loading a non-exist record to view from API', async () => {
            mockApi.onAny().reply(404);

            const expectedActions = [actions.VIEW_RECORD_LOADING, actions.VIEW_RECORD_LOAD_FAILED];

            await mockActionsStore.dispatch(viewRecordActions.loadRecordToView(testPid));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatch expected actions on hiding cultural sensitivity statement', () => {
            mockActionsStore.dispatch(viewRecordActions.setHideCulturalSensitivityStatement());
            expect(mockActionsStore.getActions()).toContainEqual({
                type: actions.VIEW_RECORD_CULTURAL_SENSITIVITY_STATEMENT_HIDE,
            });
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
