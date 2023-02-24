/**
 * Common commands for admin edit tests
 *
 * Note: Even through these are named "adminEdit", some of these are also used in admin add tests.
 */

const tabHeadingSelector = '.StandardPage form > div > div div.StandardCard > div > div > h3';

Cypress.Commands.add('loadRecordForAdminEdit', pid => {
    cy.visit(`/admin/edit/${pid}?user=uqstaff`);
    cy.get('h2').should('contain.text', pid);
});

Cypress.Commands.add('adminEditCleanup', () => {
    cy.killCKEditor();
    cy.killWindowUnloadHandler();
});

Cypress.Commands.add('adminEditCountCards', count => {
    cy.get(tabHeadingSelector).should('have.length', count);
});

Cypress.Commands.add('adminEditNoAlerts', () => {
    cy.get('.StandardPage form > div:first-child').within(() => {
        cy.get('[data-testid=alert]').should('not.exist');
    });

    cy.get('#admin-work-submit')
        .should('exist')
        .should('be.enabled');
});

Cypress.Commands.add('adminEditVerifyAlerts', (count, messages) => {
    cy.get('[data-testid=alert-warning]').within(() => {
        cy.get('.alert-text')
            .should('contain', 'Validation -')
            .find('li')
            .as('alertMessages')
            .should('have.length', count);
        messages.forEach(message => {
            cy.get('@alertMessages').should('contain', message);
        });
    });

    cy.get('#admin-work-submit')
        .should('exist')
        .should('be.disabled');
});

Cypress.Commands.add('adminEditTabbedView', (showTabs = true) => {
    cy.wait(1000); // Wait for tabbing mechanism to fully load
    cy.get('input[value=tabbed]')
        .as('tabViewButton')
        .should(showTabs ? 'not.be.checked' : 'be.checked');
    cy.wait(200);
    cy.get('@tabViewButton').click({ force: true });
    cy.waitUntil(() => {
        const tabCount = Cypress.$(tabHeadingSelector).length;
        return (showTabs && tabCount === 1) || (!showTabs && tabCount > 1);
    });
    cy.get('@tabViewButton').should(showTabs ? 'be.checked' : 'not.be.checked');
});

Cypress.Commands.add('adminEditCheckDefaultTab', tabTitle => {
    cy.get(tabHeadingSelector)
        .should('have.length', 1)
        .should('have.text', tabTitle);
});

Cypress.Commands.add('adminEditCheckTabErrorBadge', (tab, value = '1') => {
    cy.get(`[data-testid=${tab}-tab]`)
        .find('[class*="MuiBadge-colorError"]')
        .should('have.text', value);
});

// change the value in a NewGenericSelectField and confirm it is as expected
// eg cy.assertChangeSelectFromTo('rek-significance', 'Major', 'Minor');
// initial value can be '' for unselected
Cypress.Commands.add('assertChangeSelectFromTo', (item, changeFrom, changeTo) => {
    cy.log(`expect ${item}-select to change from '${changeFrom}' to '${changeTo}'`);
    cy.waitUntil(() => cy.get(`[data-testid="${item}-select"]`).should('exist'));
    if (changeFrom === '') {
        // nothing is selected in the dropdown
        cy.get(`[data-testid="${item}-select"]`)
            .then(text => {
                expect(text).to.have.lengthOf(1); // special zero length string
            })
            .click();
    } else {
        // an item is selected in the dropdown
        cy.get(`[data-testid="${item}-select"]`)
            .should('exist')
            .should('contain', changeFrom)
            .click();
    }
    cy.waitUntil(() => cy.get(`[data-testid="${item}-options"]`).should('exist'));
    cy.get(`[data-testid="${item}-options"]`)
        .contains(changeTo)
        .click();
    cy.get(`[data-testid="${item}-select"]`).should('contain', changeTo);
});
