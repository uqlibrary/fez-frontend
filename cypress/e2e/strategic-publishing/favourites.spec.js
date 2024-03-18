context('Strategic Publishing - Favourite Journals', () => {
    it('Should render', () => {
        cy.visit('/journals/favourites/');
        cy.get('#journal-list-data-col-1-checkbox-1').should('exist');
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

    it('Should toggle select all', () => {
        cy.visit('/journals/favourites/');
        cy.get('#journal-list-header-col-1-select-all', { timeout: 1000 }).should('not.checked');
        cy.get('#journal-list-data-col-1-checkbox-0').should('not.be.checked');
        cy.get('#journal-list-data-col-1-checkbox-1').should('not.be.checked');
        // select all
        cy.get('#journal-list-header-col-1-select-all').click();
        cy.get('#journal-list-header-col-1-select-all').should('be.checked');
        cy.get('#journal-list-data-col-1-checkbox-0').should('be.checked');
        cy.get('#journal-list-data-col-1-checkbox-1').should('be.checked');
        // unselect first record
        cy.get('#journal-list-data-col-1-checkbox-0').click();
        cy.get('#journal-list-header-col-1-select-all').should('not.be.checked');
        cy.get('#journal-list-data-col-1-checkbox-0').should('not.be.checked');
        cy.get('#journal-list-data-col-1-checkbox-1').should('be.checked');
        // select first record
        cy.get('#journal-list-data-col-1-checkbox-0').click();
        cy.get('#journal-list-header-col-1-select-all').should('be.checked');
        cy.get('#journal-list-data-col-1-checkbox-0').should('be.checked');
        cy.get('#journal-list-data-col-1-checkbox-1').should('be.checked');
        // unselect all
        cy.get('#journal-list-header-col-1-select-all').click();
        cy.get('#journal-list-header-col-1-select-all').should('not.checked');
        cy.get('#journal-list-data-col-1-checkbox-0').should('not.be.checked');
        cy.get('#journal-list-data-col-1-checkbox-1').should('not.be.checked');
        // select all
        cy.get('#journal-list-header-col-1-select-all').click();
        cy.get('#journal-list-header-col-1-select-all').should('be.checked');
        cy.get('#journal-list-data-col-1-checkbox-0').should('be.checked');
        cy.get('#journal-list-data-col-1-checkbox-1').should('be.checked');
        // refresh page
        cy.get('[data-testid="publication-list-sorting-sort-order"]').click();
        cy.get('[data-testid="publication-list-sorting-sort-order-option-1"]').click();
        // make sure selection was cleared
        cy.get('#journal-list-header-col-1-select-all', { timeout: 1000 }).should('not.checked');
        cy.get('#journal-list-data-col-1-checkbox-0').should('not.be.checked');
        cy.get('#journal-list-data-col-1-checkbox-1').should('not.be.checked');

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

    it('Should remove a favourite journal and navigate back to search results', () => {
        const uri = '/journals/search/';
        const query =
            '?keywords%5BTitle-Microbiology%5D%5Btype%5D=Title&keywords%5BTitle-Microbiology%5D%5Btext%5D=Microbiology&keywords%5BTitle-Microbiology%5D%5Bid%5D=Title-Microbiology';
        cy.visit(`${uri}${query}`);
        cy.get('[data-testid="journal-search-favourite-journals-button"]').click();
        cy.location('pathname').should('contain', '/journals/favourites/');
        // change results sorting
        cy.get('[data-testid="publication-list-sorting-sort-order"]').click();
        cy.get('[data-testid="publication-list-sorting-sort-order-option-1"]').click();
        // remove a fav
        cy.get('[data-testid="remove-from-favourites-button"]').should('be.disabled');
        cy.get('[data-testid="journal-list-data-col-1-checkbox-1"]')
            .click()
            .should('not.be.disabled');
        cy.get('[data-testid="remove-from-favourites-button"]')
            .should('not.be.disabled')
            .click();
        cy.get('[data-testid="return-to-search-results-button"]').click();
        // go back to search results
        cy.location().should(loc => {
            expect(loc.pathname).to.eq(uri);
            expect(loc.search).to.eq(query);
        });
    });
});
