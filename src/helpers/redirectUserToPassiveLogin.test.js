import Cookies from 'js-cookie';
import { redirectUserToPassiveLogin } from './redirectUserToPassiveLogin';
import { AUTH_URL_LOGIN, SESSION_COOKIE_NAME, PASSIVE_LOGIN_CHECK_COOKIE_NAME } from 'config';

jest.mock('js-cookie');

describe('redirectUserToPassiveLogin', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        delete window.location;
        window.location = { href: 'https://espace.library.uq.edu.au/', assign: jest.fn() };
    });

    afterEach(() => {
        window.location = originalLocation;
        jest.clearAllMocks();
    });

    it('redirects to passive login when logged out and not suppressed', () => {
        Cookies.get.mockReturnValue(undefined);

        redirectUserToPassiveLogin();

        expect(window.location.assign).toHaveBeenCalledWith(
            `${AUTH_URL_LOGIN}?passive=1&url=${window.btoa('https://espace.library.uq.edu.au/')}`,
        );
    });

    it('does not redirect when a session cookie is present (already logged in)', () => {
        Cookies.get.mockImplementation(name => (name === SESSION_COOKIE_NAME ? 'a-session-id' : undefined));

        redirectUserToPassiveLogin();

        expect(window.location.assign).not.toHaveBeenCalled();
    });

    it('does not redirect when the suppression cookie is present', () => {
        Cookies.get.mockImplementation(name => (name === PASSIVE_LOGIN_CHECK_COOKIE_NAME ? '1' : undefined));

        redirectUserToPassiveLogin();

        expect(window.location.assign).not.toHaveBeenCalled();
    });
});
