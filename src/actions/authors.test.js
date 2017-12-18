import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as authorsActions from './authors';
import {APP_URL} from 'config';
import {authorOrcidDetails} from 'mock/data/orcid';

describe('Action creators for authors', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});
    // usage:
    // expect(store.getActions()).toHaveDispatchedActions(expectedActions);

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });
    
    it('should update fez-author record successfully if API call succeeded', async () => {
        const authorId = 1234;
        const patchRequest = {aut_id: authorId, aut_google_scholar_id: '1001'};

        mockApi
            .onPatch(repositories.routes.AUTHOR_API({authorId: authorId}, patchRequest))
            .reply(200, {data: {...patchRequest}});

        const expectedActions = [
            { type: actions.CURRENT_AUTHOR_SAVING },
            { type: actions.CURRENT_AUTHOR_SAVED }
        ];

        await mockActionsStore.dispatch(authorsActions.updateCurrentAuthor(authorId, patchRequest));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should fail update fez-author record if API call failed', async () => {
        const authorId = 1234;
        const patchRequest = {aut_id: authorId, aut_google_scholar_id: '1001'};

        mockApi
            .onPatch(repositories.routes.AUTHOR_API({authorId: authorId}, patchRequest))
            .reply(500);

        const expectedActions = [
            { type: actions.CURRENT_AUTHOR_SAVING },
            { type: actions.CURRENT_AUTHOR_SAVE_FAILED }
        ];

        try {
            await mockActionsStore.dispatch(authorsActions.updateCurrentAuthor(authorId, patchRequest));
        } catch(e) {
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
            redirUri: APP_URL
        };

        const patchRequest = {aut_id: authorId, authorOrcidDetails: authorOrcidDetails.orcid};

        mockApi
            .onGet(repositories.routes.AUTHOR_ORCID_DETAILS_API({userId: userId, params: params}))
            .reply(200, {data: {...authorOrcidDetails}})
            .onPatch(repositories.routes.AUTHOR_API({authorId: authorId}, patchRequest))
            .reply(200, {data: {...patchRequest}});

        const expectedActions = [
            { type: actions.CURRENT_AUTHOR_SAVING },
            { type: actions.CURRENT_AUTHOR_SAVED }
        ];

        await mockActionsStore.dispatch(authorsActions.linkAuthorOrcidId(userId, authorId, orcidCode));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
