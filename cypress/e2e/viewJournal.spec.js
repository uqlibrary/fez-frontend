context('view Journal', () => {
    function tabVisibleInWindow(tabId, visibility, buttonType = 'ssci') {
        cy.get(`button[data-testid="journal-details-tab-fez-journal-jcr-${buttonType}-category-${tabId}-heading"]`)
            .should('exist')
            .should(visibility);
    }

    it('should have appropriate scroll buttons', () => {
        cy.visit('/journal/view/8508?user=uqresearcher');
        cy.get('div[data-testid="journal-details-jscie"]').scrollIntoView();
        tabVisibleInWindow('0', 'be.visible', 'scie');
        tabVisibleInWindow('1', 'be.visible', 'scie');
        cy.get('div[data-testid="journal-details-jscie"]')
            .find('div.MuiTabs-scrollButtons')
            .should('not.exist');

        cy.get('div[data-testid="journal-details-jssci"]').scrollIntoView();
        tabVisibleInWindow('0', 'be.visible');
        tabVisibleInWindow('3', 'not.be.visible');
        tabVisibleInWindow('4', 'not.be.visible');
        cy.get('div[data-testid="journal-details-jssci"]')
            .find('div.MuiTabs-scrollButtons')
            .eq(1) // right hand scroll button
            .should('exist')
            .click();
        tabVisibleInWindow('0', 'not.be.visible');
        tabVisibleInWindow('3', 'be.visible');
        tabVisibleInWindow('4', 'be.visible');
    });

    it('should have an advisory statement', () => {
        cy.visit('/journal/view/12');
        cy.get('[data-testid=alert]').should('contain.text', 'Advisory statement');
    });

    describe('admin', () => {
        it('should show a larger admin menu button in desktop view', () => {
            cy.viewport(1200, 1000);
            cy.visit('/journal/view/12?user=uqstaff');
            cy.get('[data-testid=admin-actions-button]').should('have.class', 'MuiIconButton-sizeLarge');
        });
        it('should show a small admin menu button in mobile view', () => {
            cy.viewport(480, 1000);
            cy.visit('/journal/view/12?user=uqstaff');
            cy.get('[data-testid=admin-actions-button]').should('have.class', 'MuiIconButton-sizeSmall');
        });

        it('should navigate to the edit admin journal page and use current page url as navigatedFrom value', () => {
            const baseUrl = Cypress.config('baseUrl');
            cy.visit('/journal/view/12?user=uqstaff');
            cy.get('[data-testid=admin-actions-button]')
                .click()
                .then(() => {
                    cy.get('[role="menuitem"]')
                        .eq(0)
                        .click();
                });
            cy.url().should(
                'equal',
                `${baseUrl}/admin/journal/edit/12?navigatedFrom=%2Fjournal%2Fview%2F12%3Fuser%3Duqstaff`,
            );
        });
        it('should navigate to the edit admin journal page and set navigatedFrom to the hash value (coverage)', () => {
            const baseUrl = Cypress.config('baseUrl');
            cy.visit('/journal/view/12?user=uqstaff#test');
            cy.get('[data-testid=admin-actions-button]')
                .click()
                .then(() => {
                    cy.get('[role="menuitem"]')
                        .eq(0)
                        .click();
                });
            cy.url().should('equal', `${baseUrl}/admin/journal/edit/12?navigatedFrom=test`);
        });
    });
});
