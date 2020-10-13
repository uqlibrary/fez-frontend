/**
 * Common commands for admin edit tests
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
        cy.get('.Alert').should('not.exist');
    });

    cy.get('#admin-work-submit')
        .should('exist')
        .should('be.enabled');
});

Cypress.Commands.add('adminEditVerifyAlerts', (count, messages) => {
    cy.get('[data-testid=form-validation-warning]').within(() => {
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
    cy.get('@tabViewButton').click();
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

Cypress.Commands.add('adminEditCheckTabErrorBadge', (tabIndex, value = '1') => {
    cy.get('[role="tab"]')
        .eq(tabIndex)
        .find('[class*="MuiBadge-colorError"]')
        .should('have.text', value);
});
