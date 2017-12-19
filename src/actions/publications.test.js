import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as publicationsActions from './publications';
import * as mockData from 'mock/data';

describe('Publications actions', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('searchLatestPublications()', () => {

        it('dispatches expected actions on successful load', async () => {
            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
                .reply(200, {});

            const expectedActions = [
                {type: actions.LATEST_PUBLICATIONS_LOADING},
                {type: actions.LATEST_PUBLICATIONS_LOADED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
                .reply(403, {});

            const expectedActions = [
                {type: actions.LATEST_PUBLICATIONS_LOADING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.LATEST_PUBLICATIONS_FAILED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if API fails', async () => {
            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API({pageSize: 5}))
                .reply(500, {});

            const expectedActions = [
                {type: actions.LATEST_PUBLICATIONS_LOADING},
                {type: actions.LATEST_PUBLICATIONS_FAILED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('searchAuthorPublications()', () => {

        it('dispatches expected actions on successful search', async () => {
            const testRequest = {
                userName: 'uqresearcher',
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'desc',
                facets: {},
            };

            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API(testRequest))
                .reply(200, {});

            const expectedActions = [
                {type: actions.AUTHOR_PUBLICATIONS_LOADING},
                {type: actions.AUTHOR_PUBLICATIONS_LOADED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testRequest = {
                userName: 'uqresearcher',
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'desc',
                facets: {},
            };

            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API(testRequest))
                .reply(403, {});

            const expectedActions = [
                {type: actions.AUTHOR_PUBLICATIONS_LOADING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.AUTHOR_PUBLICATIONS_FAILED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api fails', async () => {
            const testRequest = {
                userName: 'uqresearcher',
                page: 1,
                pageSize: 20,
                sortBy: 'published_date',
                sortDirection: 'desc',
                facets: {},
            };

            mockApi
                .onGet(repositories.routes.CURRENT_USER_RECORDS_API(testRequest))
                .reply(500, {});

            const expectedActions = [
                {type: actions.AUTHOR_PUBLICATIONS_LOADING},
                {type: actions.AUTHOR_PUBLICATIONS_FAILED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('searchTrendingPublications()', () => {

        it('dispatches expected actions on successful request', async () => {
            const testParam = 'uqresearcher';
            const testRequest = {userId: testParam};

            mockApi
                .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API(testRequest))
                .reply(200, mockData.trendingPublications);

            const expectedActions = [
                {type: actions.TRENDING_PUBLICATIONS_LOADING},
                {type: actions.TRENDING_PUBLICATIONS_LOADED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications(testParam));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testParam = 'uqresearcher';
            const testRequest = {userId: testParam};

            mockApi
                .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API(testRequest))
                .reply(403, {});

            const expectedActions = [
                {type: actions.TRENDING_PUBLICATIONS_LOADING},
                {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
                {type: actions.TRENDING_PUBLICATIONS_FAILED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications(testParam));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api fails', async () => {
            const testParam = 'uqresearcher';
            const testRequest = {userId: testParam};

            mockApi
                .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API(testRequest))
                .reply(500, {});

            const expectedActions = [
                {type: actions.TRENDING_PUBLICATIONS_LOADING},
                {type: actions.TRENDING_PUBLICATIONS_FAILED}
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications(testParam));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });
});
