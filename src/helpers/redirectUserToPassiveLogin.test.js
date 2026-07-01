/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://espace.library.uq.edu.au/"}
 */
import Cookies from 'js-cookie';
import { redirectUserToPassiveLogin } from './redirectUserToPassiveLogin';
import { AUTH_URL_LOGIN, PASSIVE_LOGIN_CHECK_COOKIE_NAME } from 'config';
import { spyOnWindowLocationMethod } from 'test-utils';

jest.mock('js-cookie');

describe('redirectUserToPassiveLogin', () => {
    let assignMock;

    beforeEach(() => {
        assignMock = spyOnWindowLocationMethod('assign');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('redirects to passive login when not suppressed', () => {
        Cookies.get.mockReturnValue(undefined);

        redirectUserToPassiveLogin();

        expect(assignMock).toHaveBeenCalledWith(
            `${AUTH_URL_LOGIN}?passive=1&url=${window.btoa('https://espace.library.uq.edu.au/')}`,
        );
    });

    it('does not redirect when the suppression cookie is present', () => {
        Cookies.get.mockImplementation(name => (name === PASSIVE_LOGIN_CHECK_COOKIE_NAME ? '1' : undefined));

        redirectUserToPassiveLogin();

        expect(assignMock).not.toHaveBeenCalled();
    });
});
