context('Search', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/records/search');
        cy.get('button')
            .contains('Close this message', {timeout: 5000})
            .click({
                force: true,
            });
    });

    it('Doing a basic search to advanced search', () => {
        // Perform a basic search
        cy.get('#simpleSearchField').type('cats and dogs{enter}', {delay: 20});
        cy.get('.StandardCard').should(
            'contain',
            'Displaying works 1 to 6 of 6 total records.',
        );
        cy.get('h6').should('contain', 'Refine results');
        cy.get('#showAdvancedSearchButton').should('be.visible');
        // Click through to advanced search UI
        cy.get('#showAdvancedSearchButton').click();
        cy.get('h5').should('contain', 'Advanced search');
        cy.get('input[name="searchField0"]').should(
            'have.value',
            'cats and dogs',
        );
        // Check the open access checkbox, then click "away"
        cy.get(
            '[aria-label="Check to search for publications with are only open access / full text"]',
        ).click();
        cy.get('body').click();
        // Add another advanced search field
        cy.get(
            '[aria-label="Click to add another advanced search field"]',
        ).click();
        cy.get('.content-container').scrollTo('top');
        cy.get(
            'div[aria-label="Click to select a field to search from the list - Select a field currently selected"]')
            .get('p')
            .contains('Please select a field to search')
            .should('be.visible');
        // Select author from the field dropdown
        cy.get(
            '[aria-label="Click to select a field to search from the list - Select a field currently selected"]',
        ).click();
        cy.get('[data-value="rek_author"]').click();
        cy.get('button#advancedSearchButton').should('to.have.attr', 'disabled');
        cy.get('[placeholder="Add an author name"]').type('Ky Lane{enter}', {delay: 100});
        cy.get('button#advancedSearchButton').should('not.to.have.attr', 'disabled');
        // Add a set of collections to search from
        cy.get('[aria-label="Click to add another advanced search field"]', {delay: 1000}).click();
        cy.get(
            '[aria-label="Click to select a field to search from the list - Select a field currently selected"]',
        ).click();
        cy.get('[data-value="rek_ismemberof"]').click();
        cy.get('button#advancedSearchButton').should('to.have.attr', 'disabled');
        cy.get('div')
            .contains('Select collections')
            .click();
        cy.get('[data-value="UQ:131735"]').click();
        cy.get('[data-value="UQ:131375"]').click();
        cy.get('[data-value="UQ:292807"]').click();
        cy.get('div[id="menu-"]')
            .get('div[aria-hidden="true"]')
            .click({force: true, multiple: true}); // This will close any select field modal popup by force
        cy.get('button#advancedSearchButton').should('not.to.have.attr', 'disabled');
    });
});
