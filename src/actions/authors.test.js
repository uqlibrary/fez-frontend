import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as authorsActions from './authors';
import * as mockData from 'mock/data';
import { pathConfig } from 'config/pathConfig';

describe('Action creators for authors', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('dispatches expected actions while searching for authors', async () => {
        const testParam = 'abc';
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, mockData.authorsSearch);

        const expectedActions = [actions.AUTHORS_LOADING, actions.AUTHORS_LOADED];

        await mockActionsStore.dispatch(authorsActions.searchAuthors(testParam));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions while searching for authors with filter', async () => {
        const testParam = 'abc';
        const testFilterParam = item => {
            return !!item.aut_org_username;
        };
        const testRequest = { query: testParam };

        mockApi.onGet(repositories.routes.AUTHORS_SEARCH_API(testRequest).apiUrl).reply(200, mockData.authorsSearch);

        const expectedActions = [actions.AUTHORS_LOADING, actions.AUTHORS_LOADED];

        await mockActionsStore.dispatch(authorsActions.searchAuthors(testParam, testFilterParam));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions while searching for authors by anon user', async () => {
        const testParam = 'abc';

        mockApi.onAny().reply(401, mockData.authorsSearch);

        const expectedActions = [
            actions.AUTHORS_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.AUTHORS_LOAD_FAILED,
        ];

        await mockActionsStore.dispatch(authorsActions.searchAuthors(testParam));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions while searching for authors with failed API call', async () => {
        const testParam = 'abc';

        mockApi.onAny().reply(500, mockData.authorsSearch);

        const expectedActions = [actions.AUTHORS_LOADING, actions.APP_ALERT_SHOW, actions.AUTHORS_LOAD_FAILED];

        await mockActionsStore.dispatch(authorsActions.searchAuthors(testParam));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should update fez-author record successfully if API call succeeded', async () => {
        const authorId = 1234;
        const patchRequest = { aut_id: authorId, aut_google_scholar_id: '1001' };

        mockApi.onAny().reply(200, mockData.currentAuthor.uqresearcher);

        const expectedActions = [actions.CURRENT_AUTHOR_SAVING, actions.CURRENT_AUTHOR_SAVED];

        await mockActionsStore.dispatch(authorsActions.updateCurrentAuthor(authorId, patchRequest));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should fail update fez-author record if API call failed', async () => {
        const authorId = 1234;
        const patchRequest = { aut_id: authorId, aut_google_scholar_id: '1001' };

        mockApi.onAny().reply(500);

        const expectedActions = [
            actions.CURRENT_AUTHOR_SAVING,
            actions.APP_ALERT_SHOW,
            actions.CURRENT_AUTHOR_SAVE_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(authorsActions.updateCurrentAuthor(authorId, patchRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('should fail update fez-author record for anon user', async () => {
        const authorId = 1234;
        const patchRequest = { aut_id: authorId, aut_google_scholar_id: '1001' };

        mockApi.onAny().reply(401);

        const expectedActions = [
            actions.CURRENT_AUTHOR_SAVING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.CURRENT_AUTHOR_SAVE_FAILED,
        ];

        try {
            await mockActionsStore.dispatch(authorsActions.updateCurrentAuthor(authorId, patchRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        } catch (e) {
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        }
    });

    it('should link author to orcid and update fez-author record successfully if API call succeeded', async () => {
        const userId = 'uqresearcher';
        const authorId = 1234;
        const orcidCode = '123ABC';

        // parameters required for AUTHOR_ORCID_DETAILS_API call
        const params = {
            code: orcidCode,
            redirUri: pathConfig.authorIdentifiers.orcid.absoluteLink,
        };

        const patchRequest = { aut_id: authorId, authorOrcidDetails: mockData.authorOrcidDetails.orcid };

        mockApi
            .onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({ userId: userId, params: params }).apiUrl)
            .reply(200, { ...mockData.authorOrcidDetails })
            .onPatch(repositories.routes.AUTHOR_API({ authorId: authorId }, patchRequest).apiUrl)
            .reply(200, mockData.currentAuthor.uqresearcher);

        const expectedActions = [actions.CURRENT_AUTHOR_SAVING, actions.CURRENT_AUTHOR_SAVED];

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(userId, authorId, orcidCode));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions if orcid linking failed', async () => {
        const userId = 'uqresearcher';
        const authorId = 1234;
        const orcidCode = '123ABC';

        mockApi.onAny().reply(500, {});

        const expectedActions = [
            actions.CURRENT_AUTHOR_SAVING,
            actions.APP_ALERT_SHOW,
            actions.CURRENT_AUTHOR_SAVE_FAILED,
        ];

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(userId, authorId, orcidCode));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions if orcid linking returned no orcid value', async () => {
        const userId = 'uqresearcher';
        const authorId = 1234;
        const orcidCode = '123ABC';

        // parameters required for AUTHOR_ORCID_DETAILS_API call
        const params = {
            code: orcidCode,
            redirUri: pathConfig.authorIdentifiers.orcid.absoluteLink,
        };

        const patchRequest = { aut_id: authorId, authorOrcidDetails: mockData.authorOrcidDetails.orcid };

        mockApi
            .onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({ userId: userId, params: params }).apiUrl)
            .reply(200, { ...mockData.authorOrcidDetails, orcid: null })
            .onPatch(repositories.routes.CURRENT_AUTHOR_API({ authorId: authorId }, patchRequest).apiUrl)
            .reply(200, mockData.currentAuthor.uqresearcher);

        const expectedActions = [actions.CURRENT_AUTHOR_SAVING, actions.CURRENT_AUTHOR_SAVE_FAILED];

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(userId, authorId, orcidCode));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions if orcid linking author update failed', async () => {
        const userId = 'uqresearcher';
        const authorId = 1234;
        const orcidCode = '123ABC';

        // parameters required for AUTHOR_ORCID_DETAILS_API call
        const params = {
            code: orcidCode,
            redirUri: pathConfig.authorIdentifiers.orcid.absoluteLink,
        };

        mockApi
            .onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({ userId: userId, params: params }).apiUrl)
            .reply(200, { ...mockData.authorOrcidDetails })
            .onAny()
            .reply(500, {});

        const expectedActions = [
            actions.CURRENT_AUTHOR_SAVING,
            actions.APP_ALERT_SHOW,
            actions.CURRENT_AUTHOR_SAVE_FAILED,
        ];

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(userId, authorId, orcidCode));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions if orcid linking fails pre-check', async () => {
        const userId = 'uqresearcher';
        const authorId = 1234;
        const orcidCode = '123ABC';

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(null, authorId, orcidCode));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions([actions.CURRENT_AUTHOR_SAVE_FAILED]);

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(userId, null, orcidCode));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions([
            actions.CURRENT_AUTHOR_SAVE_FAILED,
            actions.CURRENT_AUTHOR_SAVE_FAILED,
        ]);

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(userId, authorId, null));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions([
            actions.CURRENT_AUTHOR_SAVE_FAILED,
            actions.CURRENT_AUTHOR_SAVE_FAILED,
            actions.CURRENT_AUTHOR_SAVE_FAILED,
        ]);
    });

    it('dispatches expected actions resetting author saving state', async () => {
        const expectedActions = [actions.CURRENT_AUTHOR_SAVE_RESET];

        await mockActionsStore.dispatch(authorsActions.resetSavingAuthorState());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches expected actions to clear authors list', async () => {
        const expectedActions = [actions.CLEAR_AUTHORS_LIST];

        await mockActionsStore.dispatch(authorsActions.clearAuthorsSuggestions());
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
