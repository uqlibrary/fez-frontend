import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as searchActions from './search';
import * as mockData from "../mock/data";

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
            .onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalPubMedSearchResultsList);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: `${actions.SEARCH_LOADED}@espace`},
            {type: `${actions.SEARCH_LOADED}@wos`},
            {type: `${actions.SEARCH_LOADED}@scopus`},
            {type: `${actions.SEARCH_LOADED}@pubmed`},
            {type: `${actions.SEARCH_LOADED}@crossref`},
            {type: actions.SEARCH_LOADED}
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for search publications with one failure', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}))
            .reply(500);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: `${actions.SEARCH_LOADED}@espace`},
            {type: `${actions.SEARCH_LOADED}@wos`},
            {type: `${actions.SEARCH_LOADED}@scopus`},
            {type: `${actions.SEARCH_LOADED}@crossref`},
            {type: `${actions.SEARCH_FAILED}@pubmed`},
            {type: actions.SEARCH_LOADED}
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of search actions for search publications with crossref returns no data', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}))
            .reply(200, [])
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}))
            .reply(200, mockData.externalPubMedSearchResultsList);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: `${actions.SEARCH_LOADED}@espace`},
            {type: `${actions.SEARCH_LOADED}@wos`},
            {type: `${actions.SEARCH_LOADED}@scopus`},
            {type: `${actions.SEARCH_LOADED}@pubmed`},
            {type: `${actions.SEARCH_LOADED}@crossref`},
            {type: actions.SEARCH_LOADED}
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch series of actions for anon user', async () => {
        mockApi.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: testTitleSearchParam, pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: testTitleSearchParam}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: testTitleSearchParam}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: testTitleSearchParam}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: testTitleSearchParam}))
            .reply(403);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: actions.CURRENT_ACCOUNT_ANONYMOUS},
            {type: `${actions.SEARCH_FAILED}@espace`},
            {type: `${actions.SEARCH_FAILED}@wos`},
            {type: `${actions.SEARCH_FAILED}@scopus`},
            {type: `${actions.SEARCH_FAILED}@pubmed`},
            {type: `${actions.SEARCH_FAILED}@crossref`},
            {type: actions.SEARCH_LOADED}
        ];

        await mockActionsStore.dispatch(searchActions.searchPublications(testTitleSearchParam));
        expect(mockActionsStore.getActions()).toHaveAnyOrderDispatchedActions(expectedActions);
    });

    it('should dispatch events for successful search key lookup api call', async () => {
        mockApi
            .onGet(repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'conference', searchKey: 'series'}))
            .reply(200, {data: mockData.searchKeyList['series'].filter(item => (item.toLowerCase().indexOf('conference') >= 0))});

        const expectedActions = [
            {type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`},
            {type: `${actions.SEARCH_KEY_LOOKUP_LOADED}@series`},
        ];

        await mockActionsStore.dispatch(searchActions.loadSearchKeyList('series', 'conference'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });

    it('should dispatch events on error for search key lookup api call', async () => {
        mockApi
            .onGet(repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'conference', searchKey: 'series'}))
            .reply(404, {});

        const expectedActions = [
            {type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`},
            {type: `${actions.SEARCH_KEY_LOOKUP_FAILED}@series`},
        ];

        await mockActionsStore.dispatch(searchActions.loadSearchKeyList('series', 'conference'));
        expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
    });
});