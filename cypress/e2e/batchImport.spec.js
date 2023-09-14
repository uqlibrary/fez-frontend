import validationErrorsLocale from '../../src/locale/validationErrors';

context('Batch import', () => {
    const validationErrors = validationErrorsLocale.validationErrorsSummary;
    const initialFieldIDs = ['community-pid', 'doc-type-id', 'directory'];

    after(() => {
        cy.navToHomeFromMenu();
    });

    it('should work as expected', () => {
        const confirmInitialValidations = () => {
            cy.get('[data-testid=batch-import-validation]')
                .contains('.alert-text', 'Validation')
                .within(() => {
                    cy.get('[data-testid=validation-warning-0]').should('contain', validationErrors.communityID);
                    cy.get('[data-testid=validation-warning-1]').should('contain', validationErrors.doc_type_id);
                    cy.get('[data-testid=validation-warning-2]').should('contain', validationErrors.directory);
                });

            cy.get('[data-testid=batch-import-validation]')
                .find('[data-testid*=validation-warning-]')
                .should('have.length', 3);
        };

        const selectItem = (field, option, validationMessage) => {
            cy.get(`[data-testid=${field}-select]`).click();
            cy.waitUntil(() => cy.get(`[data-testid=${field}-options]`).should('exist'));
            cy.get(`[data-testid=${field}-option-${option}]`).click();

            if (validationMessage) {
                cy.get('[data-testid=batch-import-validation]').should('not.contain', validationMessage);
            }
        };

        cy.visit('/batch-import?user=digiteamMember').then(() => {
            // Check for expected elements
            cy.get('h2')
                .should('have.length', 1)
                .should('contain', 'CSV ingest');

            initialFieldIDs.forEach(fieldID => {
                cy.get(`[data-testid=${fieldID}-select]`).should('exist');
            });

            cy.get('[data-testid=community-pid-label]').should('contain', 'Select a community');
            cy.get('[data-testid=doc-type-id-label]').should('contain', 'Select a document type');
            cy.get('[data-testid=directory-label]').should(
                'contain',
                'Select folder where CSV and datastream files are located',
            );

            confirmInitialValidations();

            cy.get('[data-testid=batch-import-cancel]').should('contain', 'Cancel and return to the homepage');

            cy.get('[data-testid=batch-import-submit]')
                .should('contain', 'Ingest now')
                .should('be.disabled');

            // Select community
            selectItem('community-pid', 1, validationErrors.communityID);

            // Make sure collection dropdown appears
            cy.waitUntil(() => Cypress.$('[data-testid=collection-pid-select]').length === 1);
            cy.get('[data-testid=collection-pid-label]').should('contain', 'Select a collection');
            cy.get('[data-testid=batch-import-validation]').should('contain', validationErrors.collection_pid);

            // Select collection
            selectItem('collection-pid', 1, validationErrors.collection_pid);

            // Select doctype
            selectItem('doc-type-id', 1, validationErrors.doc_type_id);

            // Select directory
            selectItem('directory', 1);

            cy.get('[data-testid=batch-import-validation]').should('not.exist');
            cy.get('[data-testid=batch-import-submit]').should('not.be.disabled');

            cy.get('[data-testid=batch-import-submit]')
                .should('have.text', 'Ingest now')
                .click();

            // form submitted and the green 'all good' message appears, with 'start another' button
            cy.get('[data-testid=alert-done-batch-import]')
                .should('contain', 'Success')
                .should('contain', 'The request to batch-import has been submitted successfully.')
                .contains('button', 'Start another ingest')
                .click();

            // form is ready to go again and the validation errors re-appear
            confirmInitialValidations();
            cy.get('[data-testid=batch-import-submit]').should('be.disabled');
        });
    });
});
