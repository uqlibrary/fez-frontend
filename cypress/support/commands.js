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

Cypress.Commands.add('closeUnsupported', () => {
    cy.get('#unsupportedBrowser.card button')
        .then($button => {
        // Button is only visible if browser is unsupported.
            if ($button.filter(':visible').length) {
                cy.wrap($button)
                    .click();
            }
        });
});

Cypress.Commands.add('navToHomeFromMenu', locale => {
    const baseUrl = Cypress.config('baseUrl');

    // Navigate away to trigger 'Are you sure' dialogue about unsaved changes
    cy.get('button[title="Main navigation"]')
        .should('not.be.empty')
        .click();
    cy.get('#mainMenu .menu-item-container')
        .should('not.be.empty')
        .contains('Home')
        .click();
    // Say yes to 'Are you sure' if it does trigger
    cy.url()
        .then($url => {
            if ($url !== `${baseUrl}/`) {
                cy.contains(locale.confirmationTitle)
                    .closest('[role="document"]')
                    .contains(locale.confirmButtonLabel)
                    .click();
            }
        });
});
