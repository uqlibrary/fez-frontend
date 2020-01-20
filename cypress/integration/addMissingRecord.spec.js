context('Add missing record', () => {
    beforeEach(() => {
        cy.visit('/records/add/new');
    });

    afterEach(() => {
        cy.window()
            .then(win => {
                win.onbeforeunload = undefined;
            });
    });

    it('should enable the submit button on form render only', () => {
        // Journal article requires subtype selection
        cy.get('#rek-display-type')
            .should('exist')
            .click();
        cy.get('#submit-work')
            .should('not.exist');
        cy.get('#menu-rek_display_type')
            .find('li[role=option]')
            .contains('Journal Article')
            .click();
        cy.get('#submit-work')
            .should('not.exist');

        cy.get('#rek-subtype')
            .should('exist')
            .click();
        cy.get('#menu-rek_subtype')
            .find('li[role=option]')
            .contains('Editorial')
            .click();
        cy.get('#submit-work')
            .should('exist')
            .should('be.disabled');

        // Start over
        cy.window()
            .then(win => {
                win.onbeforeunload = undefined;
            });
        cy.reload();

        // Dept. Tech. report has no subtypes
        cy.get('#rek-display-type')
            .click();
        cy.get('#menu-rek_display_type')
            .find('li[role=option]')
            .contains('Department Technical Report')
            .click();
        cy.get('#submit-work')
            .should('exist')
            .should('be.disabled');
    });

    it.only('should validate form as expected', () => {
        // Choose Book > Textbook
        cy.get('#rek-display-type')
            .click();
        cy.get('#menu-rek_display_type')
            .find('li[role=option]')
            .contains('Book')
            .eq(0)
            .click();
        cy.get('#rek-subtype')
            .click();
        cy.get('#menu-rek_subtype')
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
        cy.get('#submit-work')
            .should('be.disabled');

        // Validation errors
        const invalidFieldNames = [
            'Author/creator names',
            'Editor/contributor names',
            'Title',
            'Place of publication',
            'Publisher',
            'Publication date',
        ];
        cy.get('.Alert li')
            .as('validationErrors')
            .should('have.length', invalidFieldNames.length);
        invalidFieldNames.forEach(invalidFieldName => {
            cy.get('@validationErrors')
                .contains(invalidFieldName);
        });

        cy.get('#rek-title')
            .type('book title');
        cy.get('#rek-place-of-publication')
            .type('test place of publication');
        cy.get('#rek-publisher')
            .type('test publisher');
        cy.get('#year')
            .type('2020');
        cy.get('@validationErrors')
            .should('have.length', 2);

        cy.get('#authors-name-as-published-field')
            .type('New Author');
        cy.get('#submit-author:enabled')
            .click();
        cy.contains('New Author')
            .click();
        cy.get('#submit-work')
            .should('be.enabled');

        cy.get('#delete-author-0')
            .click();
        cy.get('button')
            .contains('Yes')
            .click();
        cy.get('#submit-work')
            .should('be.disabled');
        cy.get('@validationErrors')
            .should('have.length', 2);

        cy.get('#editors-name-as-published-field')
            .type('New Editor');
        cy.get('#submit-author:enabled')
            .click();
        cy.contains('New Editor')
            .click();
        cy.get('#submit-work')
            .should('be.enabled');
    });
});
