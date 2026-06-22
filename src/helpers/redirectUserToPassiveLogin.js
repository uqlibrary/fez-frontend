import Cookies from 'js-cookie';
import { AUTH_URL_LOGIN, SESSION_COOKIE_NAME, PASSIVE_LOGIN_CHECK_COOKIE_NAME } from 'config';

/**
 * Performs a one-shot passive (silent) SSO login via a full-page browser redirect.
 *
 * Only redirects when the user appears logged out (no UQLID session cookie) and a passive
 * login has not recently been attempted (no UQL_PASSIVE_CHECKED suppression cookie). The API
 * sets UQL_PASSIVE_CHECKED (default 30 min) on the return leg, so honouring it here limits the
 * attempt to once per cookie lifetime; the browser drops the cookie on expiry, re-enabling it.
 *
 * The browser is sent to {AUTH_URL_LOGIN}?passive=1&url=<base64 current page>, which bounces
 * through Auth and returns to the same page whether or not a session was established.
 */
export const redirectUserToPassiveLogin = () => {
    /* istanbul ignore next */
    if (process.env.USE_MOCK) {
        return;
    }
    // Already logged in, or a recent passive attempt is still suppressing: do nothing
    if (!!Cookies.get(SESSION_COOKIE_NAME) || !!Cookies.get(PASSIVE_LOGIN_CHECK_COOKIE_NAME)) {
        return;
    }
    window.location.assign(`${AUTH_URL_LOGIN}?passive=1&url=${window.btoa(window.location.href)}`);
};
