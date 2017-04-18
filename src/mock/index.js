import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';

// mocked data
import {accounts} from './data/accounts';
import {doiSearchResult, pubMedSearchResults, titleSearchResults} from './data/publicationSearch';

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

// Mock the publication form doi search endpoint
// mock.onGet(/\/search\/external\?doi=*/).reply(200, doiSearchResult);
mock.onGet(/search\/external\?doi=*/).reply(200, doiSearchResult);

mock.onGet(/search\/external\?pubMedID=*/).reply(200, pubMedSearchResults);

// Mock the publication form title search endpoint
mock.onGet(/search\/external\?rek_display_type=[0-9]*/).reply(200, titleSearchResults);


