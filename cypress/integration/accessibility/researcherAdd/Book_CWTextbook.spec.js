context('WCAG', () => {
    it('Researcher form', () => {
        cy.visit('/records/add/find?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('Search for your works');
        cy.get('button')
            .contains('Skip search')
            .click();

        cy.log('Book - Textbook');
        cy.get('div[data-testid="rek-display-type-select"]').click();
        cy.get('li[data-value="174"]')
            .eq(1)
            .click();
        cy.get('div[data-testid="rek-subtype-select"]').click();
        cy.get('li[data-value="Textbook"]').click();
        cy.get('h3').contains('Book information');
        cy.checkA11y('div#content-container', {
            reportName: 'Book - Textbook',
            scopeName: 'Form',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
