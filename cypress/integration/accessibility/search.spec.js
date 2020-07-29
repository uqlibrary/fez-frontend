context('WCAG', () => {
    it('Search', () => {
        cy.visit('/records/search');
        cy.injectAxe();
        cy.viewport(1300, 1000);
        cy.get('input#simpleSearchField');

        cy.log('Search');
        cy.checkA11y('div#content-container', {
            reportName: 'Search',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('input#simpleSearchField').type('cats and dogs', 100);
        cy.get('button#simpleSearchButton').click();
        cy.get('div').contains('Displaying works 1 to 7 of 7 total works.');

        cy.log('Search results');
        cy.checkA11y('div#content-container', {
            reportName: 'Search results',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });

        cy.get('button#showAdvancedSearchButton').click();
        cy.log('Advanced search interface');
        cy.checkA11y('div#content-container', {
            reportName: 'Advanced search interface',
            scopeName: 'Content',
            includedImpacts: ['moderate', 'serious', 'critical'],
        });
    });
});
