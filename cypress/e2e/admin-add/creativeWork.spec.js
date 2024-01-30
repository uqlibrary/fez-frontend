context('As an admin, I can', () => {
    // load the admin add page for a Creative Work with the indicated collection and subType and open the NTRO tab
    function loadNtroTabAdminAdd(collectionRowId, subtypeName) {
        cy.waitUntil(() =>
            cy
                .get('[data-testid=rek-ismemberof-input]')
                .should('exist')
                .should('be.visible'),
        );
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
        // NTRO now in Authors tab - change to Authors:
        cy.get('[data-testid="authors-tab"]').click();
    }

    function assertFormIsHidden() {
        cy.get('[data-testid="rek-significance-form"]')
            .should('exist')
            .should('not.be.visible');
    }

    function saveFormChanges(buttonLabelFragment) {
        cy.waitUntil(() => cy.get('button[data-testid="rek-significance-add"]').should('exist'));
        cy.get('button[data-testid="rek-significance-add"]')
            .should('be.visible')
            .should('contain', buttonLabelFragment)
            .click();
        assertFormIsHidden();
    }

    function assertCreateAuthor(nameAsPublished, identifier = null) {
        cy.get('[data-testid="rek-author-add"]').click();
        cy.get('[data-testid="rek-author-input"]').type(nameAsPublished);
        cy.get('[data-testid="rek-author-add-save"]').click();
    }
    function assertUpdateAuthor(index, nameAsPublished, identifier = null) {
        cy.get(`[data-testid="rek-author-list-row-${index}-edit"]`).click();
        cy.get('[data-testid="rek-author-input"]')
            .clear()
            .type(nameAsPublished);
        cy.get('[data-testid="rek-author-update-save"]').click();
    }

    function assertCanSetScaleStatement(index, typeIndex, statement) {
        cy.get(`[data-testid="rek-significance-list-row-${index}-edit"]`).click();
        cy.get('[data-testid="rek-significance-select"]').click();
        cy.get(`[data-testid="rek-significance-option-${typeIndex}"]`).click();
        cy.typeCKEditor('rek-creator-contribution-statement', statement);
        cy.get('[data-testid="rek-significance-add"]').click();
    }

    function assertCanClearScaleStatement(index) {
        cy.get(`[data-testid="rek-significance-list-row-${index}-delete"]`).click();
        cy.get(`[data-testid="confirm-rek-significance-list-row-${index}-delete"]`).click();
    }

    function assertHasAuthor(index, value) {
        cy.get(`[data-testid='rek-author-list-row-${index}-name-as-published']`).should('contain', value);
    }

    function assertCanEnterScaleStatementListItem(scaleName, statement, expectedRowId) {
        const numberOfRecords = expectedRowId + 1;
        const ordinalLabelList = ['First', 'Second', 'Third', 'Fourth'];
        const authorTextOrdinal = ordinalLabelList[expectedRowId];
        // cy.get('[data-testid=ntro-section-content]')
        //     .as('NTRO')
        //     .within(() => {
        //         cy.get('.AdminCard')
        //             .eq(0)
        //             .within(() => {
        //                 // cy.get('[data-testid="rek-significance-showhidebutton"]')
        //                 //     .should('exist')
        //                 //     .click();
        //                 // cy.get('button[data-testid="rek-significance-add"]')
        //                 //     .should('exist')
        //                 //     .should('contain', 'ADD');
        //                 // cy.get('[data-testid="rek-significance-select"]').should('contain', '');
        //                 // cy.assertCKEditorEmpty('rek-creator-contribution-statement');
        //             });
        //     });

        // // popup appears at foot of markup, outside Admin section
        // cy.assertChangeSelectFromTo('rek-significance', '', scaleName); // was unselected

        // cy.get('[data-testid=ntro-section-content]')
        //     .as('NTRO')
        //     .within(() => {
        //         cy.get('.AdminCard')
        //             .eq(0)
        //             .within(() => {
        //                 cy.typeCKEditor('rek-creator-contribution-statement', statement);

        //                 saveFormChanges('ADD');

        //                 // the newly added item appears correctly
        //                 cy.get('[data-testid="rek-significance-list"]')
        //                     .children()
        //                     .should('have.length', numberOfRecords);
        //                 cy.get(`[data-testid="scalesignif-author-${expectedRowId}"]`).should(
        //                     'contain',
        //                     authorTextOrdinal,
        //                 );
        //                 cy.get(`[data-testid="scale-item-${expectedRowId}"]`).should('contain', scaleName);
        //                 cy.get(`[data-testid="statement-item-${expectedRowId}"]`).should('contain', statement);

        //                 // the show hide status is correct
        //                 cy.waitUntil(() => cy.get('[data-testid="rek-significance-showhidebutton"]').should('exist'));
        //                 assertFormIsHidden();
        //             });
        //     });
    }

    function clickRowEditButton(rowId) {
        cy.get(`[data-testid="rek-significance-list-row-${rowId}-edit"]`)
            .should('exist')
            .click();
    }

    it.only('add a creative work', () => {
        cy.visit('/admin/add?user=uqstaff');

        loadNtroTabAdminAdd(0, 'Creative Work - Textual');

        // const newContributionStatementText = 'another entry';
        // const secondRowId = 1;
        // const originalScale = 'Major';

        assertCreateAuthor('Test Author');
        assertCreateAuthor('Second Author');
        const statement1 = 'Test Author Statement';
        const statement2 = 'Second Author Statement';
        assertCanSetScaleStatement(0, 1, 'Test Author Statement');
        assertCanSetScaleStatement(1, 2, 'Second Author Statement');
        assertHasAuthor(0, 'Test Author');
        assertHasAuthor(1, 'Second Author');
        cy.get('[data-testid="statement-item-0"]').should('contain', statement1);
        cy.get('[data-testid="statement-item-1"]').should('contain', statement2);
        // Change the author order
        cy.get('[data-testid="rek-author-list-row-0-move-down"]').click();
        assertHasAuthor(0, 'Second Author');
        assertHasAuthor(1, 'Test Author');
        cy.get('[data-testid="statement-item-0"]').should('contain', statement2);
        cy.get('[data-testid="statement-item-1"]').should('contain', statement1);
        // Clear one of the statements
        assertCanClearScaleStatement(0);
        cy.get('[data-testid="statement-item-0"]').should('contain', 'Missing');
        // Change the name of one of the authors
        assertUpdateAuthor(0, 'Updated Author');
        assertHasAuthor(0, 'Updated Author');
        // Delete the first author.
        cy.get('[data-testid="rek-author-list-row-0-delete"]').click();
        cy.wait(500);
        cy.get('[data-testid="rek-author-delete-save"]').click();
        assertHasAuthor(0, 'Test Author');
        // Clear the statement via edit
        cy.get('[data-testid="rek-significance-list-row-0-edit"]').click();
        // set true
        cy.get('[data-testid="empty-significance-statement-input"]').click();
        // set false (to toggle)
        cy.get('[data-testid="empty-significance-statement-input"]').click();
        // set true (to check toggle)
        cy.get('[data-testid="empty-significance-statement-input"]').click();
        cy.get('[data-testid="rek-significance-add"]').click();
        cy.get('[data-testid="statement-item-0"]').should('contain', 'Missing');

        // assertCanEnterScaleStatementListItem('Minor', 'new entry', 0);
        // assertCanEnterScaleStatementListItem(originalScale, newContributionStatementText, secondRowId);
        // assertCanEnterScaleStatementListItem('Major', 'entry with duplicate scale', 2);

        // // when trying to edit an added entry, the form loads properly
        // assertFormIsHidden();
        // clickRowEditButton(secondRowId);
        // cy.get('[data-testid="rek-significance-form"]')
        //     .should('be.visible')
        //     .scrollIntoView();
        // cy.get('[data-testid="rek-significance-select"]')
        //     .should('exist')
        //     .should('contain', originalScale);
        // cy.readCKEditor('rek-creator-contribution-statement').then(text => {
        //     expect(text).to.contain(newContributionStatementText);
        // });
        // // change values of fields and save
        // const addTextToContributionStatement = ' 123';
        // cy.typeCKEditor('rek-creator-contribution-statement', addTextToContributionStatement);
        // const newScale = 'Minor';
        // cy.assertChangeSelectFromTo('rek-significance', originalScale, newScale);
        // saveFormChanges('UPDATE');
        // // data has updated in list editor
        // cy.get(`[data-testid="scalesignif-author-${secondRowId}"]`).should('contain', 'Second');
        // cy.get(`[data-testid="scale-item-${secondRowId}"]`).should('contain', newScale);
        // cy.get(`[data-testid="statement-item-${secondRowId}"]`).should(
        //     'contain',
        //     `${newContributionStatementText}${addTextToContributionStatement}`,
        // );
        // // editing an entry does not create a new entry
        // cy.get('[data-testid="rek-significance-list"]')
        //     .should('exist')
        //     .children()
        //     .should('have.length', 3);
    });

    it('delete all added creative work scale of significance and creative statements', () => {
        cy.visit('/admin/add?user=uqstaff');

        loadNtroTabAdminAdd(0, 'Creative Work - Textual');

        assertCanEnterScaleStatementListItem('Minor', 'new entry', 0);
        assertCanEnterScaleStatementListItem('Major', 'another entry', 1);

        cy.get('[data-testid="delete-all-rek-significance"]').click();
        cy.waitUntil(() => cy.get('[data-testid="confirm-rek-significance-delete-all"]').should('exist'));
        cy.get('[data-testid="confirm-rek-significance-delete-all"]')
            .should('contain', 'Yes')
            .click();

        cy.waitUntil(() => cy.get('[data-testid="rek-significance-list"]').should('exist'));
        cy.get('[data-testid="rek-significance-list"]').should('contain', 'No records to display');
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
});