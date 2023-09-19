context('Add missing record', () => {
    beforeEach(() => {
        cy.visit('/records/add/new');
    });

    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    it('should enable the submit button on form render only', () => {
        // Journal article requires subtype selection
        cy.get('[data-testid=rek-display-type-select]')
            .should('exist')
            .click();
        cy.get('#submit-work').should('not.exist');
        cy.get('[data-testid=rek-display-type-options]')
            .find('li[role=option]')
            .contains('Journal Article')
            .eq(0)
            .click();
        cy.get('#submit-work').should('not.exist');

        cy.get('[data-testid=rek-subtype-select]')
            .should('exist')
            .click();
        cy.get('[data-testid=rek-subtype-options]')
            .find('li[role=option]')
            .contains('Editorial')
            .click();
        cy.get('#submit-work')
            .should('exist')
            .should('be.disabled');

        // Start over
        cy.killWindowUnloadHandler();
        cy.reload();

        // Dept. Tech. report has no subtypes
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .find('li[role=option]')
            .contains('Department Technical Report')
            .click();
        cy.get('#submit-work')
            .should('exist')
            .should('be.disabled');
    });

    it('should validate form as expected', () => {
        // Choose Book > Textbook
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .find('li[role=option]')
            .contains('Book')
            .eq(0)
            .click();
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .find('li[role=option]')
            .contains('Textbook')
            .click();

        // Verify cards
        const cards = [
            'Work type',
            'Book information',
            'Authors',
            'Editors',
            'ISBN',
            'ISSN',
            'Optional details',
            'Optional: Content Indicators',
            'Upload files',
        ];
        cards.forEach((cardHeading, index) => {
            cy.get('h3')
                .eq(index)
                .contains(cardHeading);
        });

        // Submit button
        cy.get('#submit-work').should('be.disabled');

        // Validation errors
        const invalidFieldNames = [
            'Author/creator names',
            'Editor/contributor names',
            'Title',
            'Place of publication',
            'Publisher',
            'Publication date',
        ];
        cy.get('[data-testid=alert] li')
            .as('validationErrors')
            .should('have.length', invalidFieldNames.length);
        invalidFieldNames.forEach(invalidFieldName => {
            cy.get('@validationErrors').contains(invalidFieldName);
        });

        cy.get('[data-testid=rek-title-input]').type('book title');
        cy.get('[data-testid=rek-place-of-publication-input]').type('test place of publication');
        cy.get('[data-testid=rek-publisher-input]').type('test publisher');
        cy.get('[data-testid=rek-date-year-input]').type('2020');
        cy.get('@validationErrors').should('have.length', 2);

        cy.get('[data-testid=rek-author-input]').type('New Author');
        cy.get('[data-testid=rek-author-add]').click();
        cy.contains('New Author').click();
        cy.get('#submit-work').should('be.enabled');

        cy.get('#rek-author-list-row-delete-0').click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('#submit-work').should('be.disabled');
        cy.get('@validationErrors').should('have.length', 2);

        cy.get('#rek-contributor-input').type('New Editor');
        cy.get('[data-testid=rek-contributor-add]').click();
        cy.contains('New Editor').click();
        cy.get('#submit-work').should('be.enabled');
    });
});

// a NON RHD student is prompted in case they have a student account
context('Non RHD adding a Thesis', () => {
    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    it('is prompted that theses could be added elsewhere', () => {
        const baseUrl = Cypress.config('baseUrl');
        cy.visit(`${baseUrl}/records/add/new?user=uqstaff`);
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .find('li[role=option]')
            .contains('Thesis')
            .eq(0)
            .click();

        cy.get('[data-testid=standard-card-thesis-information-content]')
            .find('[data-testid="alert-warning-rdm-redirect"]')
            .should('exist')
            .should('be.visible');
    });
});
