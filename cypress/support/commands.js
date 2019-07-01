// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload';

// Allows the targeting of CKEditors
// CKeditor dynamically names instances as "editor1", "editor2" etc.
// USAGE : cy.type_ckeditor('editor1', '<p>This is some text</p>');
Cypress.Commands.add('type_ckeditor', (element, content) => {
    cy.window()
        .then(win => {
            win.CKEDITOR.instances[element].setData(content);
        });
});

Cypress.Commands.add('closeUnsupported', () => {
    cy.get('#unsupportedBrowser.card button')
        .then(($button) => {
            // Button is only visible if browser is unsupported.
            if ($button.filter(':visible').length) {
                cy.wrap($button)
                    .click();
            }
        });
});

Cypress.Commands.add('navToHomeFromMenu', (locale) => {
    const baseUrl = Cypress.config('baseUrl');

    // Navigate away to trigger 'Are you sure' dialogue about unsaved changes
    cy.get('button[title="Main navigation"]')
        .click();
    cy.get('#mainMenu .menu-item-container')
        .contains('Home')
        .click();
    // Say yes to 'Are you sure' if it does trigger
    cy.url()
        .then(($url) => {
            if ($url !== `${baseUrl}/`) {
                cy.contains(locale.confirmationTitle)
                    .closest('[role="document"]')
                    .contains(locale.confirmButtonLabel)
                    .click();
            }
        });
});
