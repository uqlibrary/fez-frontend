context('Navigating to Admin Dashboard - System Alerts tab', () => {
    it('should be reachable via the menu link for users with masquerade=full', () => {
        cy.viewport(1300, 1000);
        cy.visit('/?user=uqstaff');
        cy.get('#menudrawer').should('exist');
        cy.get('[role=button]')
            .contains('Admin dashboard')
            .click();
        cy.url().then($url => {
            expect($url.includes('admin/dashboard')).to.equal(true);
        });
        cy.injectAxe();
        cy.data('page-title').contains('Admin dashboard');

        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    it('should not reachable via the menu link for users with masquerade=readonly or below', () => {
        cy.viewport(1300, 1000);
        cy.visit('/?user=uqresearcher');
        cy.get('#menudrawer').should('exist');
        cy.get('[role=button]')
            .contains('Admin dashboard')
            .should('not.exist');

        cy.visit('/admin/dashboard?user=uqresearcher');
        cy.url().then($url => {
            expect($url.includes('admin/dashboard')).to.equal(true);
        });
        cy.data('page-title').contains('Page not found');
    });
});
