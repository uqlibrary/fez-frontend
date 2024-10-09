import { AUTH_URL_LOGIN, AUTH_URL_LOGOUT, APP_URL } from 'config';

/* istanbul ignore next */
export const redirectUserToLogin = (
    isAuthorizedUser = false,
    redirectToCurrentLocation = false,
    additionalParams = null,
) => () => {
    /* istanbul ignore next */
    if (process.env.USE_MOCK) {
        return;
    }
    const redirectUrl = isAuthorizedUser ? AUTH_URL_LOGOUT : AUTH_URL_LOGIN;
    let withSearch = false;
    let returnUrl = APP_URL;
    if (redirectToCurrentLocation || !isAuthorizedUser) {
        returnUrl = window.location.href;
        withSearch = window.location.search !== '';
    }
    if (additionalParams) {
        const conjoiner = withSearch ? '&' : '?';
        returnUrl = `${returnUrl}${conjoiner}${additionalParams}`;
    }
    window.location.assign(`${redirectUrl}?url=${window.btoa(returnUrl)}`);
};
