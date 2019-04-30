import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as publications from './publications';
import * as incompleteRecordList from 'mock/data/records/incompleteRecordList';

describe('incompleteRecords actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should call loading/loaded actions on successful load', async () => {
        mockApi
            .onGet(repositories.routes.INCOMPLETE_RECORDS_API().apiUrl)
            .reply(200, incompleteRecordList);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADED
        ];

        await mockActionsStore.dispatch(publications.searchAuthorIncompletePublications({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should call loading/load failed actions on failed load', async () => {
        mockApi
            .onAny()
            .reply(404);

        const expectedActions = [
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING,
            actions.AUTHOR_INCOMPLETEPUBLICATIONS_FAILED
        ];

        await mockActionsStore.dispatch(publications.searchAuthorIncompletePublications({}));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

});
