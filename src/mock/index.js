/* eslint-disable */
import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 1200 });
const escapeRegExp = (input) => (input.replace('.\\*', '.*').replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, "\\$&"));
const standardQueryString = {page: '.*', pageSize: '.*', sortBy: '.*', sortDirection: '.*', facets: {}};
const requestOrcidQueryString = {code: '.*', oricidToFezRedirectUrl: '.*'}
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
    .onGet(new RegExp(escapeRegExp(routes.ACCOUNT_API()).replace(/\?.*$/,'.*'))).reply(config => {
        // mock account response
        if (user === 'anon') return [403, {}];
        if (mockData.accounts[user]) return [200, mockData.accounts[user]];
        return [404, {}];
    })
    .onGet(new RegExp(escapeRegExp(routes.AUTHOR_DETAILS_API({userId: user})))).reply(config => {
        // mock current author details
        if (user === 'anon') return [403, {}];
        console.log(mockData.authorDetails[user]);
        if (mockData.authorDetails[user]) return [200, mockData.authorDetails[user]];
        return [404, {}];
    })
    .onGet(new RegExp(escapeRegExp(routes.CURRENT_AUTHOR_API()))).reply(config => {
        console.log('hi');
        // mock current author details from fez
        if (user === 'anon') return [403, {}];
        if (mockData.currentAuthor[user]) return [200, mockData.currentAuthor[user]];

        return [404, {}];
    })
    .onGet(new RegExp(escapeRegExp(routes.ACADEMIC_STATS_PUBLICATION_YEARS_API({userId: user}))))
        .reply(200, mockData.publicationYearsBig)
    .onGet(new RegExp(escapeRegExp(routes.ACADEMIC_STATS_PUBLICATION_HINDEX_API({userId: user}))))
        .reply(200, mockData.hindexResponse)
    .onGet(new RegExp(escapeRegExp(routes.ACADEMIC_STATS_PUBLICATION_STATS_API({userId: user}))))
        .reply(200, mockData.publicationStats)
    .onGet(new RegExp(escapeRegExp(routes.ACADEMIC_STATS_PUBLICATIONS_TRENDING_API({userId: user}))))
        .reply(200, mockData.trendingPublications)
    .onGet(new RegExp(escapeRegExp(routes.AUTHORS_SEARCH_API({query: '.*'}))))
        .reply(200, mockData.authorsSearch)
    .onGet(new RegExp(escapeRegExp(routes.SEARCH_KEY_LOOKUP_API({searchQuery: '.*', searchKey: '.*'}))))
        .reply((config) => {
            const searchKey = config.url.match('[?&]search_key=([^&]+)')[1];
            const searchQuery = config.url.match('[?&]lookup_value=([^&]+)')[1];
            return [200, {data: mockData.searchKeyList[searchKey].filter(item => (item.toLowerCase().indexOf(searchQuery) >= 0))}];
        })
    .onGet(new RegExp(escapeRegExp(routes.SEARCH_INTERNAL_RECORDS_API({searchQuery: '.*', pageSize: 5, sortBy: 'score', sortDirection: 'desc'}))))
        .reply(200, mockData.internalTitleSearchList)
    .onGet(new RegExp(escapeRegExp(routes.SEARCH_EXTERNAL_RECORDS_API({source: 'wos', searchQuery: '.*'}))))
        .reply(200, mockData.externalTitleSearchResultsList)
    .onGet(new RegExp(escapeRegExp(routes.SEARCH_EXTERNAL_RECORDS_API({source: 'scopus', searchQuery: '.*'}))))
        .reply(200, mockData.externalTitleScopusResultsList)
    .onGet(new RegExp(escapeRegExp(routes.SEARCH_EXTERNAL_RECORDS_API({source: 'crossref', searchQuery: '10.1163/9789004326828'}))))
        .reply(200, mockData.externalDoiSearchResultList)
    .onGet(new RegExp(escapeRegExp(routes.SEARCH_EXTERNAL_RECORDS_API({source: 'pubmed', searchQuery: '28131963'}))))
        .reply(200, mockData.externalPubMedSearchResultsList)
    .onGet(new RegExp(escapeRegExp(routes.GET_PUBLICATION_TYPES_API())))
        .reply(200, mockData.recordsTypeList)
    .onGet(new RegExp(escapeRegExp(routes.VOCABULARIES_API({id: '.*'})))).reply((config) => {
        const vocabId = config.url.substring(config.url.indexOf('/') + 1);
        return [200, mockData.vocabulariesList[vocabId]];
    })
    .onGet(new RegExp(escapeRegExp(routes.GET_ACML_QUICK_TEMPLATES_API())))
        .reply(200, mockData.quickTemplates)
    .onGet(new RegExp(escapeRegExp(routes.CURRENT_USER_RECORDS_API({...standardQueryString}))))
        .reply(200, mockData.myRecordsList)
    .onGet(new RegExp(escapeRegExp(routes.POSSIBLE_RECORDS_API({...standardQueryString}))))
        .reply(200, mockData.possibleUnclaimedList)
    .onGet(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({pid: '.*'}))))
        .reply(200, {data: {...mockData.record}})
    .onGet(new RegExp(escapeRegExp(routes.FILE_UPLOAD_API({pid: '.*', fileName: '.*'}))))
        .reply(200, 's3-ap-southeast-2.amazonaws.com')
    .onGet(new RegExp(escapeRegExp(routes.AUTHOR_ORCID_DETAILS_API({userId: '.*', params: {...requestOrcidQueryString}}))))
        .reply(200, {data: {...mockData.authorOrcidDetails}})
        // .reply(500, {message: 'error - failed GET FILE_UPLOAD_API'})
    .onPut(/(s3-ap-southeast-2.amazonaws.com)/)
        .reply(200, {data: {}})
        // .reply(500, {message: 'error - failed PUT FILE_UPLOAD_S3'})
    .onPost(new RegExp(escapeRegExp(routes.RECORDS_ISSUES_API({pid: '.*'}))))
        // .reply(200, {data: ''})
        .reply(500, {message: 'error - failed POST RECORDS_ISSUES_API'})
    .onPost(new RegExp(escapeRegExp(routes.NEW_RECORD_API())))
        .reply(200, {data: {...mockData.record}})
        // .reply(500, {message: 'error - failed POST NEW_RECORD_API'})
    .onPatch(new RegExp(escapeRegExp(routes.EXISTING_RECORD_API({pid: '.*'}))))
        .reply(200, {data: {...mockData.record}})
        // .reply(500, {message: 'error - failed PATCH EXISTING_RECORD_API'})
    .onPost(new RegExp(escapeRegExp(routes.NEW_RECORD_API())))
        .reply(200, {data: {}})
    .onPost(new RegExp(escapeRegExp(routes.HIDE_POSSIBLE_RECORD_API())))
        .reply(200, {data: {}})
    .onPatch(new RegExp(escapeRegExp(routes.AUTHOR_API({authorId: '.*'}))))
        .reply(500, {message: 'error - failed PATCH AUTHOR_API'})
        // .reply(200, {data: {...mockData.afterOrcid}})
        // .reply(200, {data: {...mockData.afterGoogleScholarPatch}})
    .onAny().reply((config) => {
        console.log('url not found...');
        console.log(config.url);
        return [404, {message: `MOCK URL NOT FOUND: ${config.url}`}];
    });
