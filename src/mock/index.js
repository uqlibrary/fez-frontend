/* eslint-disable */
import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';

const queryString = require('query-string');
const mock = new MockAdapter(api, {delayResponse: 200});
const escapeRegExp = (input) => (input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, "\\$&"));
const standardQueryString = {page: '.*', pageSize: '.*', sortBy: '.*', sortDirection: '.*', facets: {}};
// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

//get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

if (user && !mockData.accounts[user]) {
    console.warn(`API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`);
}

// default user is researcher if user is not defined
user = user || 'uqresearcher';


mock
    .onGet(routes.CURRENT_ACCOUNT_API().apiUrl).reply(config => {
    // mock account response
    if (user === 'anon') {
        return [403, {}];
    } else if (mockData.accounts[user]) {
        return [200, mockData.accounts[user]];
    }
    return [404, {}];
})
    .onGet(routes.AUTHOR_DETAILS_API({userId: user}).apiUrl).reply(config => {
    // mock current author details
    if (user === 'anon') {
        return [403, {}];
    } else if (mockData.authorDetails[user]) {
        return [200, mockData.authorDetails[user]];
    }
    return [404, {}];
})
    .onGet(routes.CURRENT_AUTHOR_API().apiUrl)
    .reply(config => {
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
        // ACADEMIC_PUBLICATIONS_STATS_API
        if (config.params.rule === 'mine' && !!config.params['filters[stats_only]']) {
            return [200, mockData.currentAuthorStats];
        }
        // CURRENT_USER_RECORDS_API
        else if (config.params.rule === 'mine') {
            const totalRecords = mockData.myRecordsList.data.length;
            const fromRecord = 5 * (config.params.page - 1);
            const toRecord = 5 * (config.params.page);
            return [
                200,
                // {total: 0, data: []}
                {...mockData.myRecordsList, current_page: config.params.page, data: mockData.myRecordsList.data.slice(fromRecord, totalRecords > toRecord ? toRecord : totalRecords)}
            ];
        }
        // POSSIBLE_RECORDS_API
        else if (config.params.rule === 'possible') {
            return [200, mockData.possibleUnclaimedList];
            // return [500, ['ERROR POSSIBLE_RECORDS_API']];
        }
        // SEARCH_KEY_LOOKUP_API
        else if (config.params.rule === 'lookup') {
            return [200, mockData.searchKeyList[config.params.search_key]];
        }
        // ACADEMIC_STATS_PUBLICATIONS_TRENDING_API
        else if (config.params.rule === 'trending') {
            return [
                200,
                // {total: 0, data: [], filters: []}
                mockData.trendingPublications
            ];
        }
        // SEARCH_INTERNAL_RECORDS_API
        else if (config.params.id || config.params.doi || config.params.title) {
            return [200, mockData.internalTitleSearchList];
        }
        return [404, ['Request not found']];
    })
    .onGet(routes.GET_ACML_QUICK_TEMPLATES_API().apiUrl)
    .reply(200, mockData.quickTemplates)
    .onGet(routes.AUTHORS_SEARCH_API({query: '.*'}).apiUrl)
    .reply(200, mockData.authorsSearch)
    .onGet(routes.GET_PUBLICATION_TYPES_API().apiUrl)
    .reply(200, mockData.recordsTypeList)
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({pid: '.*'}).apiUrl)))
    .reply(config => {
        if (config.url.indexOf('UQ:164935') >= 0) {
            return [200, {data: {...mockData.recordWithMap}}];
        }
        return [200, {data: {...mockData.record}}];
    })
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

mock
    .onPatch(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({pid: '.*'}).apiUrl)))
    .reply(200, {data: {...mockData.record}})
    // .reply(500, ['ERROR IN EXISTING_RECORD_API'])
    .onPatch(new RegExp(escapeRegExp(routes.AUTHOR_API({authorId: '.*'}).apiUrl)))
    .reply(200, {...mockData.currentAuthor.uqresearcher})
    // .reply(500, {message: 'error - failed PATCH AUTHOR_API'})
    .onAny().reply((config) => {
        console.log('url not found...');
        console.log(config);
        return [404, {message: `MOCK URL NOT FOUND: ${config.url}`}];
    });
