describe('general', () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        process.env = { ...ORIGINAL_ENV };
        jest.resetModules();
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
    });

    test('should detect Jest environment correctly', () => {
        process.env.JEST_WORKER_ID = '123';
        const { IS_JEST_TEST, IS_PLAYWRIGHT_TEST, IS_TEST } = require('./general');
        expect(IS_JEST_TEST).toBe(true);
        expect(IS_PLAYWRIGHT_TEST).toBe(false);
        expect(IS_TEST).toBe(true);
    });

    test('should detect Playwright environment correctly', () => {
        delete process.env.JEST_WORKER_ID;
        process.env.PW_IS_RUNNING = '1';
        const { IS_JEST_TEST, IS_PLAYWRIGHT_TEST, IS_TEST } = require('./general');
        expect(IS_JEST_TEST).toBe(false);
        expect(IS_PLAYWRIGHT_TEST).toBe(true);
        expect(IS_TEST).toBe(true);
    });

    test('should detect non-test environment', () => {
        delete process.env.JEST_WORKER_ID;
        delete process.env.PW_IS_RUNNING;
        const { IS_JEST_TEST, IS_PLAYWRIGHT_TEST, IS_TEST } = require('./general');
        expect(IS_JEST_TEST).toBe(false);
        expect(IS_PLAYWRIGHT_TEST).toBe(false);
        expect(IS_TEST).toBe(false);
    });

    test('should have correct default URLs', () => {
        const {
            LOCALHOST_DOMAIN,
            LOCALHOST_ALIAS_DOMAIN,
            LOCALHOST_URL,
            PRODUCTION_URL,
            STAGING_URL,
            DEVELOPMENT_BRANCH_URL,
            PRODUCTION_API_URL,
            STAGING_API_URL,
        } = require('./general');

        expect(LOCALHOST_DOMAIN).toBe('localhost');
        expect(LOCALHOST_ALIAS_DOMAIN).toBe('dev-espace.library.uq.edu.au');
        expect(LOCALHOST_URL).toBe('http://localhost/');
        expect(PRODUCTION_URL).toBe('https://espace.library.uq.edu.au/');
        expect(STAGING_URL).toBe('https://fez-staging.library.uq.edu.au/');
        expect(DEVELOPMENT_BRANCH_URL).toBe('https://development.library.uq.edu.au/');
        expect(PRODUCTION_API_URL).toBe('https://api.library.uq.edu.au/v1/');
        expect(STAGING_API_URL).toBe('https://api.library.uq.edu.au/staging/');
    });

    test('should use default API_URL and APP_URL when env not set', () => {
        delete process.env.API_URL;
        delete process.env.APP_URL;
        const { API_URL, APP_URL, STAGING_API_URL, LOCALHOST_URL } = require('./general');
        expect(API_URL).toBe(STAGING_API_URL);
        expect(APP_URL).toBe(LOCALHOST_URL);
    });

    test('should use environment API_URL and APP_URL when set', () => {
        process.env.API_URL = 'https://custom.api/';
        process.env.APP_URL = 'https://custom.app/';
        const { API_URL, APP_URL } = require('./general');
        expect(API_URL).toBe('https://custom.api/');
        expect(APP_URL).toBe('https://custom.app/');
    });

    test('should correctly detect IS_LOCAL_DEV', () => {
        process.env.APP_URL = 'http://localhost:3000/';
        const { IS_LOCAL_DEV, IS_DEVELOPMENT_BRANCH, IS_PRODUCTION } = require('./general');
        expect(IS_LOCAL_DEV).toBe(true);
        expect(IS_DEVELOPMENT_BRANCH).toBe(false);
        expect(IS_PRODUCTION).toBe(false);
    });

    test('should correctly detect IS_LOCAL_DEV when using localhost alias', () => {
        process.env.APP_URL = 'http://dev-espace.library.uq.edu.au:9000/';
        const { IS_LOCAL_DEV, IS_DEVELOPMENT_BRANCH, IS_PRODUCTION } = require('./general');
        expect(IS_LOCAL_DEV).toBe(true);
        expect(IS_DEVELOPMENT_BRANCH).toBe(false);
        expect(IS_PRODUCTION).toBe(false);
    });

    test('should correctly detect IS_DEVELOPMENT_BRANCH', () => {
        process.env.APP_URL = 'https://development.library.uq.edu.au/';
        const { IS_LOCAL_DEV, IS_DEVELOPMENT_BRANCH, IS_PRODUCTION } = require('./general');
        expect(IS_LOCAL_DEV).toBe(false);
        expect(IS_DEVELOPMENT_BRANCH).toBe(true);
        expect(IS_PRODUCTION).toBe(false);
    });

    test('should correctly detect IS_PRODUCTION', () => {
        process.env.APP_URL = 'https://espace.library.uq.edu.au/';
        const { IS_LOCAL_DEV, IS_DEVELOPMENT_BRANCH, IS_PRODUCTION } = require('./general');
        expect(IS_LOCAL_DEV).toBe(false);
        expect(IS_DEVELOPMENT_BRANCH).toBe(false);
        expect(IS_PRODUCTION).toBe(true);
    });
});
