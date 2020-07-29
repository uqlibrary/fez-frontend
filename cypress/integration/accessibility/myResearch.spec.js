context('WCAG', () => {
    it('My Research', () => {
        cy.visit('/records/mine?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('Displaying records 1 to 20 of 68 total records');
        cy.log('My research');
        cy.checkA11y('div#content-container', {
            reportName: 'Dashboard',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
