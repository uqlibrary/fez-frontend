context('WCAG', () => {
    it('My research data\n', () => {
        cy.visit('/data-collections/mine?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('Displaying records 1 to 20 of 68 total records');

        cy.log('My research data');
        cy.checkA11y('div#content-container', {
            reportName: 'My research data',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('button[data-testid="publication-action-UQ678728-secondary"').click();
        cy.get('h2').contains('Request a correction, add more information or upload files');
        cy.get('h3').contains('Work to be amended');
        cy.log('Request a correction');
        cy.checkA11y('div#content-container', {
            reportName: 'Request a correction',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
