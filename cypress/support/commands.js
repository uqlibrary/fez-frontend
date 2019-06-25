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
