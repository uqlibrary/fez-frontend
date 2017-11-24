import {createHash} from 'crypto';
import {stringify} from 'querystring';

import {ORCID_CLIENT_ID, ORCID_AUTHORIZATION_URL} from 'config/general';
import Cookies from 'js-cookie';

import {APP_URL, SESSION_COOKIE_NAME} from 'config/general';

export const requestOrcidUrl = (params) => {
    return `${ORCID_AUTHORIZATION_URL}?${stringify(params)}`;
};

export const requestPermissionUrl = (returnUrl, additionalParams = {}) => {
    const params = {
        client_id: ORCID_CLIENT_ID,
        response_type: 'code',
        redirect_uri: `${APP_URL}#${returnUrl}`,
        state: createHash('md5').update(Cookies.get(SESSION_COOKIE_NAME)).digest('hex'),
        scope: '/authenticate',
        ...additionalParams
    };

    return requestOrcidUrl(params);
};
