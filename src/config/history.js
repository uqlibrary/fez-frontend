import { createBrowserHistory, createHashHistory } from 'history';
import { USE_HASH_PATH_PREFIX } from 'config/general';

export const history = USE_HASH_PATH_PREFIX ? createHashHistory() : createBrowserHistory();
