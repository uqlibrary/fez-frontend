/* eslint-disable */
import {api, sessionApi} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import * as mockTestingData from './data/testing/records';

const queryString = require('query-string');
const mock = new MockAdapter(api, {delayResponse: 200});
const mockSessionApi = new MockAdapter(sessionApi, {delayResponse: 200});
const escapeRegExp = (input) => (input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&'));
// const standardQueryString = {page: '.*', pageSize: '.*', sortBy: '.*', sortDirection: '.*', facets: {}};
// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

// Get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

if (user && !mockData.accounts[user]) {
    console.warn(`API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`);
}

// default user is researcher if user is not defined
user = user || 'uqresearcher';

/*
 * Mocking CURRENT_ACCOUNT_API endpoint to check session with different instance of API
 * for thesis submissions for now
 */
mockSessionApi
    .onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
        // mock account response
        if (user === 's2222222') {
            return [200, mockData.accounts[user]];
        } else if (mockData.accounts[user]) {
            return [403, {}];
        }
        return [404, {}];
    });

mock
    .onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(() => {
    // mock account response
        if (user === 'anon') {
            return [403, {}];
        } else if (mockData.accounts[user]) {
            return [200, mockData.accounts[user]];
        }
        return [404, {}];
    })
    .onGet(routes.AUTHOR_DETAILS_API({userId: user}).apiUrl).reply(() => {
    // mock current author details
        if (user === 'anon') {
            return [403, {}];
        } else if (mockData.authorDetails[user]) {
            return [200, mockData.authorDetails[user]];
        }
        return [404, {}];
    })
    .onGet(routes.CURRENT_AUTHOR_API().apiUrl)
    .reply(() => {
        // mock current author details from fez
        if (user === 'anon') {
            return [403, {}];
        } else if (mockData.currentAuthor[user]) {
            return [200, mockData.currentAuthor[user]];
        }
        return [404, {}];
    })
    .onGet(routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: user}).apiUrl)
    .reply(200, mockData.hindexResponse)
    .onGet(routes.SEARCH_EXTERNAL_RECORDS_API({}).apiUrl)
    .reply(config => {
        if (config.params.source === 'scopus' && config.params.title) return [200, mockData.externalTitleScopusResultsList];
        else if (config.params.source === 'wos' && config.params.title) return [200, mockData.externalTitleSearchResultsList];
        else if (config.params.source === 'crossref' && config.params.title) return [200, mockData.externalTitleSearchResultsList];
        else if (config.params.source === 'crossref' && config.params.doi) return [200, mockData.externalDoiSearchResultList];
        else if (config.params.source === 'pubmed' && config.params.id) return [200, mockData.externalPubMedSearchResultsList];
    })
    .onGet(routes.CURRENT_USER_RECORDS_API({}).apiUrl).reply(config => {
        // AUTHOR_PUBLICATIONS_STATS_ONLY_API
        if (config.params.rule === 'mine' && !!config.params['filters[stats_only]']) {
            return [200, mockData.currentAuthorStats];
        } else if (config.params.rule === 'mine' && config.params['filters[facets][Display+type]'] === 371) {
            // CURRENT_USER_RECORDS_API - myDataset
            const totalRecords = mockData.MyDatasetList.data.length;
            const fromRecord = 1;
            const toRecord = 2;
            return [
                200,
                // {total: 0, data: []}
                {
                    ...mockData.MyDatasetList,
                    current_page: config.params.page,
                    data: mockData.MyDatasetList.data.slice(fromRecord, totalRecords > toRecord ? toRecord : totalRecords)
                }
            ];
        } else if (config.params.rule === 'mine') {
            // CURRENT_USER_RECORDS_API - myResearch
            const totalRecords = mockData.myRecordsList.data.length;
            const fromRecord = 5 * (config.params.page - 1);
            const toRecord = 5 * (config.params.page);
            return [
                200,
                // {total: 0, data: []}
                {
                    ...mockData.myRecordsList,
                    current_page: config.params.page,
                    data: mockData.myRecordsList.data.slice(fromRecord, totalRecords > toRecord ? toRecord : totalRecords)
                }
            ];
        } else if (config.params.rule === 'possible') {
            // POSSIBLE_RECORDS_API
            return [200, mockData.possibleUnclaimedList];
            // return [500, ['ERROR POSSIBLE_RECORDS_API']];
        } else if (config.params.rule === 'lookup') {
            // SEARCH_KEY_LOOKUP_API
            return [200, mockData.searchKeyList[config.params.search_key]];
        } else if (!!config.params.key && config.params.key.rek_object_type === 2) {
            // SEARCH_INTERNAL_RECORDS_API - Advanced Search {key: searchQueryParams} for Collections
            return [200, mockData.collections];
        } else if (config.params.id || config.params.doi || config.params.hasOwnProperty('all') || config.params.rek_title || config.params.key) {
            // SEARCH_INTERNAL_RECORDS_API
            // return [200, mockData.internalTitleSearchListNoResults];
            return [200, mockData.internalTitleSearchList];
        } else if (config.params.key.id || config.params.key.doi || config.params.key.title || config.params.key.all || config.params.key.rek_title) {
            // SEARCH_INTERNAL_RECORDS_API - Advanced Search {key: searchQueryParams}
            // return [200, mockData.internalTitleSearchListNoResults];
            return [200, mockData.internalTitleSearchList];
        } else if (config.params.key.rek_object_type === 2) {
            // SEARCH_INTERNAL_RECORDS_API - Advanced Search {key: searchQueryParams} for Collections
            return [200, mockData.collections];
        }
        return [404, ['Request not found']];
    })
    .onGet(routes.AUTHOR_TRENDING_PUBLICATIONS_API().apiUrl)
    // .reply(500, {})
    .reply(200, mockData.trendingPublications)
    .onGet(routes.TRENDING_PUBLICATIONS_API().apiUrl)
    // .reply(500, {})
    .reply(200, mockData.trendingPublications)
    .onGet(routes.GET_ACML_QUICK_TEMPLATES_API().apiUrl)
    .reply(200, mockData.quickTemplates)
    .onGet(routes.AUTHORS_SEARCH_API({query: '.*'}).apiUrl)
    .reply(config => {
        if (config.params.rule === 'lookup') {
            return [200, mockData.searchKeyList.author];
        } else {
            return [200, mockData.authorsSearch];
        }
    })
    .onGet(routes.GET_PUBLICATION_TYPES_API().apiUrl)
    .reply(200, mockData.recordsTypeList)
    .onGet(routes.GET_NEWS_API().apiUrl)
    .reply(200, mockData.newsFeed)
    .onGet(new RegExp(escapeRegExp(routes.THIRD_PARTY_LOOKUP_API_1FIELD({type: 'incites', field1: '.*'}).apiUrl)))
    .reply(200, mockData.lookupToolIncites)
    .onGet(new RegExp(escapeRegExp(routes.THIRD_PARTY_LOOKUP_API_2FIELD({type: 'incites', field1: '.*', field2: '.*'}).apiUrl)))
    .reply(200, mockData.lookupToolIncites)
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({pid: '.*'}).apiUrl)))
    .reply(config => {
        // Data collection
        if (config.url.indexOf('UQ:407731') >= 0) {
            return [200, {data: {...mockTestingData.dataCollection}}];
        }
        if (config.url.indexOf('UQ:164935') >= 0) {
            return [200, {data: {...mockData.recordWithMap}}];
        }
        if (config.url.indexOf('UQ:107683') >= 0) {
            return [200, {data: {...mockData.recordWithTiffAndThumbnail}}];
        }
        if (config.url.indexOf('UQ:290371') >= 0) {
            return [200, {data: {...mockData.recordWithoutAuthorIds}}];
        }
        if (config.url.indexOf('UQ:3883') >= 0) {
            return [200, {data: {...mockData.communityRecord}}];
        }
        if (config.url.indexOf('UQ:11398') >= 0) {
            return [200, {data: {...mockData.collectionRecord}}];
        }
        if (config.url.indexOf('UQ:252236') >= 0) {
            return [200, {data: {...mockData.recordWithDatastreams}}];
        }
        return [200, {data: {...mockData.record}}];
    })
    // .reply(401, '')
    // .reply(500, ['ERROR in EXISTING_RECORD_API'])
    .onGet(new RegExp(escapeRegExp(routes.VOCABULARIES_API({id: '.*'}).apiUrl)))
    .reply((config) => {
        const vocabId = config.url.substring(config.url.indexOf('/') + 1);
        return [200, mockData.vocabulariesList[vocabId]];
    })
    .onGet(new RegExp(escapeRegExp(routes.AUTHOR_ORCID_DETAILS_API({userId: '.*', params: {code: '.*', redirUri: '.*'}}).apiUrl)))
    .reply(200, {...mockData.authorOrcidDetails})
    // .reply(500, ["Server error: `POST https://sandbox.orcid.org/oauth/token` resulted in a `500 Internal Server Error` response:\n{\"error\":\"server_error\",\"error_description\":\"Redirect URI mismatch.\"}\n"])
    .onGet(new RegExp(escapeRegExp(routes.FILE_UPLOAD_API({pid: '.*', fileName: '.*'}).apiUrl)))
    .reply(200, ['s3-ap-southeast-2.amazonaws.com']);
