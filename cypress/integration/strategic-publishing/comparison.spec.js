context('Strategic Publishing - Comparison', () => {
    beforeEach(() => {
        cy.injectAxe();
    });

    it('Should navigate to journal search', () => {
        cy.visit('localhost:3000/journals/compare/');
        cy.contains('No journals were selected for comparison');
        cy.get('[data-testid="return-to-search-results-button"]').click();
        cy.location('pathname').should('contain', '/journals/search/');
    });

    // it('Should be compliant to WCAG2', () => {
    //     cy.visit('localhost:3000/journals/compare/');
    //     cy.contains('No journals were selected for comparison');
    //     // cy.checkA11y(
    //     //     'div.StandardPage',
    //     //     {
    //     //         includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
    //     //     },
    //     //     violations => console.log(violations),
    //     // );
    // });

    it('Compare journals', () => {
        cy.visit('localhost:3000/journals/search/');
        // steps required to get to the comparison page with journals
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="journal-list-checkbox-0"]', { timeout: 1000 }).should('be.visible');
        // make sure 3rd journal is present
        cy.get('[data-testid="journal-list-title-2"]').should('exist');

        cy.get('[data-testid="journal-list-title-0"]').then($el => {
            // get title from 1st journal
            const title1 = $el.text();
            cy.get('[data-testid="journal-list-title-1"]').then($el => {
                // get title from 2nd journal
                const title2 = $el.text();
                // select journals for comparison
                cy.get('[data-testid="journal-comparison-button"]').should('be.disabled');
                cy.get('[data-testid="journal-list-checkbox-0"]').click();
                cy.get('[data-testid="journal-comparison-button"]').should('be.disabled');
                cy.get('[data-testid="journal-list-checkbox-1"]').click();
                cy.get('[data-testid="journal-comparison-button"]').should('not.be.disabled');
                cy.get('[data-testid="journal-comparison-button"]').click();
                cy.location('pathname').should('eq', '/journals/compare/');

                // make sure the selected journal are present
                cy.get('[data-testid="journal-list-title-0"]').contains(title1);
                cy.get('[data-testid="journal-list-title-1"]').contains(title2);
                // make sure 3rd journal is not present
                cy.get('[data-testid="journal-list-title-2"]').should('not.exist');
                cy.get('[data-testid="return-to-search-results-button"]').click();
                cy.location('pathname').should('contain', '/journals/search/');
            });
        });
    });
});
