import componentsLocale from '../../src/locale/components';
import validationErrorsLocale from '../../src/locale/validationErrors';

context('Batch import', () => {
    // const baseUrl = Cypress.config('baseUrl');
    const locale = componentsLocale.components.digiTeam.batchImport;
    const validationErrors = validationErrorsLocale.validationErrorsSummary;

    beforeEach(() => {
        cy.visit('/batch-import?user=digiteamMember');
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load. Without it, the click below doesn't trigger the menu.
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
            .find('[role="button"]#communityPID')
            .should('exist');
        cy.get('@formElements')
            .find('[role="button"]#doctypePID')
            .should('exist');
        cy.get('@formElements')
            .find('[role="button"]#directory')
            .should('exist');

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
        cy.get('#communityPID').click();
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

    it('can submit form once all fields have been filled', () => {
        const fields = ['#communityPID', '#collectionPID', '#doctypePID', '#directory'];
        fields.forEach(item => {
            cy.get('.content-container form .Alert .alert-text li').should('exist');
            cy.get(item).click();
            cy.get('#menu- li[role=option]:first-of-type').click();
        });
        cy.get('.content-container form .Alert').should('not.exist');
        cy.get('.content-container form > div > div > button')
            .contains(locale.formLabels.submitButtonLabel)
            .parent()
            .should('not.be.disabled');
    });
});
