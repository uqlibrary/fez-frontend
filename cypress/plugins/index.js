// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// const {initPlugin} = require('cypress-plugin-snapshots/plugin');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    // initPlugin(on, config);
    // // https://stackoverflow.com/questions/58947967/cypress-error-the-automation-client-disconnected-cannot-continue-running-tests
    // // ref: https://docs.cypress.io/api/plugins/browser-launch-api.html#Usage
    // // https://docs.cypress.io/guides/references/migration-guide#Plugin-Event-beforebrowserlaunch
    // on('before:browser:launch', (browser = {}, launchOptions) => {
    //     if (browser.name === 'chrome') {
    //         launchOptions.args.push('--disable-dev-shm-usage');
    //         return args;
    //     }
    //
    //     return args;
    // });

    require('@cypress/code-coverage/task')(on, config);
    on('file:preprocessor', require('@cypress/code-coverage/use-browserify-istanbul'));
    return config;
};
