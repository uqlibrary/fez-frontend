import { createBrowserHistory, createHashHistory } from 'history';

export const history =
    process.env.USE_MOCK || process.env.BRANCH === 'production' || process.env.BRANCH === 'staging'
        ? createBrowserHistory()
        : createHashHistory();
