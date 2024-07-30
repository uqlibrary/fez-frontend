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
    const returnUrl = redirectToCurrentLocation || !isAuthorizedUser ? window.location.href : APP_URL;
    window.location.assign(
        `${redirectUrl}?url=${window.btoa(returnUrl)}${additionalParams ? `&${additionalParams}` : ''}`,
    );
};
