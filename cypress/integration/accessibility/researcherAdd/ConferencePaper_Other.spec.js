context('WCAG', () => {
    it('Researcher form', () => {
        cy.visit('/records/add/find?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('Search for your works');
        cy.get('button')
            .contains('Skip search')
            .click();

        cy.log('Conference Paper - Other');
        cy.get('div[data-testid="rek-display-type-select"]').click();
        cy.get('li[data-value="130"]')
            .eq(1)
            .click();
        cy.get('div[data-testid="rek-subtype-select"]').click();
        cy.get('li[data-value="Other"]').click();
        cy.get('h3').contains('Conference paper information');
        cy.checkA11y('div#content-container', {
            reportName: 'Conference Paper - Other',
            scopeName: 'Form',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
