import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';

// mocked data
import {accounts} from './data/accounts';
import {externalDoiSearchResult, internalDoiSearchResult, externalPubMedSearchResults, internalPubMedSearchResults, externalTitleSearchResults, internalTitleSearchResults} from './data/publicationSearch';

const queryString = require('query-string');
const mock = new MockAdapter(api);

// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

// Mock the account that the user is logged in as
if (queryString.parse(location.search).user === 'null') {
    mock.onGet('/account').reply(200, null);
} else {
    let account = accounts.find(s => s.id === queryString.parse(location.search).user);

    if (account === undefined) {
        account = accounts.find(s => s.id === 'uqinewton');
    }
    // mock account route
    mock.onGet('/account').reply(200, account);
}

// Mock the publication form external doi search endpoint
mock.onGet(/search\/external\?doi=*/).reply(200, externalDoiSearchResult);

// Mock the publication form internal doi search endpoint
mock.onGet(/search\/internal\?doi=*/).reply(200, internalDoiSearchResult);

// Mock the publication form external pubMed search endpoint
mock.onGet(/search\/external\?pubMedId=*/).reply(200, externalPubMedSearchResults);

// Mock the publication form internal pubMed search endpoint
mock.onGet(/search\/internal\?pubMedId=*/).reply(200, internalPubMedSearchResults);

// Mock the publication form external title search endpoint
mock.onGet(/search\/external\?rek_display_type=[0-9]*/).reply(200, externalTitleSearchResults);

// Mock the publication form internal title search endpoint
mock.onGet(/search\/internal\?rek_display_type=[0-9]*/).reply(200, internalTitleSearchResults);
