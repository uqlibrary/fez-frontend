import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as controlledVocabActions from './controlledVocabularies';
import { vocabulariesList } from 'mock/data';

describe('Controlled Vocabularies actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    const testId = 451780;

    it('dispatches expected actions to load vocabularies from API successfully', async () => {
        const returnedApiData = vocabulariesList[testId];
        mockApi.onGet(repositories.routes.VOCABULARIES_API({ id: testId }).apiUrl).reply(200, returnedApiData);

        const expectedActions = [
            `${actions.VOCABULARIES_LOADING}@${testId}`,
            `${actions.VOCABULARIES_LOADED}@${testId}`,
        ];

        await mockActionsStore.dispatch(controlledVocabActions.loadVocabulariesList(testId));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions to load vocabularies from API for anon user', async () => {
        mockApi.onAny().reply(401);

        const expectedActions = [
            `${actions.VOCABULARIES_LOADING}@${testId}`,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            `${actions.VOCABULARIES_LOAD_FAILED}@${testId}`,
        ];

        await mockActionsStore.dispatch(controlledVocabActions.loadVocabulariesList(testId));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions to load vocabularies from API with 404 error', async () => {
        mockApi.onAny().reply(404);

        const expectedActions = [
            `${actions.VOCABULARIES_LOADING}@${testId}`,
            `${actions.VOCABULARIES_LOAD_FAILED}@${testId}`,
        ];

        await mockActionsStore.dispatch(controlledVocabActions.loadVocabulariesList(testId));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
