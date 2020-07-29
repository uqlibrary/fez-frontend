context('WCAG', () => {
    it('My incomplete works', () => {
        cy.visit('/records/incomplete?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('Displaying works 1 to 6 of 6 total works.');

        cy.log('Incomplete list');
        cy.checkA11y('div#content-container', {
            reportName: 'Claim possible list',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('button[data-testid="publication-action-UQ692945-primary"]').click();

        cy.log('Incomplete list');
        cy.get('h2').contains('Complete my work');
        cy.checkA11y('div#content-container', {
            reportName: 'Claim possible list',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
