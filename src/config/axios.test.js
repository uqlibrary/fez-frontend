import { api, apiLastRequest, sessionApi } from './axios';
import { TOKEN_NAME, SESSION_COOKIE_NAME, SESSION_USER_GROUP_COOKIE_NAME } from './general';
import Cookies from 'js-cookie';

describe('axios', () => {
    beforeEach(() => {
        mockApi.reset();
        mockSessionApi.reset();
        jest.resetAllMocks();
    });

    describe('sessionApi', () => {
        describe('interceptors', () => {
            describe('request', () => {
                it('should include session token as a header if session cookie is present', async () => {
                    jest.spyOn(Cookies, 'get').mockImplementation(key =>
                        key === SESSION_COOKIE_NAME ? 'fake-token' : null,
                    );
                    mockSessionApi.onGet('/test').reply(config => {
                        expect(config.headers[TOKEN_NAME]).toBe('fake-token');
                        return [200, {}];
                    });

                    await sessionApi.get('/test');
                });

                it('should not include session token as a header if session cookie is missing', async () => {
                    jest.spyOn(Cookies, 'get').mockImplementation(() => null);
                    mockSessionApi.onGet('/test').reply(config => {
                        expect(config.headers[TOKEN_NAME]).toBeUndefined();
                        return [200, {}];
                    });

                    await sessionApi.get('/test');
                });
            });
        });
    });

    describe('api', () => {
        describe('interceptors', () => {
            describe('request', () => {
                it('should include session token as a header if session cookie is present', async () => {
                    jest.spyOn(Cookies, 'get').mockImplementation(key =>
                        key === SESSION_COOKIE_NAME ? 'fake-token' : null,
                    );
                    mockApi.onGet('/test').reply(config => {
                        expect(config.headers[TOKEN_NAME]).toBe('fake-token');
                        return [200, {}];
                    });

                    await api.get('/test');
                    expect(apiLastRequest.headers[TOKEN_NAME]).toBe('fake-token');
                });

                it('should not include session token as a header if session cookie is missing', async () => {
                    jest.spyOn(Cookies, 'get').mockImplementation(() => null);
                    mockApi.onGet('/test').reply(config => {
                        expect(config.headers[TOKEN_NAME]).toBeUndefined();
                        return [200, {}];
                    });

                    await api.get('/test');
                    expect(apiLastRequest.headers[TOKEN_NAME]).toBeUndefined();
                });
            });

            describe('response', () => {
                describe('error handler', () => {
                    it('should clear session cookies when resp. status code is equal to 401', async () => {
                        jest.spyOn(Cookies, 'get').mockImplementation(key =>
                            key === SESSION_COOKIE_NAME ? 'fake-token' : null,
                        );
                        const removeSpy = jest.spyOn(Cookies, 'remove').mockImplementation(() => {});
                        mockApi.onGet('/test').reply(401);

                        try {
                            await api.get('/test');
                        } catch (e) {}

                        // dev
                        expect(removeSpy).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
                        expect(removeSpy).toHaveBeenCalledWith(SESSION_USER_GROUP_COOKIE_NAME);
                        // prod
                        const params = {
                            path: '/',
                            domain: '.library.uq.edu.au',
                            secure: true,
                        };
                        expect(removeSpy).toHaveBeenCalledWith(SESSION_COOKIE_NAME, params);
                        expect(removeSpy).toHaveBeenCalledWith(SESSION_USER_GROUP_COOKIE_NAME, params);
                    });

                    it('should not clear session cookies when resp. status code is different than 401', async () => {
                        jest.spyOn(Cookies, 'get').mockImplementation(key =>
                            key === SESSION_COOKIE_NAME ? 'fake-token' : null,
                        );
                        const removeSpy = jest.spyOn(Cookies, 'remove').mockImplementation(() => {});
                        mockApi.onGet('/test').reply(500);

                        try {
                            await api.get('/test');
                        } catch (e) {}

                        expect(removeSpy).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
