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

    it('should display doi existed error', () => {
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

        cy.get('[data-testid=rek-doi-input]').type('10.1426/12345');
        cy.get('[data-testid=rek-doi-helper-text]').contains('DOI is assigned to another work');
        cy.get('@validationErrors').should('have.length', 1);
        cy.get('#submit-work').should('be.disabled');
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
context('Reorder and edit Contributor(s)', () => {
    beforeEach(() => {
        cy.visit('/records/add/new');
    });
    afterEach(() => {
        cy.killWindowUnloadHandler();
    });

    it('contributors can be reordered and edited', () => {
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

        // Validation error checks
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

        cy.get('[data-testid=rek-author-input]').type('First');
        cy.get('[data-testid=rek-author-add]').click();
        cy.get('[data-testid=rek-author-input]').type('Second');
        cy.get('[data-testid=rek-author-add]').click();
        // Check the movement arrows
        cy.get('[data-testid="rek-author-list-row-0-move-down"]').should('exist');
        cy.get('[data-testid="rek-author-list-row-0-move-up"]').should('not.exist');
        cy.get('[data-testid="rek-author-list-row-1-move-up"]').should('exist');
        cy.get('[data-testid="rek-author-list-row-1-move-down"]').should('not.exist');

        cy.get('[data-testid="rek-author-list-row-0-name-as-published"]').should('contain', 'First');
        cy.get('[data-testid="rek-author-list-row-1-name-as-published"]').should('contain', 'Second');
        // switch the order.
        cy.get('[data-testid="rek-author-list-row-1-move-up"]').click();
        // check the data.
        cy.get('[data-testid="rek-author-list-row-1-name-as-published"]').should('contain', 'First');
        cy.get('[data-testid="rek-author-list-row-0-name-as-published"]').should('contain', 'Second');
        // Edit the data.
        cy.get('[data-testid="rek-author-list-row-0-edit"]').click();
        cy.get('[data-testid="rek-author-input"]').should('have.value', 'Second');
        cy.get('[data-testid="rek-author-input"]')
            .clear()
            .type('Second Edited');
        cy.get('[data-testid=rek-author-add]').click();
        // Change reflected in the list.
        cy.get('[data-testid="rek-author-list-row-0-name-as-published"]').should('contain', 'Second Edited');
        // Select "First" as yourself.
        cy.get('[data-testid="rek-author-list-row-1-name-as-published"]').click();
        // is selected.
        cy.get('[data-testid="rek-author-list-row-1"] [data-testid="PersonIcon"]').should('exist');
        cy.get('[data-testid="rek-author-list-row-0"] [data-testid="PersonIcon"]').should('not.exist');
        // switch selected.
        cy.get('[data-testid="rek-author-list-row-0-name-as-published"]').click();
        // is selected.
        cy.get('[data-testid="rek-author-list-row-0"] [data-testid="PersonIcon"]').should('exist');
        cy.get('[data-testid="rek-author-list-row-1"] [data-testid="PersonIcon"]').should('not.exist');
    });

    it('NTRO can be reordered and edited', () => {
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .find('li[role=option]')
            .contains('Book')
            .eq(0)
            .click();
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .find('li[role=option]')
            .contains('Creative Work - Textual')
            .click();

        cy.get('[data-testid=rek-title-input]').type('book title');
        cy.get('[data-testid=rek-place-of-publication-input]').type('test place of publication');
        cy.get('[data-testid=rek-publisher-input]').type('test publisher');
        cy.get('[data-testid=rek-date-year-input]').type('2020');

        // Grant information.
        cy.get('[data-testid="rek-grant-agency-input"]').type('First Grant');
        cy.get('[data-testid="rek-grant-id-input"]').type('12345');
        cy.get('[data-testid="rek-grant-type-select"]').click();
        cy.get('[data-testid=rek-grant-type-options]')
            .find('li[role=option]')
            .contains('NGO')
            .click();
        cy.get('[data-testid="rek-grant-add"]').click();

        cy.get('[data-testid="rek-grant-add"]');
        cy.get('[data-testid="rek-grant-agency-input"]').type('Second Grant');
        cy.get('[data-testid="rek-grant-id-input"]').type('23456');
        cy.get('[data-testid="rek-grant-type-select"]').click();
        cy.get('[data-testid=rek-grant-type-options]')
            .find('li[role=option]')
            .contains('NGO')
            .click();
        cy.get('[data-testid="rek-grant-add"]').click();

        cy.get('[data-testid="grant-list-move-up=0"]').should('have.attr', 'disabled');
        cy.get('[data-testid="grant-list-move-down=1"]').should('have.attr', 'disabled');

        cy.get('[data-testid="grant-list-row-0"]').should('contain', 'First Grant');
        cy.get('[data-testid="grant-list-row-1"]').should('contain', 'Second Grant');

        cy.get('[data-testid="grant-list-move-down=0"]').click();

        cy.get('[data-testid="grant-list-row-1"]').should('contain', 'First Grant');
        cy.get('[data-testid="grant-list-row-0"]').should('contain', 'Second Grant');

        cy.get('#edit-grant-info-0').click();
        cy.get('[data-testid="rek-grant-agency-input"]').should('have.value', 'Second Grant');
        cy.get('[data-testid="rek-grant-agency-input"]')
            .clear()
            .type('Edited Grant');
        cy.get('[data-testid="rek-grant-update"]').click();
        cy.get('[data-testid="grant-list-row-0"]').should('contain', 'Edited Grant');
    });
});
