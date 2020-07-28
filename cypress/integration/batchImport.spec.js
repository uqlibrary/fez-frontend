import componentsLocale from '../../src/locale/components';
import validationErrorsLocale from '../../src/locale/validationErrors';

context('Batch import', () => {
    const locale = componentsLocale.components.digiTeam.batchImport;
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

        const selectFirstItem = (field, validationMessage) => {
            cy.get(`[data-testid=${field}-select]`).click();
            cy.waitUntil(() => cy.get(`[data-testid=${field}-options]`).should('exist'));
            cy.get(`[data-testid=${field}-option-0]`).click();

            cy.get('[data-testid=batch-import-validation]').should('not.contain', validationMessage);
        };

        cy.visit('/batch-import?user=digiteamMember').then(() => {
            // Check for expected elements
            cy.get('h2')
                .should('have.length', 1)
                .should('contain', locale.title);

            initialFieldIDs.forEach(fieldID => {
                cy.get(`[data-testid=${fieldID}-select]`).should('exist');
            });

            cy.get('[data-testid=community-pid-label]').should('contain', locale.formLabels.community.label);
            cy.get('[data-testid=doc-type-id-label]').should('contain', locale.formLabels.docType.label);
            cy.get('[data-testid=directory-label]').should('contain', locale.formLabels.directory.label);

            confirmInitialValidations();

            cy.get('[data-testid=batch-import-cancel]').should('contain', locale.formLabels.cancelButtonLabel);

            cy.get('[data-testid=batch-import-submit]')
                .should('contain', locale.formLabels.submitButtonLabel)
                .should('be.disabled');

            // Select community
            selectFirstItem('community-pid', validationErrors.communityID);

            // Make sure collection dropdown appears
            cy.waitUntil(() => Cypress.$('[data-testid=collection-pid-select]').length === 1);
            cy.get('[data-testid=collection-pid-label]').should('contain', locale.formLabels.collection.label);
            cy.get('[data-testid=batch-import-validation]').should('contain', validationErrors.collection_pid);

            // Select collection
            selectFirstItem('collection-pid', validationErrors.collection_pid);

            // Select doctype
            selectFirstItem('doc-type-id', validationErrors.doc_type_id);

            // Select directory
            selectFirstItem('directory', validationErrors.directory);

            cy.get('[data-testid=batch-import-validation]').should('not.exist');
            cy.get('[data-testid=batch-import-submit]').should('not.be.disabled');

            cy.get('[data-testid=batch-import-submit]')
                .should('have.text', locale.formLabels.submitButtonLabel)
                .click();

            // form submitted and the green 'all good' message appears, with 'start another' button
            cy.get('[data-testid=batch-import-validation]')
                .should('contain', locale.submitSuccessAlert.title)
                .should('contain', locale.submitSuccessAlert.message)
                .contains('button', locale.postSubmitPrompt.confirmButtonLabel)
                .click();

            // form is ready to go again and the validation errors re-appear
            confirmInitialValidations();
            cy.get('[data-testid=batch-import-submit]').should('be.disabled');
        });
    });
});
