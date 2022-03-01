import { TOKEN_NAME } from './general';
import Cookies from 'js-cookie';
import { api, sessionApi, setupDefaults } from './axios';

const mocks = {};
describe('Axios', () => {
    afterEach(() => {
        Object.keys(mocks).map(name => mocks[name].mockRestore());
    });

    it('should NOT include UQLID value as X-Uql-Token header when UQLID is NOT present', () => {
        setupDefaults();
        expect(api.defaults.headers.common).not.toHaveProperty(TOKEN_NAME);
        expect(sessionApi.defaults.headers.common).not.toHaveProperty(TOKEN_NAME);
    });

    it('should include UQLID value as X-Uql-Token header when UQLID is present', () => {
        const token = 123;
        mocks.cookies = jest.spyOn(Cookies, 'get').mockReturnValue(token);
        setupDefaults();
        expect(api.defaults.headers.common).toHaveProperty(TOKEN_NAME, token);
        expect(sessionApi.defaults.headers.common).toHaveProperty(TOKEN_NAME, token);
    });
});
