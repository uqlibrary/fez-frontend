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

import moment from 'moment';

Cypress.Commands.add('navToHomeFromMenu', locale => {
    const baseUrl = Cypress.config('baseUrl');

    // Navigate away to trigger 'Are you sure' dialogue about unsaved changes
    cy.get('button#main-menu-button')
        .should('not.be.empty')
        .click();
    cy.wait(1000);
    cy.get('#menu-item-0').click();
    // Say yes to 'Are you sure' if it does trigger
    if (!!locale) {
        cy.url().then($url => {
            if ($url !== `${baseUrl}/`) {
                cy.contains(locale.confirmationTitle)
                    .closest('[role="dialog"]')
                    .contains(locale.confirmButtonLabel)
                    .click();
            }
        });
    }
});

Cypress.Commands.add('killWindowUnloadHandler', () => {
    cy.window().then(win => {
        // win.onbeforeunload = undefined;
    });
});

Cypress.Commands.add('clickAutoSuggestion', (fieldName, ordinal) => {
    cy.get(`[data-testid=${fieldName}-options]`).should('exist');
    cy.get(`#${fieldName}-option-${ordinal}`)
        .as('menuItem')
        .should('exist');
    cy.wait(200);
    cy.get('@menuItem').click();
});

Cypress.Commands.add('checkPartialDate', (id, { day, monthName, year }) => {
    day && cy.get(`[data-testid=${id}-day-input]`).should('have.value', day);
    monthName && cy.get(`[data-testid=${id}-month-select]`).should('have.text', monthName);
    year && cy.get(`[data-testid=${id}-year-input]`).should('have.value', year);
});

Cypress.Commands.add('checkPartialDateFromRecordValue', (id, dateString) => {
    const date = moment(dateString);
    cy.checkPartialDate(id, {
        day: date.format('D'),
        monthName: date.format('MMMM'),
        year: date.format('YYYY'),
    });
});

Cypress.Commands.add('setPartialDate', (id, { day, month, year }) => {
    day && cy.get(`[data-testid=${id}-day-input]`).type(`{selectall}${day}`);
    month &&
        (() => {
            cy.get(`[data-testid=${id}-month-select]`).click();
            cy.get(`[data-testid=${id}-month-options]`)
                .find(`li[role=option][data-value=${month - 1}]`)
                .click();
        })();
    year && cy.get(`[data-testid=${id}-year-input]`).type(`{selectall}${year}`);
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
    return cy.window().its('__store__');
});

Cypress.Commands.add('axeViolationParser', errors => {
    errors.map(error => {
        const elements = [];
        error.nodes.map(node => elements.push(Cypress.$(node.target).get(0) || console.log(node.target)));
        console.log(`${error.impact} : ${error.description}`, elements);
    });
});
