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

    function assertCanEnterScaleStatementListItem(scaleName, statement, expectedRowId) {
        const numberOfRecords = expectedRowId + 1;
        const ordinalLabelList = ['First', 'Second', 'Third', 'Fourth'];
        const authorTextOrdinal = ordinalLabelList[expectedRowId];
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('[data-testid="rek-significance-showhidebutton"]')
                            .should('exist')
                            .click();
                        cy.get('button[data-testid="rek-significance-add"]')
                            .should('exist')
                            .should('contain', 'ADD');
                        cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                        cy.assertCKEditorEmpty('rek-creator-contribution-statement');
                    });
            });

        // popup appears at foot of markup, outside Admin section
        cy.assertChangeSelectFromTo('rek-significance', '', scaleName); // was unselected

        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.typeCKEditor('rek-creator-contribution-statement', statement);

                        saveFormChanges('ADD');

                        // the newly added item appears correctly
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', numberOfRecords);
                        cy.get(`[data-testid="scalesignif-author-${expectedRowId}"]`).should(
                            'contain',
                            authorTextOrdinal,
                        );
                        cy.get(`[data-testid="scale-item-${expectedRowId}"]`).should('contain', scaleName);
                        cy.get(`[data-testid="statement-item-${expectedRowId}"]`).should('contain', statement);

                        // the show hide status is correct
                        cy.waitUntil(() => cy.get('[data-testid="rek-significance-showhidebutton"]').should('exist'));
                        assertFormIsHidden();
                    });
            });
    }

    function clickRowEditButton(rowId) {
        cy.get(`[data-testid="rek-significance-list-row-${rowId}-edit"]`)
            .should('exist')
            .click();
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
        // const newContributionStatementText = 'another entry';
        // const secondRowId = 1;
        // const originalScale = 'Major';

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
        // assertCanEnterScaleStatementListItem('Minor', 'new entry', 0);
        // assertCanEnterScaleStatementListItem('Major', 'another entry', 1);
        cy.get('[data-testid="delete-all-rek-significance"]').click();
        cy.waitUntil(() => cy.get('[data-testid="confirm-rek-significance-delete-all"]').should('exist'));
        cy.get('[data-testid="confirm-rek-significance-delete-all"]')
            .should('contain', 'Yes')
            .click();

        cy.get('[data-testid="scale-item-0"]').should('contain', 'Missing');
        cy.get('[data-testid="statement-item-0"]').should('contain', 'Missing');
        cy.get('[data-testid="scale-item-1"]').should('contain', 'Missing');
        cy.get('[data-testid="statement-item-1"]').should('contain', 'Missing');
        // cy.waitUntil(() => cy.get('[data-testid="rek-significance-list"]').should('exist'));
        // cy.get('[data-testid="rek-significance-list"]').should('contain', 'No records to display');
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
