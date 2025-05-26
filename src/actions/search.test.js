import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as searchActions from './search';
import * as mockData from 'mock/data';
import * as ExportPublicationsActions from './exportPublications';
import { EXPORT_FORMAT_TO_EXTENSION } from 'config/general';

describe('Search action creators', () => {
    const testTitleSearchParam = 'global';

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch series of search actions for search publications', async () => {
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).options,
            )
            .reply(200, mockData.internalTitleSearchList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).options,
            )
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalPubMedSearchResultsList);

        const expectedActions = [
            actions.SEARCH_LOADING,
            `${actions.SEARCH_LOADING}@espace`,
            `${actions.SEARCH_LOADING}@wos`,
            `${actions.SEARCH_LOADING}@scopus`,
            `${actions.SEARCH_LOADING}@pubmed`,
            `${actions.SEARCH_LOADING}@crossref`,
            actions.SEARCH_SOURCE_COUNT,
            `${actions.SEARCH_LOADED}@espace`,
            `${actions.SEARCH_LOADED}@wos`,
            `${actions.SEARCH_LOADED}@scopus`,
            `${actions.SEARCH_LOADED}@pubmed`,
            `${actions.SEARCH_LOADED}@crossref`,
            actions.SEARCH_LOADED,
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for search publications with one failure', async () => {
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).options,
            )
            .reply(200, mockData.internalTitleSearchList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).options,
            )
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(500, {});

        const expectedActions = [
            actions.SEARCH_LOADING,
            `${actions.SEARCH_LOADING}@espace`,
            `${actions.SEARCH_LOADING}@wos`,
            `${actions.SEARCH_LOADING}@scopus`,
            `${actions.SEARCH_LOADING}@pubmed`,
            `${actions.SEARCH_LOADING}@crossref`,
            actions.SEARCH_SOURCE_COUNT,
            `${actions.SEARCH_LOADED}@espace`,
            `${actions.SEARCH_LOADED}@wos`,
            `${actions.SEARCH_LOADED}@scopus`,
            `${actions.SEARCH_LOADED}@crossref`,
            actions.APP_ALERT_SHOW,
            `${actions.SEARCH_FAILED}@pubmed`,
            actions.SEARCH_LOADED,
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for search publications with all failure', async () => {
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).options,
            )
            .reply(500, {})
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(500, {})
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(500, {})
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).options,
            )
            .reply(500, {})
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(500, {});

        const expectedActions = [
            actions.SEARCH_LOADING,
            `${actions.SEARCH_LOADING}@espace`,
            `${actions.SEARCH_LOADING}@wos`,
            `${actions.SEARCH_LOADING}@scopus`,
            `${actions.SEARCH_LOADING}@pubmed`,
            `${actions.SEARCH_LOADING}@crossref`,
            actions.SEARCH_SOURCE_COUNT,
            actions.APP_ALERT_SHOW,
            `${actions.SEARCH_FAILED}@espace`,
            actions.APP_ALERT_SHOW,
            `${actions.SEARCH_FAILED}@wos`,
            actions.APP_ALERT_SHOW,
            `${actions.SEARCH_FAILED}@scopus`,
            actions.APP_ALERT_SHOW,
            `${actions.SEARCH_FAILED}@crossref`,
            actions.APP_ALERT_SHOW,
            `${actions.SEARCH_FAILED}@pubmed`,
            actions.SEARCH_LOADED,
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for search publications with crossref returns no data', async () => {
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({
                    searchQuery: testTitleSearchParam,
                    pageSize: 5,
                    sortBy: 'score',
                    sortDirection: 'desc',
                }).options,
            )
            .reply(200, mockData.internalTitleSearchList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'wos', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'scopus', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({
                    source: 'crossref',
                    searchQuery: testTitleSearchParam,
                }).options,
            )
            .reply(200, {})
            .onGet(
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({ source: 'pubmed', searchQuery: testTitleSearchParam })
                    .options,
            )
            .reply(200, mockData.externalPubMedSearchResultsList);

        const expectedActions = [
            actions.SEARCH_LOADING,
            `${actions.SEARCH_LOADING}@espace`,
            `${actions.SEARCH_LOADING}@wos`,
            `${actions.SEARCH_LOADING}@scopus`,
            `${actions.SEARCH_LOADING}@pubmed`,
            `${actions.SEARCH_LOADING}@crossref`,
            actions.SEARCH_SOURCE_COUNT,
            `${actions.SEARCH_LOADED}@espace`,
            `${actions.SEARCH_LOADED}@wos`,
            `${actions.SEARCH_LOADED}@scopus`,
            `${actions.SEARCH_LOADED}@pubmed`,
            `${actions.SEARCH_LOADED}@crossref`,
            actions.SEARCH_LOADED,
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions for anon user', async () => {
        mockApi.onAny().reply(401);

        const expectedActions = [
            actions.SEARCH_LOADING,
            `${actions.SEARCH_LOADING}@espace`,
            `${actions.SEARCH_LOADING}@wos`,
            `${actions.SEARCH_LOADING}@scopus`,
            `${actions.SEARCH_LOADING}@pubmed`,
            `${actions.SEARCH_LOADING}@crossref`,
            actions.SEARCH_SOURCE_COUNT,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            actions.CURRENT_ACCOUNT_ANONYMOUS,
            `${actions.SEARCH_FAILED}@espace`,
            `${actions.SEARCH_FAILED}@wos`,
            `${actions.SEARCH_FAILED}@scopus`,
            `${actions.SEARCH_FAILED}@pubmed`,
            `${actions.SEARCH_FAILED}@crossref`,
            actions.SEARCH_LOADED,
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch events for successful search key lookup api call', async () => {
        mockApi
            .onGet(
                repositories.routes.SEARCH_KEY_LOOKUP_API({ searchQuery: 'conference', searchKey: 'series' }).apiUrl,
                repositories.routes.SEARCH_KEY_LOOKUP_API({ searchQuery: 'conference', searchKey: 'series' }).options,
            )
            .reply(200, { data: [] });

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`,
            `${actions.SEARCH_KEY_LOOKUP_LOADED}@series`,
        ];

        await mockActionsStore.dispatch(searchActions.loadSearchKeyList('series', 'conference'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch events on error for search key lookup api call', async () => {
        mockApi.onAny().reply(404, {});

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`,
            `${actions.SEARCH_KEY_LOOKUP_FAILED}@series`,
        ];

        await mockActionsStore.dispatch(searchActions.loadSearchKeyList('series', 'conference'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch events for successful author lookup up api call', async () => {
        mockApi
            .onGet(
                repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: 'test', searchKey: 'author' }).apiUrl,
                repositories.routes.SEARCH_AUTHOR_LOOKUP_API({ searchQuery: 'test', searchKey: 'author' }).options,
            )
            .reply(200, { data: [] });

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@author`,
            `${actions.SEARCH_KEY_LOOKUP_LOADED}@author`,
        ];

        await mockActionsStore.dispatch(searchActions.loadSearchKeyList('author', 'test'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for eSpace only search', async () => {
        const searchParams = { title: 'abc' };
        const params = { searchQueryParams: searchParams, sortBy: 'score2' };
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).options,
            )
            .reply(200, mockData.internalTitleSearchList);

        const expectedActions = [actions.SET_SEARCH_QUERY, actions.SEARCH_LOADING, actions.SEARCH_LOADED];

        await mockActionsStore.dispatch(searchActions.searchEspacePublications(params));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for eSpace only search when search fails', async () => {
        const searchParams = { title: 'abc' };
        const params = { searchParams: searchParams, sortBy: 'score' };
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).options,
            )
            .reply(500, mockData.internalTitleSearchList);

        const expectedActions = [
            actions.SET_SEARCH_QUERY,
            actions.SEARCH_LOADING,
            actions.APP_ALERT_SHOW,
            actions.SEARCH_FAILED,
        ];

        await mockActionsStore.dispatch(searchActions.searchEspacePublications(searchParams));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispath search key lookup actions on success', async () => {
        const searchKey = 'collection';
        const searchQuery = 'test';
        const params = {
            searchQueryParams: { rek_object_type: 2, all: searchQuery },
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'desc',
            facets: {},
        };
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).options,
            )
            .reply(200, mockData.collectionSearchList);

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`,
            `${actions.SEARCH_KEY_LOOKUP_LOADED}@${searchKey}`,
        ];
        await mockActionsStore.dispatch(searchActions.loadCollectionsList(searchKey, searchQuery));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispath search key lookup actions on error', async () => {
        const searchKey = 'collection';
        const searchQuery = 'test';
        const params = {
            searchQueryParams: { rek_object_type: 2, all: searchQuery },
            page: 1,
            pageSize: 20,
            sortBy: 'title',
            sortDirection: 'Asc',
            facets: {},
        };
        mockApi
            .onGet(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).options,
            )
            .reply(500, {});

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`,
            // actions.APP_ALERT_SHOW,
            `${actions.SEARCH_KEY_LOOKUP_FAILED}@${searchKey}`,
        ];
        await mockActionsStore.dispatch(searchActions.loadCollectionsList(searchKey, searchQuery));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for eSpace only search when searching', async () => {
        const searchQuery = 'test';
        const searchKey = 'publications';
        const params = { searchQueryParams: { all: searchQuery } };
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl).reply(200, { data: [] });

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`,
            `${actions.SEARCH_KEY_LOOKUP_LOADED}@${searchKey}`,
        ];

        await mockActionsStore.dispatch(searchActions.loadPublicationList(searchKey, searchQuery));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for eSpace only search failed when searching', async () => {
        const searchQuery = 'test';
        const searchKey = 'publications';
        const params = { searchQueryParams: { all: searchQuery } };
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl).reply(404, { data: [] });

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`,
            `${actions.SEARCH_KEY_LOOKUP_FAILED}@${searchKey}`,
        ];

        await mockActionsStore.dispatch(searchActions.loadPublicationList(searchKey, searchQuery));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions on clearing search', () => {
        const expectedActions = [actions.CLEAR_SEARCH_QUERY];

        mockActionsStore.dispatch(searchActions.clearSearchQuery());
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for related services search by ror id', async () => {
        const rorId = '024mw5h28';
        mockApi.onGet(repositories.routes.ROR_LOOKUP_API({ id: rorId }).apiUrl).reply(200, mockData.rorLookup);

        const expectedActions = [actions.RELATED_SERVICE_LOOKUP_LOADING, actions.RELATED_SERVICE_LOOKUP_LOADED];

        await mockActionsStore.dispatch(searchActions.loadRelatedServiceList(rorId));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for related services search by doi', async () => {
        const doi = '10.1111/11.11';
        const params = {
            searchQueryParams: { all: doi },
            page: 1,
            pageSize: 20,
            sortBy: 'score',
            sortDirection: 'Desc',
            facets: {},
        };

        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl)
            .reply(200, mockData.publicationTypeListInstrument);

        const expectedActions = [actions.RELATED_SERVICE_LOOKUP_LOADING, actions.RELATED_SERVICE_LOOKUP_LOADED];

        await mockActionsStore.dispatch(searchActions.loadRelatedServiceList(doi));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for related services search failed', async () => {
        const rorId = '024mw5h28';
        mockApi.onGet(repositories.routes.ROR_LOOKUP_API(rorId).apiUrl).reply(404, { data: [] });

        const expectedActions = [actions.RELATED_SERVICE_LOOKUP_LOADING, actions.RELATED_SERVICE_LOOKUP_FAILED];

        await mockActionsStore.dispatch(searchActions.loadRelatedServiceList(rorId));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions on collection list', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({}).apiUrl).reply(200, { data: [1, 2, 3] });

        const expectedActions = [actions.SEARCH_COLLECTION_LOADING, actions.SEARCH_COLLECTION_LOADED];

        await mockActionsStore.dispatch(searchActions.collectionsList());
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions on collection list fetch error', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({}).apiUrl).reply(404, {});

        const expectedActions = [actions.SEARCH_COLLECTION_LOADING, actions.SEARCH_COLLECTION_FAILED];

        await mockActionsStore.dispatch(searchActions.collectionsList());
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions on community list', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({}).apiUrl).reply(200, { data: [1, 2, 3] });

        const expectedActions = [actions.SEARCH_COMMUNITIES_LOADING, actions.SEARCH_COMMUNITIES_LOADED];

        await mockActionsStore.dispatch(searchActions.communitiesList());
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions on community list fetch error', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({}).apiUrl).reply(404, {});

        const expectedActions = [actions.SEARCH_COMMUNITIES_LOADING, actions.SEARCH_COMMUNITIES_FAILED];

        await mockActionsStore.dispatch(searchActions.communitiesList());
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    describe('exportEspacePublications()', () => {
        let exportPublications;

        beforeEach(() => {
            exportPublications = jest.spyOn(ExportPublicationsActions, 'exportPublications');
        });

        it('calls exportPublications with expected params', async () => {
            const exportPublicationsFormat = Object.keys(EXPORT_FORMAT_TO_EXTENSION)[0];
            const testRequest = {
                exportPublicationsFormat,
                page: 1,
                pageSize: 20,
                sortBy: 'score',
                sortDirection: 'Desc',
                activeFacets: { filters: {}, ranges: {} },
            };

            searchActions.exportEspacePublications(testRequest);
            expect(exportPublications).toHaveBeenCalledWith(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(testRequest, 'export'),
            );
        });

        it('should call records API with no facets if none provided', () => {
            const testRequest = {
                activeFacets: false,
            };
            searchActions.exportEspacePublications(testRequest);
            expect(exportPublications).toHaveBeenCalledWith(
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(testRequest, 'export'),
            );
        });
    });

    describe('collectionsList', () => {
        const successfulCollectionRequest = {
            total: 2,
            took: 23,
            per_page: 20,
            current_page: 1,
            from: 1,
            to: 2,
            data: [
                {
                    rek_pid: 'UQ:734481',
                    rek_title_xsdmf_id: 58,
                    rek_title: 'Andrew Martlew - Security Testing New Security Interface - Administrators',
                    redacted: true,
                },
                {
                    rek_pid: 'UQ:734482',
                    rek_title_xsdmf_id: 58,
                    rek_title: 'Andrew Martlew - Security Testing New Security Interface - Staff and Students',
                    redacted: true,
                },
            ],
            filters: {
                redacted: true,
            },
        };

        it('should dispatch 2 actions on successful collectionsList request', async () => {
            mockApi.onAny().reply(200, successfulCollectionRequest);

            const expectedActions = [actions.SEARCH_COLLECTION_LOADING, actions.SEARCH_COLLECTION_LOADED];

            await mockActionsStore.dispatch(searchActions.collectionsList('UQ:1234'));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('should dispatch 3 actions on error 500 on collectionsList request', async () => {
            mockApi.onAny().reply(500, { data: '' });

            const expectedActions = [
                actions.SEARCH_COLLECTION_LOADING,
                actions.APP_ALERT_SHOW,
                actions.SEARCH_COLLECTION_FAILED,
            ];

            try {
                await mockActionsStore.dispatch(searchActions.collectionsList('invalid'));
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });
    });
});
