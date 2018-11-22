jest.mock('./exportPublications');

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as searchActions from './search';
import * as mockData from "mock/data";
import {exportPublications} from "./exportPublications";
import {exportFormatToExtension} from 'config/general';

beforeEach(() => {
    exportPublications.mockClear();
});

describe('Search action creators', () => {
    const testTitleSearchParam = 'global';

    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});
    expect.extend({toHaveAnyOrderDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('should dispatch series of search actions for search publications', async () => {
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}).options)
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}).options)
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
            actions.SEARCH_LOADED
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for search publications with one failure', async () => {
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}).options)
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}).options)
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
            `${actions.SEARCH_FAILED}@pubmed`,
            actions.SEARCH_LOADED
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for search publications with crossref returns no data', async () => {
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}).options)
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}).options)
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}).options)
            .reply(200, {})
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}).apiUrl,
                repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}).options)
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
            actions.SEARCH_LOADED
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions for anon user', async () => {
        mockApi.onAny()
            .reply(403);

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
            actions.SEARCH_LOADED
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch events for successful search key lookup api call', async () => {
        mockApi
            .onGet(repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'conference', searchKey: 'series'}).apiUrl,
                repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'conference', searchKey: 'series'}).options)
            .reply(200, {data: []});

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`,
            `${actions.SEARCH_KEY_LOOKUP_LOADED}@series`,
        ];

        await mockActionsStore.dispatch(searchActions.loadSearchKeyList('series', 'conference'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch events on error for search key lookup api call', async () => {
        mockApi
            .onAny()
            .reply(404, {});

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`,
            `${actions.SEARCH_KEY_LOOKUP_FAILED}@series`,
        ];

        await mockActionsStore.dispatch(searchActions.loadSearchKeyList('series', 'conference'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for eSpace only search', async () => {
        const searchParams = {title: 'abc'};
        const params = {searchQueryParams: searchParams, sortBy: 'score2'};
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).options)
            .reply(200, mockData.internalTitleSearchList);

        const expectedActions = [
            actions.SET_SEARCH_QUERY,
            actions.SEARCH_LOADING,
            actions.SEARCH_LOADED
        ];

        await mockActionsStore.dispatch(searchActions.searchEspacePublications(params));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for eSpace only search when search fails', async () => {
        const searchParams = {title: 'abc'};
        const params = {searchParams: searchParams, sortBy: 'score'};
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl,
                repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).options)
            .reply(500, mockData.internalTitleSearchList);

        const expectedActions = [
            actions.SET_SEARCH_QUERY,
            actions.SEARCH_LOADING,
            actions.SEARCH_FAILED
        ];

        await mockActionsStore.dispatch(searchActions.searchEspacePublications(searchParams));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for eSpace only search when searching', async() => {
        const searchQuery = 'test';
        const searchKey = 'publications';
        const params = {searchQueryParams: {all: searchQuery}};
        mockApi
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API(params).apiUrl)
            .reply(200, {data: []});

        const expectedActions = [
            `${actions.SEARCH_KEY_LOOKUP_LOADING}@${searchKey}`,
            `${actions.SEARCH_KEY_LOOKUP_LOADED}@${searchKey}`
        ];

        await mockActionsStore.dispatch(searchActions.loadPublicationList(searchKey, searchQuery));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions on clearing search', () => {
        const expectedActions = [
            actions.CLEAR_SEARCH_QUERY
        ];

        mockActionsStore.dispatch(searchActions.clearSearchQuery());
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    describe('exportSearchPublications()', () => {
        it('calls exportPublications with expected params', async () => {

            const exportPublicationsFormat = Object.keys(exportFormatToExtension)[0];
            const testRequest = {
                exportPublicationsFormat,
                page: 1,
                pageSize: 20,
                sortBy: 'score',
                sortDirection: 'Desc',
                activeFacets: {filters: {}, ranges: {}}
            };

            searchActions.exportEspacePublications(testRequest);
            expect(exportPublications).toHaveBeenCalledWith(repositories.routes.SEARCH_INTERNAL_RECORDS_API(testRequest, 'export'));
        });
    });
});