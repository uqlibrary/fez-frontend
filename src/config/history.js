import { createBrowserHistory, createHashHistory } from 'history';

console.log(process.env.NODE_ENV);

export const history =
    process.env.USE_MOCK ||
    process.env.BRANCH === 'production' ||
    process.env.BRANCH === 'staging' ||
    process.env.BRANCH === 'prodtest'
        ? createBrowserHistory()
        : createHashHistory();
