context('WCAG', () => {
    it('Thesis', () => {
        cy.visit('/rhdsubmission?user=s2222222');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h2').contains('Higher degree by research thesis deposit');

        cy.log('Thesis');
        cy.checkA11y('div#content-container', {
            reportName: 'Thesis form',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
