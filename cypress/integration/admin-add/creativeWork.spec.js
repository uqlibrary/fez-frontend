context('As an admin, I can', () => {
    // load the admin add page for a Creative Work with the indicated collection and subType and open the NTRO tab

    function createBasicRecordType(collectionRowId, subtypeName) {
        // Choose a collection
        cy.get('[data-testid=rek-ismemberof-input]').type('a');
        cy.clickAutoSuggestion('rek-ismemberof', collectionRowId);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Creative Work')
            .click();

        // Choose subtype
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .contains('li', subtypeName)
            .click();

        // Apply selections
        cy.get('button')
            .contains('Create work')
            .should('exist')
            .click();

        cy.adminEditTabbedView();
    }
    function loadNtroTabAdminAdd() {
        cy.get('[data-testid="ntro-tab"]').click();
    }

    function createAuthors(authorName) {
        cy.get('[data-testid="authors-tab"]').click();
        cy.get('[data-testid="rek-author-add"]').click();
        cy.get('[data-testid="rek-author-input"]').type(authorName);
        cy.get('[data-testid="rek-author-add-save"]').click();
    }

    it('add a creative work', () => {
        cy.visit('/admin/add?user=uqstaff');
        // Create record
        createBasicRecordType(0, 'Creative Work - Textual');
        // create authors first
        createAuthors('Test Author');
        // Check if the basic blank statement has been created for them.
        // switch to NTRO
        loadNtroTabAdminAdd();
        // Assert a blank statement has been created
        cy.get('[data-testid="scalesignif-author-0"]')
            .should('be.visible')
            .should('contain', 'Test Author');

        createAuthors('Another Author');
        loadNtroTabAdminAdd();
        cy.get('[data-testid="scalesignif-author-0"]')
            .should('be.visible')
            .should('contain', 'Test Author');
        cy.get('[data-testid="scalesignif-author-1"]')
            .should('be.visible')
            .should('contain', 'Another Author');
    });

    it('delete all added creative work scale of significance and creative statements', () => {
        cy.visit('/admin/add?user=uqstaff');

        createBasicRecordType(0, 'Creative Work - Textual');
        createAuthors('First Significance');
        createAuthors('Second Significance');
        loadNtroTabAdminAdd();

        // Update some statements
        cy.get('[data-testid="rek-significance-list-row-0-edit"]').click();
        cy.get('[data-testid="rek-significance-select"]').click();
        cy.get('[data-testid="rek-significance-option-1"]').click();
        cy.get('[data-testid="rek-creator-contribution-statement"] [role="textbox"]')
            .click()
            .type('MINOR STATEMENT');
        cy.get('[data-testid="rek-significance-add"]').click();
        cy.get('[data-testid="rek-significance-list-row-1-edit"]').click();
        cy.get('[data-testid="rek-significance-select"]').click();
        cy.get('[data-testid="rek-significance-option-2"]').click();
        cy.get('[data-testid="rek-creator-contribution-statement"] [role="textbox"]')
            .click()
            .type('MAJOR STATEMENT');
        cy.get('[data-testid="rek-significance-add"]').click();

        cy.get('[data-testid="scalesignif-author-0"]')
            .should('be.visible')
            .should('contain', 'First Significance');
        cy.get('[data-testid="scale-item-0"]').should('contain', 'Minor');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'MINOR STATEMENT');
        cy.get('[data-testid="scalesignif-author-1"]')
            .should('be.visible')
            .should('contain', 'Second Significance');
        cy.get('[data-testid="scale-item-1"]').should('contain', 'Major');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'MAJOR STATEMENT');
        cy.get('[data-testid="delete-all-rek-significance"]').click();
        cy.waitUntil(() => cy.get('[data-testid="confirm-rek-significance-delete-all"]').should('exist'));
        cy.get('[data-testid="confirm-rek-significance-delete-all"]')
            .should('contain', 'Yes')
            .click();

        cy.get('[data-testid="scale-item-0"]').should('contain', 'Missing');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'Missing');
        cy.get('[data-testid="scale-item-1"]').should('contain', 'Missing');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'Missing');
    });

    it('not see Author affiliations for creative work type', () => {
        cy.visit('/admin/add?user=uqstaff');

        // Choose a collection
        cy.get('[data-testid=rek-ismemberof-input]').type('a');
        cy.clickAutoSuggestion('rek-ismemberof', 0);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Creative Work')
            .click();

        // Choose sub type
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .contains('li', 'Creative Work - Textual')
            .click();

        // Apply selections
        cy.get('button')
            .contains('Create work')
            .should('exist')
            .click();

        cy.assertAffiliationsAllowed({
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 0,
        });
    });

    it.only('Adds, edits and removes statements based on author add, edit or removal', () => {
        cy.visit('/admin/add?user=uqstaff');

        createBasicRecordType(0, 'Creative Work - Textual');
        createAuthors('First Significance');
        createAuthors('Second Significance');
        loadNtroTabAdminAdd();
        cy.get('[data-testid="scalesignif-author-0"]').should('contain', 'First Significance');
        cy.get('[data-testid="scalesignif-author-1"]').should('contain', 'Second Significance');
        // Change the significance content
        cy.get('[data-testid="rek-significance-list-row-0-edit"]').click();
        cy.get('[data-testid="rek-significance-select"]').click();
        cy.get('[data-testid="rek-significance-option-1"]').click();
        cy.get('[data-testid="rek-creator-contribution-statement"] [role="textbox"]')
            .click()
            .type('MINOR STATEMENT');
        cy.get('[data-testid="rek-significance-add"]').click();
        cy.get('[data-testid="rek-significance-list-row-1-edit"]').click();
        cy.get('[data-testid="rek-significance-select"]').click();
        cy.get('[data-testid="rek-significance-option-2"]').click();
        cy.get('[data-testid="rek-creator-contribution-statement"] [role="textbox"]')
            .click()
            .type('MAJOR STATEMENT');
        cy.get('[data-testid="rek-significance-add"]').click();
        // Check the values
        cy.get('[data-testid="scalesignif-author-0"]').should('contain', 'First Significance');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'MINOR STATEMENT');
        cy.get('[data-testid="scalesignif-author-1"]').should('contain', 'Second Significance');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'MAJOR STATEMENT');
        // Flip the values
        cy.get('[data-testid="rek-significance-list-row-0-move-down"]').click();
        // Check the values
        cy.get('[data-testid="scalesignif-author-0"]').should('contain', 'First Significance');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'MAJOR STATEMENT');
        cy.get('[data-testid="scalesignif-author-1"]').should('contain', 'Second Significance');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'MINOR STATEMENT');
        // Now flip the authors
        cy.get('[data-testid="authors-tab"]').click();
        cy.get('[data-testid="rek-author-list-row-0-move-down"]').click();
        loadNtroTabAdminAdd();
        // Authors and statements flipped
        cy.get('[data-testid="scalesignif-author-1"]').should('contain', 'First Significance');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'MAJOR STATEMENT');
        cy.get('[data-testid="scalesignif-author-0"]').should('contain', 'Second Significance');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'MINOR STATEMENT');
        // Add an author - should auto generate a missing statement.
        cy.get('[data-testid="authors-tab"]').click();
        createAuthors('BLANK Significance');
        loadNtroTabAdminAdd();
        // Should have a new blank significance
        cy.get('[data-testid="scalesignif-author-2"]').should('contain', 'BLANK Significance');
        cy.get('[data-testid="statement-item-2"]').should('contain', 'Missing');
        // Move that author into the middle
        cy.get('[data-testid="authors-tab"]').click();
        cy.get('[data-testid="rek-author-list-row-1-move-down"]').click();
        loadNtroTabAdminAdd();
        // Blank should be in the middle.
        cy.get('[data-testid="scalesignif-author-0"]').should('contain', 'Second Significance');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'MINOR STATEMENT');
        cy.get('[data-testid="scalesignif-author-1"]').should('contain', 'BLANK Significance');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'Missing');
        cy.get('[data-testid="scalesignif-author-2"]').should('contain', 'First Significance');
        cy.get('[data-testid="statement-item-2"]').should('contain', 'MAJOR STATEMENT');
        // Delete the top Author, so it's just Missing, and Major
        cy.get('[data-testid="authors-tab"]').click();
        cy.wait(200);
        cy.get('[data-testid="rek-author-list-row-0-delete"]').click();
        cy.get('[data-testid="rek-author-delete-save"]').click();
        loadNtroTabAdminAdd();
        cy.get('[data-testid="scalesignif-author-0"]').should('contain', 'BLANK Significance');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'Missing');
        cy.get('[data-testid="scalesignif-author-1"]').should('contain', 'First Significance');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'MAJOR STATEMENT');
        // wipe out the current MAJOR statement, setting to missing (via form)
        cy.get('[data-testid="rek-significance-list-row-1-edit"]').click();
        // cycle input for empty
        cy.get('[data-testid="empty-significance-statement-input"]').click();
        cy.get('[data-testid="empty-significance-statement-input"]').click();
        cy.get('[data-testid="empty-significance-statement-input"]').click();
        // save
        cy.get('[data-testid="rek-significance-add"]').click();
        cy.get('[data-testid="statement-item-0"]').should('contain', 'Missing');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'Missing');
        // and edit the author name
        cy.get('[data-testid="authors-tab"]').click();
        cy.get('[data-testid="rek-author-list-row-0-edit"]').click();
        cy.get('[data-testid="rek-author-input"]').type('UPDATED');
        cy.get('[data-testid="rek-author-update-save"]').click();
        loadNtroTabAdminAdd();
        cy.get('[data-testid="scalesignif-author-0"]').should('contain', 'UPDATED');
        // Delete all authors, should delete all statements
        cy.get('[data-testid="authors-tab"]').click();
        cy.get('[data-testid="rek-author-list-row-0-delete"]').click();
        cy.get('[data-testid="rek-author-delete-save"]').click();
        cy.get('[data-testid="rek-author-list-row-0-delete"]').click();
        cy.get('[data-testid="rek-author-delete-save"]').click();
        loadNtroTabAdminAdd();
        cy.get('[data-testid="rek-significance-list"]').should('contain', 'No records to display');
    });
});
