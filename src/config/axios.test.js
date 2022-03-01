import { TOKEN_NAME } from './general';
import Cookies from 'js-cookie';

import { setupDefaults } from './axios';
import axios from 'axios';

const mocks = {};
describe('Axios', () => {
    afterEach(() => {
        Object.keys(mocks).map(name => mocks[name].mockRestore());
    });

    it('should NOT include UQLID value as X-Uql-Token header when UQLID is NOT present', () => {
        setupDefaults();
        expect(axios.defaults.headers.common).not.toHaveProperty(TOKEN_NAME);
    });

    it('should include UQLID value as X-Uql-Token header when UQLID is present', () => {
        const token = 123;
        mocks.cookies = jest.spyOn(Cookies, 'get').mockReturnValue(token);
        setupDefaults();
        expect(axios.defaults.headers.common).toHaveProperty(TOKEN_NAME, token);
    });
});
