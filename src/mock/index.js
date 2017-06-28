import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';

// mocked data
import {accounts} from './data/accounts';
import {externalDoiSearchResultList, internalDoiSearchResultList, externalPubMedSearchResultsList, internalPubMedSearchResultsList, externalTitleSearchResultsList, internalTitleSearchResultsList} from './data/publicationSearch';
// import {authorsList} from './data/authors';
import {publicationTypeList} from './data/publicationTypes';
import {publicationSubTypeList} from './data/publicationSubTypes';
import {publicationYearsBig} from './data/academic/publicationYears';
import {documentAccessTypes} from './data/documentAccessTypes';

const queryString = require('query-string');
const mock = new MockAdapter(api);

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

// Mock the publication form external doi search endpoint
mock.onGet(/search\/external\?doi=*/).reply(200, externalDoiSearchResultList);

// Mock the publication form internal doi search endpoint
mock.onGet(/search\/internal\?doi=*/).reply(200, internalDoiSearchResultList);

// Mock the publication form external pubMed search endpoint
mock.onGet(/search\/external\?pub_med_id=*/).reply(200, externalPubMedSearchResultsList);

// Mock the publication form internal pubMed search endpoint
mock.onGet(/search\/internal\?pub_med_id=*/).reply(200, internalPubMedSearchResultsList);

// Mock the publication form external title search endpoint
mock.onGet(/search\/external\?rek_display_type=[0-9]*/).reply(200, externalTitleSearchResultsList);

// Mock the publication form internal title search endpoint
mock.onGet(/search\/internal\?rek_display_type=[0-9]*/).reply(200, internalTitleSearchResultsList);

// Mock the publication types endpoint
mock.onGet('records/types').reply(200, publicationTypeList);

// Mock the publication sub types endpoint
mock.onGet(/vocabularies\/[0-9]/).reply(200, publicationSubTypeList);

// Mock the authors endpoint
// mock.onGet(/authors\/search\?query=*/).reply(200, authorsList);
mock.onGet(/authors\/search\?query=*/).passThrough();

// Mock academics publication years endpoint response
mock.onGet(/academic\/[a-z0-9]*\/publication-years/).reply(200, publicationYearsBig);

// Allow the file upload calls to pass through to the S3 bucket directly
mock.onGet(/file\/upload\/presigned/).passThrough();
mock.onPut(/(s3-ap-southeast-2.amazonaws.com)/).passThrough();

// Mock the document access types
mock.onGet('acml/quick-templates').reply(200, documentAccessTypes);

// Let the create records endpoint go through to staging
mock.onPost('records').passThrough();
