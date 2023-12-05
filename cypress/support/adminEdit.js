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
    cy.get('@tabViewButton').click({ scrollBehavior: 'center' });
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

Cypress.Commands.add('addAuthorAndAssert', (authorUqname, authorId, expand = true, edit = true) => {
    cy.get('[data-testid=rek-author-add]').click();
    cy.get('[data-testid=rek-author-id-input]').type('uq');
    cy.get('[data-testid=rek-author-id-options]')
        .contains('li', authorUqname)
        .click();
    cy.get('[data-testid=rek-author-add-save]').click();
    cy.get('[data-testid^=contributor-errorIcon-]').should('exist');
    if (expand) {
        cy.get(`[data-testid=expandPanelIcon-${authorId}]`)
            .should('exist')
            .click();

        cy.get(`[data-testid=detailPanel-${authorId}]`).contains('[data-testid=orgChip-error]', '0%');
        cy.get(`[data-testid=detailPanel-${authorId}]`).contains('No affiliations have been added');
        cy.get('[data-testid=alert]').contains(
            'Author affiliation information is incomplete - Author requires at least one affiliation to be added',
        );
        if (edit) {
            cy.get('[data-testid^=affiliationEditBtn-]')
                .should('exist')
                .click();
            cy.get('[data-testid=affiliationCancelBtn]')
                .should('exist')
                .should('not.be.disabled');
            cy.get('[data-testid=affiliationSaveBtn]')
                .should('exist')
                .should('be.disabled');
        }
    }
});

Cypress.Commands.add('assertAffiliation', (orgName, orgId, expectedPercent) => {
    cy.get(`[data-testid=orgSelect-${orgId}-input]`)
        .should('exist')
        .should('have.value', orgName);

    cy.get(`[data-testid=orgChip-${orgId}`)
        .should('exist')
        .contains(expectedPercent);
});

Cypress.Commands.add('addAffiliationAndAssert', (orgName, orgId, expectedPercent, suggested = false) => {
    cy.get('[data-testid=orgSelect-add-input]')
        .should('exist')
        .click();
    cy.get('[data-testid=orgSelect-add-options]')
        .contains('li', orgName)
        .click();

    cy.assertAffiliation(suggested ? orgName.replace('Suggested: ', '') : orgName, orgId, expectedPercent);
});

Cypress.Commands.add('editAffiliationAndAssert', (currentOrgId, nextOrgId, nextOrgName, expectedPercent) => {
    cy.get(`[data-testid=orgSelect-${currentOrgId}-input]`)
        .should('exist')
        .click();
    cy.get(`[data-testid=orgSelect-${currentOrgId}-options]`)
        .contains('li', nextOrgName)
        .click();

    cy.assertAffiliation(nextOrgName, nextOrgId, expectedPercent);
});

Cypress.Commands.add(
    'assertAffiliationsAllowed',
    ({ authorName, orgName, rowId, allowed = false, tabbed = true } = {}) => {
        if (tabbed) {
            cy.adminEditTabbedView();
        }
        cy.get('[data-testid="authors-tab"]').click();

        // add linked author
        cy.get('[data-testid=rek-author-add]').should('exist');
        cy.get('[data-testid=rek-author-add]').click();

        cy.get('[data-testid=rek-author-id-input]').type('uq');
        cy.get('[data-testid=rek-author-id-options]')
            .contains('li', authorName)
            .click();
        cy.get('[data-testid=rek-author-add-save]').click();
        cy.get('[data-testid^=contributor-errorIcon]').should(allowed ? 'exist' : 'not.exist');
        cy.get(`[data-testid=rek-author-list-row-${rowId}]`).within(() => {
            cy.get(allowed ? '[data-testid^=expandPanelIcon-]' : '[data-testid=ChevronRightIcon]').should('exist');
            cy.get(allowed ? '[data-testid^=expandPanelIcon-]' : '[data-testid=ChevronRightIcon]').click();
        });
        cy.get('[data-testid=rek-author-list]').contains(allowed ? 'No affiliations have been added' : orgName);
        cy.get('[data-testid=rek-author-list]').within(() => {
            cy.get('[data-testid=alert]').should(allowed ? 'exist' : 'not.exist');
        });
    },
);
