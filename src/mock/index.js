/* eslint-disable */
import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';

// mocked data
import {accounts} from './data/accounts';
import {externalDoiSearchResultList, internalDoiSearchResultList, externalPubMedSearchResultsList, internalPubMedSearchResultsList, externalTitleSearchResultsList, internalTitleSearchResultsList} from './data/publicationSearch';
import {publicationTypeList} from './data/publicationTypes';
import {publicationSubTypeList} from './data/publicationSubTypes';
import {publicationYearsBig} from './data/academic/publicationYears';
import {claimPublication, claimPublicationEmpty, hidePublications, possibleCounts} from './data/claimPublication';
import {documentAccessTypes} from './data/documentAccessTypes';
import {authorsList, existingAuthor} from './data/authors';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 2000 });

// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

// Mock the account that the user is logged in as
if (queryString.parse(location.search).user === 'null') {
    mock.onGet(/account\?[0-9]*/).reply(200, null);
} else {
    let account = accounts.find(s => s.id === queryString.parse(location.search).user);

    if (account === undefined) {
        account = accounts.find(s => s.id === 'uqinewton');
    }
    // mock account route
    mock.onGet(/account\?[0-9]*/).reply(200, account);
}


// Mock the publication form internal search
mock.onGet(/search\/internal\?*/).reply(500);

// Mock the publication form external title search endpoint
mock.onGet(/search\/external\?source=wos&title=*/).reply(200, externalTitleSearchResultsList);
mock.onGet(/search\/external\?source=crossref&title=*/).reply(404);
mock.onGet(/search\/external\?source=scopus&title=*/).reply(404);
mock.onGet(/search\/external\?source=pubmed&title=*/).reply(404);

// Mock the publication form external pubMed search endpoint
mock.onGet(/search\/external\?id=pmid=*/).reply(200, externalPubMedSearchResultsList);

// Mock the publication form external doi search endpoint
mock.onGet(/search\/external\?doi=*/).reply(200, externalDoiSearchResultList);

// Mock the publication types endpoint
mock.onGet('records/types').reply(200, publicationTypeList);

// Mock the publication sub types endpoint
mock.onGet(/vocabularies\/[0-9]/).reply(200, publicationSubTypeList);

// Mock the authors endpoint
// get authors search results
mock.onGet(/authors\/search\?query=*/).reply(200, authorsList);

// Mock get current author details
mock.onGet(/authors/).reply(200, existingAuthor);

// Error codes:
// 404: author not found
// mock.onGet(/authors/).reply(404);
// 403: current user is not authorised
// mock.onGet(/authors/).reply(403);

// Mock academics publication years endpoint response
mock.onGet(/academic\/[a-z0-9]*\/publication-years/).reply(200, publicationYearsBig);

// Allow the file upload calls to pass through to the S3 bucket directly
mock.onGet(/file\/upload\/presigned/).passThrough();
mock.onPut(/(s3-ap-southeast-2.amazonaws.com)/).passThrough();

// Mock claim publication results endpoint response
mock.onGet(/(publications\/possible-unclaimed)/).reply(200, claimPublication);
mock.onGet(/(publications\/possible-counts)/).reply(200, possibleCounts);
// mock.onGet(/(publications\/possible-unclaimed)/).reply(200, claimPublicationEmpty);

// Mock hide publication results endpoint response
mock.onPost(/(publications\/hide-possible)/).reply(200, hidePublications);

// Mock claim possible publication endpoint response
mock.onPost('publications/claim-possible').reply(200, {});

// Mock the document access types
mock.onGet('acml/quick-templates').reply(200, documentAccessTypes);

// Let the create records endpoint go through to staging
mock.onPost('records').reply(200, {});
// mock.onPost('records').reply(422);
