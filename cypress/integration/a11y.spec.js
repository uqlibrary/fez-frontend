context('Accessibility tests - ', () => {
    it('Homepage', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.wait(2000);
        cy.checkA11y('header');
        cy.checkA11y('div.content-container');
        cy.checkA11y(null, {
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });

    it('Dashboard', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.wait(2000);
        cy.checkA11y(null, {
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
