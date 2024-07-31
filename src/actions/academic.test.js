import { hindexResponse, currentAuthorStats } from 'mock/data/academicStats';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as academicActions from './academic';

describe('Academic action creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch 5 actions on successful fetch of academic stats for current author', async () => {
        mockApi.onAny().reply(200, currentAuthorStats);

        const expectedActions = [
            actions.AUTHOR_PUBLICATIONS_STATS_LOADING,
            actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
            actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED,
            actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED,
            actions.AUTHOR_PUBLICATIONS_STATS_LOADED,
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it(
        'should dispatch 5 actions on successful fetch of academic stats ' +
            '(missing facets_count) on response for current author',
        async () => {
            delete currentAuthorStats.facets;

            mockApi.onAny().reply(200, currentAuthorStats);

            const expectedActions = [
                actions.AUTHOR_PUBLICATIONS_STATS_LOADING,
                actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
                actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED,
                actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED,
                actions.AUTHOR_PUBLICATIONS_STATS_LOADED,
            ];

            await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        },
    );

    it('should dispatch 3 actions on error 401 while fetching current author stats data', async () => {
        mockApi.onAny().reply(401);

        const expectedActions = [
            actions.AUTHOR_PUBLICATIONS_STATS_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.AUTHOR_PUBLICATIONS_STATS_FAILED,
        ];

        await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it(
        "should dispatch 5 actions on successful fetch of author's " +
            'publication stats data and successful hindex api call',
        async () => {
            mockApi
                .onGet(repositories.routes.AUTHOR_PUBLICATIONS_STATS_ONLY_API({ userId: 'testuser' }).apiUrl)
                .reply(200, currentAuthorStats)
                .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: 'testuser' }).apiUrl)
                .reply(200, hindexResponse);

            const expectedActions = [
                actions.AUTHOR_PUBLICATIONS_STATS_LOADING,
                actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
                actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED,
                actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED,
                actions.AUTHOR_PUBLICATIONS_STATS_LOADED,
            ];

            await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        },
    );

    it(
        "should dispatch 5 actions on error with stats while fetching author's " +
            'publication stats data but error on hindex api call',
        async () => {
            mockApi
                .onGet(repositories.routes.AUTHOR_PUBLICATIONS_STATS_ONLY_API({ userId: 'testuser' }).apiUrl)
                .reply(200, currentAuthorStats)
                .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: 'testuser' }).apiUrl)
                .reply(500, {});

            const expectedActions = [
                actions.AUTHOR_PUBLICATIONS_STATS_LOADING,
                actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
                actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED,
                actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED,
                actions.APP_ALERT_SHOW,
                actions.AUTHOR_PUBLICATIONS_STATS_LOADED,
            ];

            await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        },
    );

    it(
        "should dispatch 2 actions on success with empty response while fetching author's " +
            'publication stats data but error on hindex api call',
        async () => {
            mockApi
                .onGet(repositories.routes.AUTHOR_PUBLICATIONS_STATS_ONLY_API({ userId: 'testuser' }).apiUrl)
                .reply(200)
                .onAny()
                .reply(500, {});

            const expectedActions = [
                actions.AUTHOR_PUBLICATIONS_STATS_LOADING,
                actions.AUTHOR_PUBLICATIONS_COUNT_PER_TYPE_LOADED,
                actions.AUTHOR_PUBLICATIONS_COUNT_TOTAL_LOADED,
                actions.AUTHOR_PUBLICATIONS_BY_YEAR_LOADED,
                actions.APP_ALERT_SHOW,
                actions.AUTHOR_PUBLICATIONS_STATS_FAILED,
            ];

            await mockActionsStore.dispatch(academicActions.loadAuthorPublicationsStats('testuser'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        },
    );
});
