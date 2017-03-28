import {api} from 'config';
import MockAdapter from 'axios-mock-adapter';

// mocked data
import {accounts} from './data/accounts';

const queryString = require('query-string');
const mock = new MockAdapter(api);

// Mock the account that the user is logged in as
console.log(queryString.parse(location.search).user);

let account = accounts.find(s => s.id === queryString.parse(location.search).user);

if (account === undefined) {
    account = accounts.find(s => s.id === 'uqinewton');
}
account.hasSession = true;

// mock account route
mock.onGet('/account').reply(200, account);

