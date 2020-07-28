context('WCAG', () => {
    it('Homepage', () => {
        cy.visit('/');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('h3').contains('What is eSpace?');
        cy.log('Homepage');
        cy.checkA11y('div#content-container', {
            reportName: 'Homepage',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
