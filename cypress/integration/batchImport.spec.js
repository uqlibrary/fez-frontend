import componentsLocale from '../../src/locale/components';
import validationErrorsLocale from '../../src/locale/validationErrors';

context('Batch import', () => {
    // const baseUrl = Cypress.config('baseUrl');
    const locale = componentsLocale.components.digiTeam.batchImport;
    const validationErrors = validationErrorsLocale.validationErrorsSummary;
    const initialFieldIDs = ['#communityPID', '#doctypePID', '#directory'];
    const allFieldIDs = [...initialFieldIDs, '#collectionPID'];

    beforeEach(() => {
        cy.visit('/batch-import?user=digiteamMember');
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load. Without it, the click below doesn't trigger the menu.
    });

    afterEach(() => {
        cy.navToHomeFromMenu();
    });

    it('should have expected elements', () => {
        cy.get('h2')
            .should('have.length', 1)
            .should('contain', locale.title);

        cy.get('.content-container form > div > div:nth-of-type(1)')
            .find('[class*=MuiFormControl-root]')
            .as('formElements')
            .should('have.length', 3)
            .find('label')
            .should('contain', locale.formLabels.community.label)
            .should('contain', locale.formLabels.docType.label)
            .should('contain', locale.formLabels.directory.label);

        cy.get('@formElements')
            .within(() => {
                initialFieldIDs.forEach(fieldID => {
                    cy.get(`[role="button"]${fieldID}`)
                        .should('exist');
                });
            });

        cy.get('.content-container form > div > div:nth-of-type(2)')
            .find('.Alert')
            .contains('.alert-text', 'Validation')
            .should('contain', validationErrors.communityID)
            .should('contain', validationErrors.doc_type_id)
            .should('contain', validationErrors.directory);

        cy.get('.content-container form > div > div > button')
            .should('contain', locale.formLabels.cancelButtonLabel)
            .contains(locale.formLabels.submitButtonLabel)
            .parent()
            .should('be.disabled');
    });

    it('should show collections filtered by selected community', () => {
        cy.get('#communityPID')
            .click();
        cy.get('#menu-')
            .find('li[role=option]')
            .should('have.length', 4)
            .first()
            .click();

        cy.get('.content-container form > div > div:nth-of-type(1)')
            .find('[role="button"]#collectionPID')
            .should('exist');
        cy.get('.content-container form > div > div:nth-of-type(2)')
            .find('.Alert')
            .should('not.contain', validationErrors.communityID)
            .should('contain', validationErrors.collection_pid);
    });

    it('should have enabled form submit button once all fields have been filled', () => {
        allFieldIDs.forEach(item => {
            cy.get('.content-container form .Alert .alert-text li')
                .should('exist');
            cy.get(item)
                .click();
            cy.get('#menu- li[role=option]:first-of-type')
                .click();
        });
        cy.get('.content-container form .Alert')
            .should('not.exist');
        cy.get('#submitBatchImport')
            .should('not.be.disabled');
    });

    it('should be able to reset the form on successful form submission', () => {
        allFieldIDs.forEach(item => {
            cy.get(item)
                .click();
            cy.get('#menu- li[role=option]:first-of-type')
                .click();
        });
        cy.get('#submitBatchImport')
            .click();
        cy.get('.content-container form > div > div:nth-of-type(2)')
            .find('.Alert')
            .as('alertBox')
            .should('contain', locale.submitProgressAlert.title)
            .should('contain', locale.submitProgressAlert.message);
        cy.wait(500); // Wait for submission
        cy.get('@alertBox')
            .should('contain', locale.submitSuccessAlert.title)
            .should('contain', locale.submitSuccessAlert.message)
            .contains('button', locale.postSubmitPrompt.confirmButtonLabel)
            .click();

        cy.get('@alertBox')
            .contains('.alert-text', 'Validation')
            .should('contain', validationErrors.communityID)
            .should('contain', validationErrors.doc_type_id)
            .should('contain', validationErrors.directory)
            .find('li')
            .should('have.length', 3);

        cy.get('#submitBatchImport')
            .should('be.disabled');
    });
});
