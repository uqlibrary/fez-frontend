context('As an admin,', () => {
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

        cy.adminEditTabbedView();

        // Assign an author before trying to assign NTRO content.
        cy.get('[data-testid="authors-tab"]').click();
        cy.get('[data-testid="rek-author-add"]').click();
        cy.get('[data-testid="rek-author-input"]').type('Test Author');
        cy.get('[data-testid="rek-author-add-save"]').click();
        // Now we can drill into the NTRO tab
        cy.get('[data-testid="ntro-tab"]').click();

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
                        cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                            expect(text).to.be.empty;
                        });
                    });
            });

        // popup appears at foot of page, outside Admin section
        cy.assertChangeSelectFromTo('rek-significance', '', 'Minor'); // was unselected

        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        const newContributionStatementText = 'new entry';
                        cy.typeCKEditor('rek-creator-contribution-statement', newContributionStatementText);

                        const button = 'button[data-testid="rek-significance-add"]';
                        cy.waitUntil(() => cy.get(button).should('exist'));
                        cy.get(button)
                            .should('contain', 'ADD')
                            .click();

                        // the newly added item appears correctly
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', 1);
                        cy.get('[data-testid="rek-significance-list-row-0"]')
                            .find('p')
                            .eq(0)
                            .should('contain', 'First');
                        cy.get('[data-testid="rek-significance-list-row-0"]')
                            .find('p')
                            .eq(1)
                            .should('have.text', 'Minor');
                        cy.get('[data-testid="rek-significance-list-row-0"]')
                            .find('span')
                            .eq(0)
                            .should('contain', newContributionStatementText);
                        // the show hide status is correct
                        cy.waitUntil(() => cy.get('[data-testid="rek-significance-showhidebutton"]').should('exist'));
                        cy.get('[data-testid="rek-significance-form"]').should('not.exist');
                    });
            });
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
