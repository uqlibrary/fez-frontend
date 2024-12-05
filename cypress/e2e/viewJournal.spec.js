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

        describe('editing', () => {
            it('should handle disabling lock without losing record details', () => {
                cy.visit('/admin/journal/edit/12?user=uqstaff');
                cy.data('alert').should('contain.text', 'THIS WORK IS LOCKED');
                const store = {};
                cy.data('jnl_title-input')
                    .invoke('val')
                    .then(text => (store['jnl_title-input'] = text));
                cy.data('jnl_jcr_scie_abbrev_title-input')
                    .invoke('val')
                    .then(text => (store['jnl_jcr_scie_abbrev_title-input'] = text));
                cy.data('jnl_publisher-input')
                    .invoke('val')
                    .then(text => (store['jnl_publisher-input'] = text));
                cy.data('jnl_refereed-input')
                    .invoke('val')
                    .then(text => (store['jnl_refereed-input'] = text));
                cy.data('jnl_publication_year-input')
                    .invoke('val')
                    .then(text => (store['jnl_publication_year-input'] = text));
                cy.data('jnl_publication_frequency-input')
                    .invoke('val')
                    .then(text => (store['jnl_publication_frequency-input'] = text));
                cy.get('.ck-content')
                    .invoke('text')
                    .then(text => (store['ck-content'] = text));
                cy.data('jnl_issn_jid-list-row-0').should('contain.text', '0388-0001');
                cy.data('jnl_issn_jid-list-row-1').should('contain.text', '2169-0375');
                cy.data('action-button').click();
                cy.data('alert').should('not.exist');
                cy.data('jnl_title-input')
                    .invoke('val')
                    .then(text => cy.wrap(text).should('eq', store['jnl_title-input']));
                cy.data('jnl_jcr_scie_abbrev_title-input')
                    .invoke('val')
                    .then(text => cy.wrap(text).should('eq', store['jnl_jcr_scie_abbrev_title-input']));
                cy.data('jnl_publisher-input')
                    .invoke('val')
                    .then(text => cy.wrap(text).should('eq', store['jnl_publisher-input']));
                cy.data('jnl_refereed-input')
                    .invoke('val')
                    .then(text => cy.wrap(text).should('eq', store['jnl_refereed-input']));
                cy.data('jnl_publication_year-input')
                    .invoke('val')
                    .then(text => cy.wrap(text).should('eq', store['jnl_publication_year-input']));
                cy.get('.ck-content')
                    .invoke('text')
                    .then(text => cy.wrap(text).should('eq', store['ck-content']));
                cy.data('jnl_issn_jid-list-row-0').should('contain.text', '0388-0001');
                cy.data('jnl_issn_jid-list-row-1').should('contain.text', '2169-0375');
            });
        });
    });
});
