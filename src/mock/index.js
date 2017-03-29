import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {SESSION_COOKIE_NAME} from 'config';

// mocked data
import {accounts} from './data/accounts';

const queryString = require('query-string');
const mock = new MockAdapter(api);

// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

let account = accounts.find(s => s.id === queryString.parse(location.search).user);

if (account === undefined) {
    account = accounts.find(s => s.id === 'uqinewton');
}
account.hasSession = true;

// Mock the account that the user is logged in as


// mock account route
mock.onGet('/account').reply(200, account);

