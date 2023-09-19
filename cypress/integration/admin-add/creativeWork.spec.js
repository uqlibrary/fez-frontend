context('As an admin,', () => {
    function assertCanEnterScaleStatementListItem(
        selectSignificanceValue,
        newContributionStatementText,
        authorTextOrdinal,
        rowId,
        numberOfRecords,
    ) {
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

        // popup appears at foot of page, outside Admin section
        cy.assertChangeSelectFromTo('rek-significance', '', selectSignificanceValue); // was unselected

        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.typeCKEditor('rek-creator-contribution-statement', newContributionStatementText);

                        const button = 'button[data-testid="rek-significance-add"]';
                        cy.waitUntil(() => cy.get(button).should('exist'));
                        cy.get(button)
                            .should('contain', 'ADD')
                            .click();

                        // the newly added item appears correctly
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', numberOfRecords);
                        cy.get(`[data-testid="scalesignif-author-${rowId}"]`).should('contain', authorTextOrdinal);
                        cy.get(`[data-testid="scale-item-${rowId}"]`).should('contain', selectSignificanceValue);
                        cy.get(`[data-testid="statement-item-${rowId}"]`).should(
                            'contain',
                            newContributionStatementText,
                        );

                        // the show hide status is correct
                        cy.waitUntil(() => cy.get('[data-testid="rek-significance-showhidebutton"]').should('exist'));
                        cy.get('[data-testid="rek-significance-form"]')
                            .should('exist')
                            .should('not.be.visible');
                    });
            });
    }

    it('I can add a creative work', () => {
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

        const newContributionStatementText = 'another entry';
        const secondRowId = '1';
        const originalScale = 'Major';

        cy.adminEditTabbedView();
        cy.get('[data-testid="ntro-tab"]').click();
        assertCanEnterScaleStatementListItem('Minor', 'new entry', 'First', '0', 1);
        assertCanEnterScaleStatementListItem(originalScale, newContributionStatementText, 'Second', secondRowId, 2);
        assertCanEnterScaleStatementListItem('Major', 'entry with duplicate scale', 'Third', '2', 3);

        // can edit an added entry
        cy.get(`[data-testid="rek-significance-list-row-${secondRowId}-edit"]`)
            .should('exist')
            .click();
        cy.get('[data-testid="rek-significance-select"]')
            .should('exist')
            .should('contain', originalScale);
        cy.readCKEditor('rek-creator-contribution-statement').should(text => {
            expect(text).to.contain(newContributionStatementText);
        });
        const addTextToContributionStatement = ' 123';
        cy.typeCKEditor('rek-creator-contribution-statement', addTextToContributionStatement);
        const newScale = 'Minor';
        cy.assertChangeSelectFromTo('rek-significance', originalScale, newScale);
        const addButton = 'button[data-testid="rek-significance-add"]';
        cy.waitUntil(() => cy.get(addButton).should('exist'));
        cy.get(addButton)
            .should('contain', 'UPDATE')
            .click();
        // data has updated in list editor
        cy.get(`[data-testid="scalesignif-author-${secondRowId}"]`).should('contain', 'Second');
        cy.get(`[data-testid="scale-item-${secondRowId}"]`).should('contain', newScale);
        cy.get(`[data-testid="statement-item-${secondRowId}"]`).should(
            'contain',
            `${newContributionStatementText}${addTextToContributionStatement}`,
        );
        // editing an entry does not create a new entry
        cy.get('[data-testid="rek-significance-list"]')
            .should('exist')
            .children()
            .should('have.length', 3);
    });
    describe('Author affiliations', () => {
        it('should not be available for this work type', () => {
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
});
