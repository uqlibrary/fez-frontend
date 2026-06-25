import Cookies from 'js-cookie';
import { AUTH_URL_LOGIN, PASSIVE_LOGIN_CHECK_COOKIE_NAME } from 'config';

/**
 * Performs a one-shot passive (silent) SSO login via a full-page browser redirect.
 *
 * The caller decides the visitor is anonymous (via the /account result); this helper only guards
 * against re-attempting while suppressed. It does NOT inspect UQLID/UQLSSO, because Auth sets those
 * session cookies on any request (even a failed passive attempt), so their presence does not mean a
 * valid session exists.
 *
 * The API sets UQL_PASSIVE_CHECKED (default 30 min) on the passive return leg, so honouring it here
 * limits the attempt to once per cookie lifetime; the browser drops it on expiry, re-enabling it.
 *
 * The browser is sent to {AUTH_URL_LOGIN}?passive=1&url=<base64 current page>, which bounces through
 * Auth and returns to the same page whether or not a session was established.
 */
export const redirectUserToPassiveLogin = () => {
    /* istanbul ignore next */
    if (process.env.USE_MOCK) {
        return;
    }
    // A recent passive attempt is still suppressing further attempts
    if (!!Cookies.get(PASSIVE_LOGIN_CHECK_COOKIE_NAME)) {
        return;
    }
    window.location.assign(`${AUTH_URL_LOGIN}?passive=1&url=${window.btoa(window.location.href)}`);
};
