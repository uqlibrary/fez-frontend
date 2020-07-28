context('WCAG', () => {
    it('Researcher dashboard', () => {
        cy.visit('/dashboard?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('Professor J Researcher');
        cy.log('Dashboard');
        cy.checkA11y('div#content-container', {
            reportName: 'Dashboard',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
