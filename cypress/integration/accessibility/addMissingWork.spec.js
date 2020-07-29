context('WCAG', () => {
    it('Add a missing work to eSpace', () => {
        cy.visit('/records/add/find?user=uqresearcher');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('div').contains('Search for your works');

        cy.log('Search for your works');
        cy.checkA11y('div#content-container', {
            reportName: 'Search for your works',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('input[data-testid="undefined-input"]').type('cats and dogs', 100);
        cy.get('button')
            .contains('Search')
            .click();
        cy.get('h3').contains('Possible matches found');

        cy.log('Possible matches found');
        cy.checkA11y('div#content-container', {
            reportName: 'Search for your works',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('button')
            .contains('Claim this work')
            .eq(0)
            .click();
        cy.get('h2').contains('Claim a work');

        cy.log('Claim a work');
        cy.checkA11y('div#content-container', {
            reportName: 'Search for your works',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
