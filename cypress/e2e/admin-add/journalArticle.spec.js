context('As an admin,', () => {
    it('I can add a journal article', () => {
        cy.visit('/admin/add?user=uqstaff');

        // Choose a collection
        cy.get('[data-testid=rek-ismemberof-input]').type('a');
        cy.clickAutoSuggestion('rek-ismemberof', 0);

        // Choose display type
        cy.get('[data-testid=rek-display-type-select]').click();
        cy.get('[data-testid=rek-display-type-options]')
            .contains('li', 'Journal Article')
            .click();

        // Choose sub type
        cy.get('[data-testid=rek-subtype-select]').click();
        cy.get('[data-testid=rek-subtype-options]')
            .contains('li', 'Article (original research)')
            .click();

        // Apply selections
        cy.get('button')
            .contains('Create work')
            .should('exist')
            .click();

        // Confirm that alert badges are present when in tabbed mode
        cy.adminEditTabbedView();
        cy.adminEditCheckTabErrorBadge('bibliographic', 3);
        cy.adminEditCheckTabErrorBadge('files');
        cy.adminEditTabbedView(false);

        // Fill required fields
        cy.typeCKEditor('rek-title', 'Test title');
        cy.get('[data-testid=rek-date-year-input]').type('2020');
        cy.get('[data-testid=rek-author-add]').click();
        cy.get('[data-testid=rek-author-input]').type('Test author');
        cy.get('[data-testid=rek-author-add-save]').click();
        cy.get('[data-testid=rek-copyright-input]').click();

        // Lookup journal
        cy.get('[data-testid=fez-matched-journals-input]').type('acta');
        cy.clickAutoSuggestion('fez-matched-journals', 0);

        // Submit form
        cy.get('#admin-work-submit')
            .should('contain', 'Save')
            .click();

        // Confirmation message
        cy.get('[role=dialog]')
            .should('exist')
            .find('h2')
            .should('contain', 'Work has been added');
    });

    describe('Author Affiliations', () => {
        beforeEach(() => {
            cy.visit('/admin/add?user=uqstaff');

            // Choose a collection
            cy.get('[data-testid=rek-ismemberof-input]').type('a');
            cy.clickAutoSuggestion('rek-ismemberof', 0);

            // Choose display type
            cy.get('[data-testid=rek-display-type-select]').click();
            cy.get('[data-testid=rek-display-type-options]')
                .contains('li', 'Journal Article')
                .click();

            // Choose sub type
            cy.get('[data-testid=rek-subtype-select]').click();
            cy.get('[data-testid=rek-subtype-options]')
                .contains('li', 'Article (original research)')
                .click();

            // Apply selections
            cy.get('button')
                .contains('Create work')
                .should('exist')
                .click();

            // Confirm that alert badges are present when in tabbed mode
            cy.adminEditTabbedView();
            cy.adminEditCheckTabErrorBadge('bibliographic', 3);
            cy.adminEditCheckTabErrorBadge('authors');
            cy.adminEditCheckTabErrorBadge('files');
            cy.adminEditTabbedView(false);

            // Fill required fields
            cy.typeCKEditor('rek-title', 'Test title with affiliations');
            cy.get('[data-testid=rek-date-year-input]').type('2020');
        });

        afterEach(() => {
            cy.get('[data-testid=rek-copyright-input]').click();

            // Lookup journal
            cy.get('[data-testid=fez-matched-journals-input]').type('acta');
            cy.clickAutoSuggestion('fez-matched-journals', 0);

            // Submit form
            cy.get('#admin-work-submit')
                .should('contain', 'Save')
                .click();

            // Confirmation message
            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', 'Work has been added');
        });

        it('is only used for linked authors', () => {
            cy.get('[data-testid=rek-author-add]').click();
            cy.get('[data-testid=rek-author-input]').type('User, Test');
            cy.get('[data-testid=rek-author-add-save]').click();
            cy.get('[data-testid^="contributor-errorIcon-"]').should('not.exist');
        });

        it('can be added and edited', () => {
            //
            //
            //
            // Add author with UQ ID and single affiliation
            //
            //
            //
            cy.addAuthorAndAssert('Steve Su (uqysu4)', 85004);
            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');
            cy.editAffiliationAndAssert(877, 973, 'Academic Administration', '100%');

            cy.get('[data-testid=affiliationSaveBtn]').should('not.be.disabled');

            cy.get('[data-testid=deleteOrgBtn-973]')
                .should('exist')
                .click();

            cy.get('[data-testid=affiliationSaveBtn]').should('be.disabled');
            cy.get('[data-testid=orgSelect-877-input]').should('not.exist');
            cy.get('[data-testid=orgChip-877]').should('not.exist');
            cy.get('[data-testid=orgSelect-973-input]').should('not.exist');
            cy.get('[data-testid=orgChip-973]').should('not.exist');

            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-85004]').contains('[data-testid=orgChip-877]', '100%');
            cy.get('[data-testid=detailPanel-85004]').contains('Aboriginal and Torres Strait Islander Studies Unit');

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            cy.get('[data-testid=expandPanelIcon-85004]')
                .should('exist')
                .click();

            //
            //
            //
            // Add author with UQ ID and multiple affiliations
            //
            //
            //
            cy.addAuthorAndAssert("O'Donoghue, Steven (uqsodono)", 75121);
            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');

            cy.get('[data-testid=affiliationSaveBtn]').should('not.be.disabled');

            // add suggested org (coverage)
            cy.addAffiliationAndAssert(
                'Suggested: Information Systems and Resource Services (University of Queensland Library)',
                1248,
                '50%',
                true,
            );

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('50%');

            cy.addAffiliationAndAssert('Academic Administration Directorate', 1113, '33.333%');

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('33.334%');
            cy.get('[data-testid=orgChip-1248]')
                .should('exist')
                .contains('33.333%');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-75121]').contains('[data-testid=orgChip-877]', '33.334%');
            cy.get('[data-testid=detailPanel-75121]').contains('Aboriginal and Torres Strait Islander Studies Unit');
            cy.get('[data-testid=detailPanel-75121]').contains('[data-testid=orgChip-1248]', '33.333%');
            cy.get('[data-testid=detailPanel-75121]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );
            cy.get('[data-testid=detailPanel-75121]').contains('[data-testid=orgChip-1113]', '33.333%');
            cy.get('[data-testid=detailPanel-75121]').contains('Academic Administration Directorate');

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            cy.get('[data-testid=expandPanelIcon-75121]')
                .should('exist')
                .click();

            //
            //
            //
            // Add author with non-HERDC affiliation
            //
            //
            //
            cy.addAuthorAndAssert('Kisely, Steve (uqskisely)', 78152);
            cy.addAffiliationAndAssert('Aboriginal and Torres Strait Islander Studies Unit', 877, '100%');

            cy.get('[data-testid=affiliationSaveBtn]').should('not.be.disabled');

            cy.addAffiliationAndAssert('Academic Administration', 973, '50%');

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('50%');

            cy.addAffiliationAndAssert('Academic Administration Directorate', 1113, '33.333%');

            cy.get('[data-testid=orgChip-877]')
                .should('exist')
                .contains('33.334%');
            cy.get('[data-testid=orgChip-973]')
                .should('exist')
                .contains('33.333%');

            // now test resetting to non-herdc, which should clear the above
            cy.addAffiliationAndAssert('!NON-HERDC', 1062, '100%');
            cy.get('[data-testid=orgChip-877]').should('not.exist');
            cy.get('[data-testid=orgChip-973]').should('not.exist');
            cy.get('[data-testid=orgChip-1113]').should('not.exist');
            // auto adds suggestion
            cy.get('[data-testid=orgChip-1248]')
                .should('exist')
                .contains('0%');
            cy.get('[data-testid=orgSelect-1248-input]')
                .should('exist')
                .should('have.value', 'Information Systems and Resource Services (University of Queensland Library)');
            // hides the add autocomplete element
            cy.get('[data-testid=orgSelect-add-input]').should('not.exist');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1062]', '100%');
            cy.get('[data-testid=detailPanel-78152]').contains('!NON-HERDC');
            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1248]', '0%');
            cy.get('[data-testid=detailPanel-78152]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            // Now edit non-herdc to remove that option
            cy.get('[data-testid=affiliationEditBtn-78152]')
                .should('exist')
                .click();

            cy.get('[data-testid=orgSelect-1062-input]')
                .should('exist')
                .should('have.value', '!NON-HERDC');
            cy.get('[data-testid=orgChip-1062')
                .should('exist')
                .contains('100%');
            cy.get('[data-testid=orgSelect-1248-input]')
                .should('exist')
                .should('have.value', 'Information Systems and Resource Services (University of Queensland Library)');
            cy.get('[data-testid=orgChip-1248')
                .should('exist')
                .contains('0%');

            cy.get('[data-testid=deleteOrgBtn-1062]')
                .should('exist')
                .click();
            cy.get('[data-testid=orgSelect-1062-input]').should('not.exist');
            cy.get('[data-testid=orgChip-1062').should('not.exist');
            cy.get('[data-testid=orgChip-1248')
                .should('exist')
                .contains('100%');
            // shows the add autocomplete element
            cy.get('[data-testid=orgSelect-add-input]').should('exist');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();
            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1248]', '100%');
            cy.get('[data-testid=detailPanel-78152]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );

            //
            // coverage - change the above org back to non-herdc
            //

            // currentOrgId, nextOrgId, nextOrgName, expectedPercent) =
            cy.get('[data-testid^=affiliationEditBtn-]')
                .should('exist')
                .click();

            cy.editAffiliationAndAssert(1248, 1062, '!NON-HERDC', '100%');
            // double check the suggested org has been re-added
            cy.get('[data-testid=orgSelect-1248-input]')
                .should('exist')
                .should('have.value', 'Information Systems and Resource Services (University of Queensland Library)');
            cy.get('[data-testid=orgChip-1248')
                .should('exist')
                .contains('0%');

            // hides the add autocomplete element
            cy.get('[data-testid=orgSelect-add-input]').should('not.exist');

            cy.get('[data-testid=affiliationSaveBtn]')
                .should('not.be.disabled')
                .click();

            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1062]', '100%');
            cy.get('[data-testid=detailPanel-78152]').contains('!NON-HERDC');
            cy.get('[data-testid=detailPanel-78152]').contains('[data-testid=orgChip-1248]', '0%');
            cy.get('[data-testid=detailPanel-78152]').contains(
                'Information Systems and Resource Services (University of Queensland Library)',
            );

            cy.get('[data-testid=affiliationCancelBtn]').should('not.exist');
            cy.get('[data-testid=affiliationSaveBtn]').should('not.exist');
            cy.get('[data-testid=orgChip-error]').should('not.exist');

            cy.get('[data-testid=expandPanelIcon-78152]')
                .should('exist')
                .click();
        });
    });

    describe('Changing the display type', () => {
        it('does not force a subtype error', () => {
            cy.visit('/admin/add?user=uqstaff');

            // Choose a collection
            cy.get('[data-testid=rek-ismemberof-input]').type('a');
            cy.clickAutoSuggestion('rek-ismemberof', 0);

            // Choose display type
            cy.get('[data-testid=rek-display-type-select]').click();
            cy.get('[data-testid=rek-display-type-options]')
                .contains('li', 'Journal Article')
                .click();

            // Change display type
            cy.get('[data-testid=rek-display-type-select]').click();
            cy.get('[data-testid=rek-display-type-options]')
                .contains('li', 'Working Paper')
                .click();

            // Apply selections
            cy.get('button')
                .contains('Create work')
                .should('exist')
                .click();

            cy.data('alert-message').within(() => {
                cy.get('li').should('not.contain', 'Work subtype is required');
            });
        });
    });
});
