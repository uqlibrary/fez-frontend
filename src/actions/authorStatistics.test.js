import { hindexResponse, currentAuthorStats } from 'mock/data/academicStats';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as authorStatisticsActions from './authorStatistics';

describe('authorStatistics action creators', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('dispatches 4 actions on successful fetch with hindex', async () => {
        mockApi
            .onGet(repositories.routes.AUTHOR_STATS_BY_AUTHOR_ID_API({ authorId: '193' }).apiUrl)
            .reply(200, currentAuthorStats)
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: '193' }).apiUrl)
            .reply(200, hindexResponse);

        const expectedActions = [
            actions.AUTHOR_STATS_LOADING,
            actions.AUTHOR_STATS_PER_TYPE_LOADED,
            actions.AUTHOR_STATS_BY_YEAR_LOADED,
            actions.AUTHOR_STATS_LOADED,
        ];

        await mockActionsStore.dispatch(authorStatisticsActions.loadAuthorStatsByAuthorId('193'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches 4 actions when hindex call fails but stats data was loaded', async () => {
        mockApi
            .onGet(repositories.routes.AUTHOR_STATS_BY_AUTHOR_ID_API({ authorId: '193' }).apiUrl)
            .reply(200, currentAuthorStats)
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: '193' }).apiUrl)
            .reply(500, {});

        const expectedActions = [
            actions.AUTHOR_STATS_LOADING,
            actions.AUTHOR_STATS_PER_TYPE_LOADED,
            actions.AUTHOR_STATS_BY_YEAR_LOADED,
            actions.APP_ALERT_SHOW,
            actions.AUTHOR_STATS_LOADED,
        ];

        await mockActionsStore.dispatch(authorStatisticsActions.loadAuthorStatsByAuthorId('193'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches AUTHOR_STATS_FAILED when the stats API call fails', async () => {
        mockApi.onAny().reply(401);

        const expectedActions = [
            actions.AUTHOR_STATS_LOADING,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.AUTHOR_STATS_FAILED,
        ];

        await mockActionsStore.dispatch(authorStatisticsActions.loadAuthorStatsByAuthorId('193'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('handles facets response without Year published facet gracefully', async () => {
        const statsWithoutYearPublished = {
            total: 10,
            filters: {
                facets: {
                    'Display type': { buckets: [] },
                    stats_thomson_citation_count_i: { count: 5 },
                    stats_scopus_citation_count_i: { count: 3 },
                },
            },
        };
        mockApi
            .onGet(repositories.routes.AUTHOR_STATS_BY_AUTHOR_ID_API({ authorId: '193' }).apiUrl)
            .reply(200, statsWithoutYearPublished)
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: '193' }).apiUrl)
            .reply(200, hindexResponse);

        const expectedActions = [
            actions.AUTHOR_STATS_LOADING,
            actions.AUTHOR_STATS_PER_TYPE_LOADED,
            actions.AUTHOR_STATS_BY_YEAR_LOADED,
            actions.AUTHOR_STATS_LOADED,
        ];

        await mockActionsStore.dispatch(authorStatisticsActions.loadAuthorStatsByAuthorId('193'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches AUTHOR_STATS_FAILED when the stats API returns empty response then hindex fails', async () => {
        mockApi
            .onGet(repositories.routes.AUTHOR_STATS_BY_AUTHOR_ID_API({ authorId: '193' }).apiUrl)
            .reply(200)
            .onAny()
            .reply(500, {});

        const expectedActions = [
            actions.AUTHOR_STATS_LOADING,
            actions.AUTHOR_STATS_PER_TYPE_LOADED,
            actions.AUTHOR_STATS_BY_YEAR_LOADED,
            actions.APP_ALERT_SHOW,
            actions.AUTHOR_STATS_FAILED,
        ];

        await mockActionsStore.dispatch(authorStatisticsActions.loadAuthorStatsByAuthorId('193'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('dispatches AUTHOR_STATS_LOADED when hindex response is missing expected fields', async () => {
        mockApi
            .onGet(repositories.routes.AUTHOR_STATS_BY_AUTHOR_ID_API({ authorId: '193' }).apiUrl)
            .reply(200, currentAuthorStats)
            .onGet(repositories.routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({ userId: '193' }).apiUrl)
            .reply(200, {});

        const expectedActions = [
            actions.AUTHOR_STATS_LOADING,
            actions.AUTHOR_STATS_PER_TYPE_LOADED,
            actions.AUTHOR_STATS_BY_YEAR_LOADED,
            actions.AUTHOR_STATS_LOADED,
        ];

        await mockActionsStore.dispatch(authorStatisticsActions.loadAuthorStatsByAuthorId('193'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});
