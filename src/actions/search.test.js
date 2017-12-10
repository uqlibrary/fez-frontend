import MockAdapter from 'axios-mock-adapter';

import {api} from 'config';

import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as searchActions from './search';

import {getMockStore, expectStoreHasExpectedActions} from './actions-test-commons';
import * as mockData from "../mock/data";

const store = getMockStore();

describe('Search action creators', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(api, {delayResponse: 100});
    });

    afterEach(() => {
        mock.reset();
        store.clearActions();
    });

    it('should dispatch series of search actions for search publications', () => {
        mock.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: 'global', pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: 'global'}))
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: 'global'}))
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: 'global'}))
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: 'global'}))
            .reply(200, mockData.externalPubMedSearchResultsList);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: `${actions.SEARCH_COMPLETED}@espace`},
            {type: `${actions.SEARCH_COMPLETED}@wos`},
            {type: `${actions.SEARCH_COMPLETED}@scopus`},
            {type: `${actions.SEARCH_COMPLETED}@pubmed`},
            {type: `${actions.SEARCH_COMPLETED}@crossref`},
            {type: actions.SEARCH_COMPLETED}
        ];

        return store.dispatch(searchActions.searchPublications('global')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch series of search actions for search publications with one failure', () => {
        mock.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: 'global', pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: 'global'}))
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: 'global'}))
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: 'global'}))
            .reply(200, mockData.externalDoiSearchResultList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: 'global'}))
            .reply(500);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: `${actions.SEARCH_COMPLETED}@espace`},
            {type: `${actions.SEARCH_COMPLETED}@wos`},
            {type: `${actions.SEARCH_COMPLETED}@scopus`},
            {type: `${actions.SEARCH_COMPLETED}@crossref`},
            {type: `${actions.SEARCH_FAILED}@pubmed`},
            {type: actions.SEARCH_COMPLETED}
        ];

        return store.dispatch(searchActions.searchPublications('global')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch series of search actions for search publications with crossref returns no data', () => {
        mock.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: 'global', pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(200, mockData.internalTitleSearchList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: 'global'}))
            .reply(200, mockData.externalTitleSearchResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: 'global'}))
            .reply(200, mockData.externalTitleScopusResultsList)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: 'global'}))
            .reply(200, [])
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: 'global'}))
            .reply(200, mockData.externalPubMedSearchResultsList);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: `${actions.SEARCH_COMPLETED}@espace`},
            {type: `${actions.SEARCH_COMPLETED}@wos`},
            {type: `${actions.SEARCH_COMPLETED}@scopus`},
            {type: `${actions.SEARCH_COMPLETED}@pubmed`},
            {type: `${actions.SEARCH_COMPLETED}@crossref`},
            {type: actions.SEARCH_COMPLETED}
        ];

        return store.dispatch(searchActions.searchPublications('global')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch series of actions when user is not logged in', () => {
        mock.onGet(repositories.routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: 'global', pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: 'global'}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: 'global'}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: 'global'}))
            .reply(403)
            .onGet(repositories.routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: 'global'}))
            .reply(403);

        const expectedActions = [
            {type: actions.SEARCH_LOADING},
            {type: `${actions.SEARCH_LOADING}@espace`},
            {type: `${actions.SEARCH_LOADING}@wos`},
            {type: `${actions.SEARCH_LOADING}@scopus`},
            {type: `${actions.SEARCH_LOADING}@pubmed`},
            {type: `${actions.SEARCH_LOADING}@crossref`},
            {type: actions.SEARCH_SOURCE_COUNT},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: `${actions.SEARCH_FAILED}@espace`},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: `${actions.SEARCH_FAILED}@wos`},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: `${actions.SEARCH_FAILED}@scopus`},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: `${actions.SEARCH_FAILED}@pubmed`},
            {type: actions.ACCOUNT_ANONYMOUS},
            {type: `${actions.SEARCH_FAILED}@crossref`},
            {type: actions.SEARCH_COMPLETED}
        ];

        return store.dispatch(searchActions.searchPublications('global')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        });
    });

    it('should dispatch events for successful search key lookup api call', () => {
        mock.onGet(repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'conference', searchKey: 'series'}))
            .reply(200, {data: mockData.searchKeyList['series'].filter(item => (item.toLowerCase().indexOf('conference') >= 0))});

        const expectedActions = [
            {type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`},
            {type: `${actions.SEARCH_KEY_LOOKUP_LOADED}@series`},
        ];

        return store.dispatch(searchActions.loadSearchKeyList('series', 'conference')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        })
    });

    it('should dispatch events on error for search key lookup api call', () => {
        mock.onGet(repositories.routes.SEARCH_KEY_LOOKUP_API({searchQuery: 'conference', searchKey: 'series'}))
            .reply(404, {});

        const expectedActions = [
            {type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@series`},
            {type: `${actions.SEARCH_KEY_LOOKUP_FAILED}@series`},
        ];

        return store.dispatch(searchActions.loadSearchKeyList('series', 'conference')).then(() => {
            expectStoreHasExpectedActions(store, expectedActions);
        })
    });

});