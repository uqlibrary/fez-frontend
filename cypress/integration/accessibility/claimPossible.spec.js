context('WCAG', () => {
    it('Claim possible works', () => {
        cy.visit('/records/possible?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('8 out of 6 potential match(es) displayed. Select any item to claim it as your work');

        cy.log('Claim possible list');
        cy.checkA11y('div#content-container', {
            reportName: 'Claim possible list',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('button[data-testid="publication-action-UQ641272-primary"').click();
        cy.get('div').contains('You are claiming to be an author for the following work');
        cy.log('Claim possible form');
        cy.checkA11y('div#content-container', {
            reportName: 'Claim possible form',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
