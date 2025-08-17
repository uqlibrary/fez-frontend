import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as feedbackRecordActions from './feedbackRecord';
import { mockRecordToFeedback } from 'mock/data/testing/records';

describe('Feedback record actions', () => {
    const testPid = 'UQ:41878';

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('loadRecordToFeedback action', () => {
        it('dispatches expected actions when loading a record to feedback from API successfully', async () => {
            mockApi
                .onGet(repositories.routes.EXISTING_RECORD_API({ pid: testPid }).apiUrl)
                .reply(200, { data: { ...mockRecordToFeedback } });

            const expectedActions = [actions.FEEDBACK_RECORD_LOADING, actions.FEEDBACK_RECORD_LOADED];

            try {
                await mockActionsStore.dispatch(feedbackRecordActions.loadRecordToFeedback(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to feedback from API failed', async () => {
            mockApi.onAny().reply(500);

            const expectedActions = [
                actions.FEEDBACK_RECORD_LOADING,
                actions.APP_ALERT_SHOW,
                actions.FEEDBACK_RECORD_LOAD_FAILED,
            ];
            try {
                await mockActionsStore.dispatch(feedbackRecordActions.loadRecordToFeedback(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions when loading a record to feedback from API with 404 error', async () => {
            mockApi.onAny().reply(404);

            const expectedActions = [
                actions.FEEDBACK_RECORD_LOADING,
                actions.FEEDBACK_RECORD_LOAD_FAILED,
            ];
            try {
                await mockActionsStore.dispatch(feedbackRecordActions.loadRecordToFeedback(testPid));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('clearing record action', () => {
        it('dispatches expected actions when clearing a loaded record to feedback', async () => {
            const expectedActions = [actions.FEEDBACK_RECORD_CLEAR];

            try {
                await mockActionsStore.dispatch(feedbackRecordActions.clearFeedbackRecord());
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });

    describe('feedbackRecord action', () => {
        it('dispatches expected actions - after feedback record', async () => {
            const testInput = {
                acknowledgedAs: '',
                community: '',
                consent: '',
                contactNo: '',
                cultureInfo: { other: 'other', otherText: 'other info', ceremonies: 'ceremonies' },
                email: '',
                firstName: '',
                icipHolder: '',
                identityType: '',
                kinshipConnection: '',
                lastName: '',
                shareDetails: { shareAnonymously: 'shareAnonymously' },
                specialCare: '',
            };

            const expectedActions = [actions.FEEDBACK_RECORD_PROCESSING, actions.FEEDBACK_RECORD_SUCCESS];

            mockApi.onPost(repositories.routes.RECORDS_FEEDBACK_API({ pid: testPid }).apiUrl).reply(201, {});

            await mockActionsStore.dispatch(feedbackRecordActions.feedbackRecord(testPid, testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for record feedback with API returning error', async () => {
            const testInput = {
                acknowledgedAs: '',
                community: '',
                consent: '',
                contactNo: '',
                cultureInfo: { other: 'other', otherText: 'other info', ceremonies: 'ceremonies' },
                email: '',
                firstName: '',
                icipHolder: '',
                identityType: '',
                kinshipConnection: '',
                lastName: '',
                shareDetails: { shareAnonymously: 'shareAnonymously' },
                specialCare: '',
            };

            const expectedActions = [
                actions.FEEDBACK_RECORD_PROCESSING,
                actions.APP_ALERT_SHOW,
                actions.FEEDBACK_RECORD_FAILED,
            ];

            mockApi.onAny().reply(500, {});

            try {
                await mockActionsStore.dispatch(feedbackRecordActions.feedbackRecord(testPid, testInput));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
