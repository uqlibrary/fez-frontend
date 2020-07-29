context('WCAG', () => {
    it('Add data collection', () => {
        cy.visit('/data-collections/add?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h3').contains('Deposit agreement');

        cy.log('Add data collection');
        cy.checkA11y('div#content-container', {
            reportName: 'Add data collection',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
