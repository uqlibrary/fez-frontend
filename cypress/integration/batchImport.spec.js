import componentsLocale from '../../src/locale/components';
import validationErrorsLocale from '../../src/locale/validationErrors';

context('Batch import', () => {
    // const baseUrl = Cypress.config('baseUrl');
    const locale = componentsLocale.components.digiTeam.batchImport;
    const validationErrors = validationErrorsLocale.validationErrorsSummary;
    const initialFieldIDs = ['community-pid', 'doc-type-id', 'directory'];
    const allFieldIDs = [...initialFieldIDs, 'collection-pid'];

    beforeEach(() => {
        cy.visit('/batch-import?user=digiteamMember');
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

        cy.get('@formElements').within(() => {
            initialFieldIDs.forEach(fieldID => {
                cy.get(`[data-testid=${fieldID}-select]`).should('exist');
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
        cy.navToHomeFromMenu();
    });

    it('should show collections filtered by selected community', () => {
        cy.waitUntil(() =>
            cy.get('[data-testid=community-pid-select]').then($el => $el.attr('class').indexOf('-disabled') === -1),
        );
        cy.get('[data-testid=community-pid-select]').click();
        cy.get('[data-testid=community-pid-options]')
            .first()
            .click();

        cy.get('[data-testid=collection-pid-select]').should('exist');
        cy.get('.content-container form > div > div:nth-of-type(2)')
            .find('.Alert')
            .should('not.contain', validationErrors.communityID)
            .should('contain', validationErrors.collection_pid);
        cy.navToHomeFromMenu();
    });

    it('should have enabled form submit button once all fields have been filled', () => {
        allFieldIDs.forEach(item => {
            cy.get('.content-container form .Alert .alert-text li').should('exist');

            cy.waitUntil(() =>
                cy.get(`[data-testid=${item}-select]`).then($el => $el.attr('class').indexOf('-disabled') === -1),
            );
            cy.get(`[data-testid=${item}-select]`).click();
            cy.get(`[data-testid=${item}-options]`)
                .should('exist')
                .click();
        });
        cy.get('.content-container form .Alert').should('not.exist');
        cy.get('#submitBatchImport').should('not.be.disabled');
        cy.navToHomeFromMenu();
    });

    it('should be able to reset the form on successful form submission', () => {
        // select the first entry from each of the 4 drop downs
        allFieldIDs.forEach(item => {
            cy.waitUntil(() =>
                cy.get(`[data-testid=${item}-select]`).then($el => $el.attr('class').indexOf('-disabled') === -1),
            );
            cy.get(`[data-testid=${item}-select]`).click();
            cy.get(`[data-testid=${item}-options]`)
                .should('exist')
                .click();
        });
        // click submit button
        cy.get('#submitBatchImport')
            .should('have.text', locale.formLabels.submitButtonLabel)
            .click();
        // form submitted and the green 'all good' message appears, with 'start another' button
        cy.get('.content-container form > div > div:nth-of-type(2) .Alert')
            .should('contain', locale.submitSuccessAlert.title)
            .should('contain', locale.submitSuccessAlert.message)
            .contains('button', locale.postSubmitPrompt.confirmButtonLabel)
            .click();

        // form is ready to go again and the validation errors re-appear
        cy.get('.content-container form > div > div:nth-of-type(2) .Alert')
            .contains('.alert-text', 'Validation')
            .should('contain', validationErrors.communityID)
            .should('contain', validationErrors.doc_type_id)
            .should('contain', validationErrors.directory)
            .find('li')
            .should('have.length', 3);
        cy.get('#submitBatchImport').should('be.disabled');
        cy.navToHomeFromMenu();
    });
});
