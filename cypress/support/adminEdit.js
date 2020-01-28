/**
 * Common commands for admin edit tests
 */

const tabHeadingSelector = '.StandardPage form > div > div > div.StandardCard > div > div > h3';

Cypress.Commands.add('loadRecordForAdminEdit', pid => {
    cy.visit(`/admin/edit/${pid}?user=uqstaff`);
    cy.closeUnsupported();
    cy.wait(1000); // Wait for data load
});

Cypress.Commands.add('adminEditCleanup', () => {
    cy.window()
        .then(win => {
        // Unset page unload handler
            win.onbeforeunload = undefined;
        });

    cy.kill_ckeditor();
});

Cypress.Commands.add('adminEditCountCards', count => {
    cy.get(tabHeadingSelector)
        .should('have.length', count);
});

Cypress.Commands.add('adminEditNoAlerts', () => {
    cy.get('.StandardPage form > div:nth-child(2)')
        .within(() => {
            cy.get('.Alert')
                .should('not.exist');
        });

    cy.get('.StandardPage form button')
        .contains('Submit')
        .should('exist')
        .parent()
        .should('be.enabled');
});

Cypress.Commands.add('adminEditVerifyAlerts', (count, messages) => {
    cy.get('.StandardPage form > div:nth-child(2)')
        .within(() => {
            cy.get('.Alert')
                .should('exist')
                .find('.alert-text')
                .should('contain', 'Validation -')
                .find('li')
                .as('alertMessages')
                .should('have.length', count);
            messages.forEach(message => {
                cy.get('@alertMessages')
                    .should('contain', message);
            });
        });

    cy.get('.StandardPage form button')
        .contains('Submit')
        .should('exist')
        .parent()
        .should('be.disabled');
});

Cypress.Commands.add('adminEditTabbedView', (showTabs = true) => {
    cy.wait(1000); // Wait for tabbing mechanism to fully load
    cy.get('input[value=tabbed]')
        .as('tabViewButton')
        .should(showTabs ? 'not.be.checked' : 'be.checked');
    cy.get('@tabViewButton')
        .click();
    cy.waitUntil(() => {
        const tabCount = Cypress.$(tabHeadingSelector).length;
        return (showTabs && tabCount === 1) || (!showTabs && tabCount > 1);
    });
    cy.get('@tabViewButton')
        .should(showTabs ? 'be.checked' : 'not.be.checked');
});

Cypress.Commands.add('adminEditCheckDefaultTab', tabTitle => {
    cy.get(tabHeadingSelector)
        .should('have.length', 1)
        .should('have.text', tabTitle);
});

Cypress.Commands.add('adminEditCheckTabErrorBadge', tabIndex => {
    cy.get('[role="tab"]')
        .eq(tabIndex)
        .find('[class*="MuiBadge-colorError"]')
        .should('have.text', '1');
});