// .reply(500, {message: 'error - failed GET FILE_UPLOAD_API'});


mock
    .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
    .reply(200, {data: {}});
// .reply(500, {message: 'error - failed PUT FILE_UPLOAD_S3'});

mock
    .onPost(new RegExp(escapeRegExp(routes.RECORDS_ISSUES_API({pid: '.*'}).apiUrl)))
    .reply(200, {data: ''})
    // .reply(500, {message: 'error - failed POST RECORDS_ISSUES_API'})
    .onPost(new RegExp(escapeRegExp(routes.HIDE_POSSIBLE_RECORD_API().apiUrl)))
    .reply(200, {data: {}})
    // .reply(500, ['ERROR HIDE_POSSIBLE_RECORD_API'])
    .onPost(new RegExp(escapeRegExp(routes.NEW_RECORD_API().apiUrl)))
    .reply(200, {data: {rek_pid: 'UQ:1111111'}}); // TODO: add actual record to data return!!!
// .reply(500, {message: 'error - failed NEW_RECORD_API'});
// .reply(403, {message: 'Session expired'});

mock
    .onPatch(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({pid: '.*'}).apiUrl)))
    .reply(200, {data: {...mockData.record}})
    // .reply(500, ['ERROR IN EXISTING_RECORD_API'])
    .onPatch(new RegExp(escapeRegExp(routes.AUTHOR_API({authorId: '.*'}).apiUrl)))
    .reply(200, {...mockData.currentAuthor.uqresearcher});
    // .reply(500, {message: 'error - failed PATCH AUTHOR_API'})

mock
    .onPatch(new RegExp(escapeRegExp(routes.COMMUNITIES_SECURITY_POLICY_API({
        pid: '.*'
    }).apiUrl)))
    .reply(200, {data: {...mockData.record}})
    .onPatch(new RegExp(escapeRegExp(routes.COLLECTIONS_SECURITY_POLICY_API({
        pid: '.*'
    }).apiUrl)))
    .reply(200, {data: {...mockData.record}})
    .onPatch(new RegExp(escapeRegExp(routes.RECORDS_SECURITY_POLICY_API({
        pid: '.*'
    }).apiUrl)))
    .reply(200, {data: {...mockData.record}});
;

// Default response. Put all mocks above this block.
mock
    .onAny().reply((config) => {
        console.log('url not found...');
        console.log(config);
        return [404, {message: `MOCK URL NOT FOUND: ${config.url}`}];
    });
