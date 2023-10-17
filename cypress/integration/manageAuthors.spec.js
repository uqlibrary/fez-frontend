context('manageAuthors', () => {
    beforeEach(() => {
        cy.viewport(1400, 1000);
        cy.visit('/admin/authors?user=uqstaff');
        cy.get('[data-testid="page-title"]').contains('Manage authors');
    });

    it('hides any visible alert when navigating away', () => {
        cy.contains('Delete author').should('not.exist');
        // test delete an author
        cy.get('[data-testid="authors-list-row-1-delete-this-author"]')
            .parent()
            .click();
        // should show a success alert
        cy.contains('Delete author').should('exist');
        cy.get('[data-testid="confirm-authors-delete-this-author-confirmation"]').click();
        cy.contains('An author has been successfully deleted.').should('exist');
        // nav away
        cy.get('[role=button]')
            .contains('My works')
            .click();
        cy.contains('Delete author').should('not.exist');
    });

    context('coverage', () => {
        it('can add, update', () => {
            cy.get('[data-testid="authors-add-new-author"]').click();
            cy.contains('Name information').should('exist');
            cy.get('[data-testid="aut-fname-input"]').type('Mock');
            cy.get('[data-testid="aut-lname-input"]').type('Test');
            cy.get('[data-testid="authors-add-this-author-save"]').click();
            cy.get('[data-testid="aut-display-name-0"]').should('have.attr', 'value', 'Mock Test');
            cy.contains('An author has been successfully added.').should('exist');
            cy.contains('Name information').should('not.exist');

            cy.get('button[aria-label="Edit this author"]')
                .first()
                .click();
            cy.contains('Name information').should('exist');
            cy.get('[data-testid="aut-fname-input"]').type('Mock');
            cy.get('[data-testid="aut-lname-input"]').type('Test');
            cy.get('[data-testid="authors-update-this-author-save"]').click();
            cy.contains('An author has been successfully updated.').should('exist');
        });
        it('can delete in bulk', () => {
            cy.get('[data-testid="select-author-0"]').click();
            cy.get('[data-testid="authors-delete-selected-authors"]').should('exist');
            cy.get('[data-testid="select-author-1"]').click();
            cy.get('[data-testid="authors-delete-selected-authors"]').click();
            cy.contains('Delete selected authors').should('exist');
            cy.get('[data-testid="confirm-bulk-delete-authors-confirmation"]').click();
            cy.contains('410 - Author deleted').should('exist');
            cy.contains('9999999999 - Author not found').should('exist');
        });
        it('can ingest scopus', () => {
            cy.get('[data-testid="authors-list-row-0"]').within(() => {
                cy.get('button')
                    .eq(1)
                    .click();
            });
            cy.contains('Ingest from Scopus').should('exist');
            cy.get('[data-testid="confirm-scopus-ingest-confirmation"]').click();
            cy.contains('Scopus ingest requested').should('exist');
        });
    });
});
