context('Strategic Publishing - Favourite Journals', () => {
    it('Should render', () => {
        cy.visit('/journals/favourites/');
        cy.get('[data-testid="journal-list-checkbox-1"]', { timeout: 1000 });
        cy.injectAxe();
        cy.checkA11y(
            'div.StandardPage',
            {
                // TODO add 'critical' to the list below once journalList passes accessibility tests
                includedImpacts: ['minor', 'moderate', 'serious'],
            },
            violations => cy.axeViolationParser(violations),
        );
    });

    it('Should navigate to search', () => {
        cy.visit('/journals/favourites/');
        cy.get('[data-testid="return-to-search-results-button"]').click();
        cy.location('pathname').should('contain', '/journals/search/');
    });

    it('Should navigate to search results', () => {
        const uri = '/journals/search/';
        const query =
            '?keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology';
        cy.visit(`${uri}${query}`);
        cy.get('[data-testid="journal-search-favourite-journals-button"]').click();
        cy.location('pathname').should('contain', '/journals/favourites/');
        cy.get('[data-testid="remove-from-favourites-button"]').should('be.disabled');
        // remove a fav
        cy.get('[data-testid="journal-list-checkbox-1"]')
            .click()
            .should('not.be.disabled');
        cy.get('[data-testid="remove-from-favourites-button"]')
            .should('not.be.disabled')
            .click();
        // change results sorting
        cy.get('[data-testid="publication-list-sorting-sort-order"]').click();
        cy.get('[data-testid="publication-list-sorting-sort-order-option-1"]').click();
        cy.get('[data-testid="return-to-search-results-button"]').click();
        // go back to search results
        cy.location().should(loc => {
            expect(loc.pathname).to.eq(uri);
            expect(loc.search).to.eq(query);
        });
    });
});
