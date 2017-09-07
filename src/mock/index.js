/* eslint-disable */
import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';

// mocked data
import * as mockData from './data';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 2000 });

// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

//get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

if (user && !mockData.accounts[user]) {
    console.warn(`API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`);
}

// Mock the authors endpoint
// get authors search results
mock.onGet(/fez-authors\/search\?query=*/).reply(200, mockData.authorsSearch);

if (user === 'anon') {
    // Mock unauthorised response
    mock.onGet(/account\?[0-9]*/).reply(403, {});
    mock.onGet(/authors\/details*/).reply(403, {});
    mock.onGet(/fez-authors/).reply(403, {});
} else {
    // use default uqresearcher
    user = user || 'uqresearcher';

    // Mock the account that the user is logged in as
    mock.onGet(/account\?[0-9]*/).reply(200, mockData.accounts[user]);

    // Mock get current author details
    if (mockData.authorDetails[user])
        mock.onGet(/authors\/details*/).reply(200, mockData.authorDetails[user]);
    else
        mock.onGet(/authors\/details*/).reply(404, {});

    // Mock get current author details
    if (mockData.currentAuthor[user]) {
        mock.onGet(/fez-authors/).reply(200, mockData.currentAuthor[user]);
    } else {
        mock.onGet(/fez-authors/).reply(404, []);
    }
}

// Mock the publication form internal search
mock.onGet(/search\/internal\?*/).reply(500);

// Mock the publication form external title search endpoint
mock.onGet(/search\/external\?source=wos&title=*/).reply(200, mockData.externalTitleSearchResultsList);
mock.onGet(/search\/external\?source=crossref&title=*/).reply(404);
mock.onGet(/search\/external\?source=scopus&title=*/).reply(404);
mock.onGet(/search\/external\?source=pubmed&title=*/).reply(404);

// Mock the publication form external pubMed search endpoint
mock.onGet(/search\/external\?id=pmid=*/).reply(200, mockData.externalPubMedSearchResultsList);

// Mock the publication form external doi search endpoint
mock.onGet(/search\/external\?doi=*/).reply(200, mockData.externalDoiSearchResultList);

// Mock the publication types endpoint
mock.onGet('records/types').reply(200, mockData.publicationTypeList);

// Mock the publication sub types endpoint
mock.onGet(/vocabularies\/[0-9]/).reply((config) => {
    const vocabId = config.url.substring(config.url.indexOf('/')+1);
    return [200, mockData.publicationSubtypeList[vocabId]];
});

// Error codes:
// 404: author not found
// mock.onGet(/authors/).reply(404);
// 403: current user is not authorised
// mock.onGet(/authors/).reply(403);

// Mock academics publication years endpoint response
mock.onGet(/academic\/[a-z0-9]*\/publication-years/).reply(200, mockData.publicationYearsBig);
mock.onGet(/academic\/[a-z0-9]*\/hindex/).reply(200, mockData.hindexResponse);
mock.onGet(/academic\/[a-z0-9]*\/publication-stats/).reply(200, mockData.publicationStats);

// Allow the file upload calls to pass through to the S3 bucket directly
mock.onGet(/file\/upload\/presigned\/UQ:1111111\/aws*/).reply(200, 's3-ap-southeast-2.amazonaws.com');  // Success
// mock.onGet(/file\/upload\/presigned\/UQ:1111111\/aws*/).reply(400, {});  // Failure
mock.onPut(/(s3-ap-southeast-2.amazonaws.com)/).reply(200); // Success
// mock.onPut(/(s3-ap-southeast-2.amazonaws.com)/).reply(404, {}); // Failure

// Mock claim publication results endpoint response
mock.onGet(/publications\/possible-unclaimed\/[a-z0-9]/).reply(200, mockData.possibleUnclaimed);
mock.onGet(/(publications\/possible-counts)/).reply(200, mockData.possibleCounts);
mock.onGet(/(publications\/claimed)/).reply(200, mockData.claimedPublications);
mock.onGet(/(academic\/[a-z0-9]*\/trending_publications)/).reply(200, mockData.trendingPublications);
// mock.onGet(/(publications\/possible-unclaimed)/).reply(200, []);

// Mock hide publication results endpoint response
mock.onPost(/(publications\/hide-possible)/).reply(200, {});

// Mock claim possible publication endpoint response
// mock.onPost('publications/claim-possible').reply(200, {});
mock.onPost(/publications\/claim-possible/).reply(200);

// Mock the document access types
mock.onGet('acml/quick-templates').reply(200, mockData.quickTemplates);

// Let the create records endpoint go through to staging
mock.onPost(/records/).reply(200, {data: {rek_pid: 'UQ:1111111'}}); // Success
// mock.onPost(/records/).reply(404, {}); // Failure
mock.onPatch(/records/).reply(200, {}); // Success
// mock.onPatch(/records/).reply(404, {}); // Failure
