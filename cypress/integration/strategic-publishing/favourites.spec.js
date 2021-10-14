context('Strategic Publishing - Favourite Journals', () => {
    it('Should render', () => {
        cy.visit('localhost:3000/journals/favourites/');
        cy.injectAxe();
        cy.contains("You haven't added any journals to your favourite list yet.");
        cy.checkA11y(
            'div.StandardPage',
            {
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });

    it('Should navigate to journal search when there are no favourites', () => {
        cy.visit('localhost:3000/journals/compare/');
        cy.contains('No journals were selected for comparison');
        cy.get('[data-testid="return-to-search-results-button"]').click();
        cy.location('pathname').should('contain', '/journals/search/');
    });
});
