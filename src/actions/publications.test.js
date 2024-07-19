import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as publicationsActions from './publications';
import * as mockData from 'mock/data';
import * as ExportActions from './exportPublications';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

describe('Publications actions', () => {
    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('searchLatestPublications()', () => {
        it('dispatches expected actions on successful load', async () => {
            mockApi.onGet(repositories.routes.CURRENT_USER_RECORDS_API({ pageSize: 5 }).apiUrl).reply(200, {});

            const expectedActions = [actions.LATEST_PUBLICATIONS_LOADING, actions.LATEST_PUBLICATIONS_LOADED];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi.onAny().reply(401, {});

            const expectedActions = [
                actions.LATEST_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.LATEST_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if API fails', async () => {
            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.LATEST_PUBLICATIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.LATEST_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchLatestPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('searchAuthorPublications()', () => {
        describe('type: mine', () => {
            it('dispatches expected actions on successful search', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onGet(repositories.routes.CURRENT_USER_RECORDS_API(testRequest).apiUrl).reply(200, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@mine`,
                    `${actions.AUTHOR_PUBLICATIONS_LOADED}@mine`,
                ];

                await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest, 'mine'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });

            it('dispatches expected actions for anon user', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onAny().reply(401, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@mine`,
                    actions.CURRENT_ACCOUNT_ANONYMOUS,
                    `${actions.AUTHOR_PUBLICATIONS_FAILED}@mine`,
                ];

                await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest, 'mine'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });

            it('dispatches expected actions if api fails', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onAny().reply(500, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@mine`,
                    actions.APP_ALERT_SHOW,
                    `${actions.AUTHOR_PUBLICATIONS_FAILED}@mine`,
                ];

                await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest, 'mine'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });

            it('handles defaults', async () => {
                mockApi.onAny().reply(200, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@mine`,
                    `${actions.AUTHOR_PUBLICATIONS_LOADED}@mine`,
                ];
                await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications({}, 'mine'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
        });

        describe('type: incomplete', () => {
            it('dispatches expected actions on successful search', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onGet(repositories.routes.INCOMPLETE_RECORDS_API(testRequest).apiUrl).reply(200, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@incomplete`,
                    `${actions.AUTHOR_PUBLICATIONS_LOADED}@incomplete`,
                ];

                await mockActionsStore.dispatch(
                    publicationsActions.searchAuthorPublications(testRequest, 'incomplete'),
                );
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });

            it('dispatches expected actions for anon user', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onAny().reply(401, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@incomplete`,
                    actions.CURRENT_ACCOUNT_ANONYMOUS,
                    `${actions.AUTHOR_PUBLICATIONS_FAILED}@incomplete`,
                ];

                await mockActionsStore.dispatch(
                    publicationsActions.searchAuthorPublications(testRequest, 'incomplete'),
                );
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });

            it('dispatches expected actions if api fails', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onAny().reply(500, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@incomplete`,
                    actions.APP_ALERT_SHOW,
                    `${actions.AUTHOR_PUBLICATIONS_FAILED}@incomplete`,
                ];

                await mockActionsStore.dispatch(
                    publicationsActions.searchAuthorPublications(testRequest, 'incomplete'),
                );
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });

            it('handles defaults', async () => {
                mockApi.onAny().reply(200, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@incomplete`,
                    `${actions.AUTHOR_PUBLICATIONS_LOADED}@incomplete`,
                ];
                await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications({}, 'incomplete'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
        });

        describe('type: null', () => {
            it('dispatches expected actions', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onGet(repositories.routes.INCOMPLETE_RECORDS_API(testRequest).apiUrl).reply(200, {});

                const expectedActions = [`${actions.AUTHOR_PUBLICATIONS_LOADING}@test`];

                try {
                    await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest, 'test'));
                } catch (e) {
                    expect(e.message).toBe('Please provide valid type');
                    expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                }
            });
        });

        describe('default type: mine', () => {
            it('dispatches expected actions on successful search', async () => {
                const testRequest = {
                    userName: 'uqresearcher',
                    page: 1,
                    pageSize: 20,
                    sortBy: 'score',
                    sortDirection: 'desc',
                    facets: {},
                };

                mockApi.onGet(repositories.routes.CURRENT_USER_RECORDS_API(testRequest).apiUrl).reply(200, {});

                const expectedActions = [
                    `${actions.AUTHOR_PUBLICATIONS_LOADING}@mine`,
                    `${actions.AUTHOR_PUBLICATIONS_LOADED}@mine`,
                ];

                await mockActionsStore.dispatch(publicationsActions.searchAuthorPublications(testRequest));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            });
        });
    });

    describe('searchTrendingPublications()', () => {
        it('dispatches expected actions on successful request', async () => {
            mockApi
                .onGet(repositories.routes.AUTHOR_TRENDING_PUBLICATIONS_API().apiUrl)
                .reply(200, mockData.trendingPublications);

            const expectedActions = [
                actions.TRENDING_PUBLICATIONS_LOADING,
                `${actions.TRENDING_PUBLICATIONS_LOADED}@scopus`,
                `${actions.TRENDING_PUBLICATIONS_LOADED}@thomson`,
                `${actions.TRENDING_PUBLICATIONS_LOADED}@altmetric`,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            mockApi.onAny().reply(401, {});

            const expectedActions = [
                actions.TRENDING_PUBLICATIONS_LOADING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.TRENDING_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api fails', async () => {
            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.TRENDING_PUBLICATIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.TRENDING_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api return 0 publications', async () => {
            mockApi.onAny().reply(200, { total: 0, data: [], filters: [] });

            const expectedActions = [actions.TRENDING_PUBLICATIONS_LOADING, actions.TRENDING_PUBLICATIONS_LOADED];

            await mockActionsStore.dispatch(publicationsActions.searchTrendingPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('searchTopCitedPublications()', () => {
        it('dispatches expected actions on successful request', async () => {
            mockApi
                .onGet(repositories.routes.TRENDING_PUBLICATIONS_API().apiUrl)
                .reply(200, mockData.trendingPublications);

            const expectedActions = [
                actions.TOP_CITED_PUBLICATIONS_LOADING,
                `${actions.TOP_CITED_PUBLICATIONS_LOADED}@scopus`,
                `${actions.TOP_CITED_PUBLICATIONS_LOADED}@thomson`,
                `${actions.TOP_CITED_PUBLICATIONS_LOADED}@altmetric`,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTopCitedPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api fails', async () => {
            mockApi.onAny().reply(500, {});

            const expectedActions = [
                actions.TOP_CITED_PUBLICATIONS_LOADING,
                actions.APP_ALERT_SHOW,
                actions.TOP_CITED_PUBLICATIONS_FAILED,
            ];

            await mockActionsStore.dispatch(publicationsActions.searchTopCitedPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions if api return 0 publications', async () => {
            mockApi.onAny().reply(200, { total: 0, data: [], filters: [] });

            const expectedActions = [actions.TOP_CITED_PUBLICATIONS_LOADING, actions.TOP_CITED_PUBLICATIONS_LOADED];

            await mockActionsStore.dispatch(publicationsActions.searchTopCitedPublications());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('exportAuthorPublications()', () => {
        it('calls exportPublications with expected params', async () => {
            const exportPublications = jest.spyOn(ExportActions, 'exportPublications');
            const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
            const testRequest = {
                exportPublicationsFormat,
                page: 1,
                pageSize: 20,
                sortBy: 'score',
                sortDirection: 'Desc',
                activeFacets: { filters: {}, ranges: {} },
            };

            publicationsActions.exportAuthorPublications(testRequest);
            expect(exportPublications).toHaveBeenCalledWith(
                repositories.routes.CURRENT_USER_RECORDS_API(testRequest, 'export'),
            );
        });

        it('handles defaults', () => {
            const exportPublications = jest.spyOn(ExportActions, 'exportPublications');
            publicationsActions.exportAuthorPublications({});
            expect(exportPublications).toHaveBeenCalledWith({
                apiUrl: 'records/export',
                options: {
                    params: {
                        export_to: '',
                        order_by: 'desc',
                        page: 1,
                        per_page: 20,
                        rule: 'mine',
                        sort: 'score',
                    },
                },
            });
        });
    });
});
