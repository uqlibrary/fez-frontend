// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Plugins
import 'cypress-file-upload';
import 'cypress-plugin-tab';
import '@cypress/code-coverage/support';
import 'cypress-wait-until';
import 'cypress-axe';

// Custom
import './adminEdit';
import './ckeditor';
import './commands';

export const A11YOptions = {
    runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'section508'],
    },
};
// Ignore uncaught exceptions
// https://docs.cypress.io/guides/references/error-messages.html#Uncaught-exceptions-from-your-application
// Cypress has flagged handling of uncaught app exceptions as WIP.
// They recommend ignoring these until they say otherwise.
Cypress.on('uncaught:exception', () => {
    return false;
});
