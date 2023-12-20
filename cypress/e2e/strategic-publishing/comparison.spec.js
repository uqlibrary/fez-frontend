context('Strategic Publishing - Comparison', () => {
    it('Should render', () => {
        cy.visit('localhost:3000/journals/compare/');
        cy.injectAxe();
        cy.contains('No journals were selected for comparison');
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    it('Should navigate to search', () => {
        cy.visit('/journals/compare/');
        cy.contains('No journals were selected for comparison');
        cy.get('[data-testid="return-to-search-results-button"]').click();
        cy.location('pathname').should('contain', '/journals/search/');
    });

    it('Compare journals and go back to search results', () => {
        cy.viewport(1200, 1600);

        // steps required to get to the comparison page with journals
        const uri = '/journals/search/';
        const query =
            '?keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology';
        cy.visit(`${uri}${query}`);

        // wait until the progress spinner is no longer in the document. Note the
        // way this is done due to waitUntil needing a truthy value to exit.
        // https://github.com/NoriSte/cypress-wait-until/issues/75#issuecomment-572685623
        cy.waitUntil(() => Cypress.$('[role="progressbar"]').length === 0); // doesn't exist

        cy.get('[data-testid="journal-list-data-col-1-checkbox-0"]').should('be.visible');
        // make sure 3rd journal is present
        cy.get('[data-testid="journal-list-data-col-1-title-2"]').should('exist');

        cy.get('[data-testid="journal-list-data-col-1-title-0"]').then($el => {
            // get title from 1st journal
            const title1 = $el.text();
            cy.get('[data-testid="journal-list-data-col-1-title-1"]').then($el => {
                // get title from 2nd journal
                const title2 = $el.text();
                // select journals for comparison
                cy.get('[data-testid="journal-comparison-button"]').should('be.disabled');
                cy.get('[data-testid="journal-list-data-col-1-checkbox-0"]').click();
                cy.get('[data-testid="journal-comparison-button"]').should('be.disabled');
                cy.get('[data-testid="journal-list-data-col-1-checkbox-1"]').click();
                cy.get('[data-testid="journal-comparison-button"]').should('not.be.disabled');
                cy.get('[data-testid="journal-comparison-button"]').click();
                cy.location('pathname').should('eq', '/journals/compare/');
                cy.injectAxe();

                // make sure the selected journal are present
                cy.get('[data-testid="journal-list-data-col-1-title-0"]').contains(title1);
                cy.get('[data-testid="journal-list-data-col-1-title-1"]').contains(title2);
                // make sure 3rd journal is not present
                cy.get('[data-testid="journal-list-data-col-1-title-2"]').should('not.exist');
                cy.checkA11y(
                    'div.StandardPage',
                    {
                        includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
                    },
                    violations => console.log(violations),
                );

                cy.get('[data-testid="return-to-search-results-button"]').click();
                // go back to search results
                cy.location().should(loc => {
                    expect(loc.pathname).to.eq(uri);
                    expect(loc.search).to.eq(query);
                });
            });
        });
    });
});
