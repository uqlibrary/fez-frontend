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
                    .closest('[role="dialog"]')
                    .contains(locale.confirmButtonLabel)
                    .click();
            }
        });
});

Cypress.Commands.add('killWindowUnloadHandler', () => {
    cy.window()
        .then(win => {
            win.onbeforeunload = undefined;
        });
});

Cypress.Commands.add('clickAutoSuggestion', (fieldName, ordinal) => {
    cy.get(`#${fieldName}-popup`)
        .should('exist');
    cy.get(`#${fieldName}-option-${ordinal}`)
        .as('menuItem')
        .should('exist');
    cy.wait(200);
    cy.get('@menuItem')
        .click();
});

Cypress.Commands.add('checkPartialDate', (selector, { day, monthName, year }) => {
    day &&
        cy
            .get(selector)
            .find('#day')
            .should('have.value', day);
    monthName &&
        cy
            .get(selector)
            .find('#select-month')
            .should('have.text', monthName);
    year &&
        cy
            .get(selector)
            .find('#year')
            .should('have.value', year);
});

Cypress.Commands.add('checkPartialDateFromRecordValue', (label, dateString) => {
    cy.root()
        .contains('label', label)
        .parent()
        .siblings('div')
        .as('dateBlock');

    const date = Cypress.moment(dateString);
    cy.checkPartialDate('@dateBlock', {
        day: date.format('D'),
        monthName: date.format('MMMM'),
        year: date.format('YYYY'),
    });
});

Cypress.Commands.add('setPartialDate', (selector, { day, month, year }) => {
    day &&
        cy
            .get(selector)
            .find('#day')
            .type(`{selectall}${day}`);
    month &&
        (() => {
            cy.get(selector)
                .find('#month')
                .click();
            cy.get('#menu-month')
                .find(`li[role=option][data-value=${month - 1}]`)
                .click();
        })();
    year &&
        cy
            .get(selector)
            .find('#year')
            .type(`{selectall}${year}`);
});

/**
 * Enables access to redux store via cy.store().
 * Can dispatch actions like example:
 *   cy.store()
 *      .dispatch({
 *          type: 'SOMETHING_FAILED',
 *          payload: 'Simulated Error',
 *      });
 */
Cypress.Commands.add('store', () => {
    return cy.window()
        .its('__store__');
});
