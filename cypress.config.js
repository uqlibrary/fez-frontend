const { defineConfig } = require('cypress');

module.exports = defineConfig({
    blockHosts: ['www.googletagmanager.com'],
    chromeWebSecurity: true,
    defaultCommandTimeout: 10000,
    numTestsKeptInMemory: 50,
    pageLoadTimeout: 30000,
    projectId: 'mvfnrv',
    retries: {
        openMode: 0,
        runMode: 2,
    },
    // videoUploadOnPasses: false,
    waitForAnimations: true,
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            return require('./cypress/plugins/index.js')(on, config);
        },
        baseUrl: 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    },
});
