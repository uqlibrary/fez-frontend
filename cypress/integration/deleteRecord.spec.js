import formsLocale from '../../src/locale/forms';
// import { default as pagesLocale } from '../../src/locale/pages';
import { myRecordsList } from '../../src/mock/data/records';

context('Delete record form', () => {
    const baseUrl = Cypress.config('baseUrl');
    const deleteFormLocale = formsLocale.forms.deleteRecordForm;
    // const deletePageLocale = pagesLocale.pages.deleteRecord;

    it('should render as expected', () => {
        cy.visit('/admin/delete/UQ:67abc8/');
        // This causes flake since the mock returns data too quickly.
        // Need to mock network layer in Cypress to resolve.
        // cy.contains('Loading work');

        cy.contains('h2', 'Delete record');
        cy.get('.StandardCard')
            .should('have.length', 2)
            // .contains('h3', fixPageLocale.subTitle);
            .contains('h3', 'Work to be deleted');
        cy.contains('.StandardCard .publicationCitation h6 a', myRecordsList.data[0].rek_title);
        cy.get('[class*="PublicationCitation-divider"] + div')
            .contains('Scholarship of Teaching and Learning');
        cy.contains('Describe the reason to delete this record');
        cy.contains('button', 'Cancel');
        cy.contains('button', 'Delete')
            .should('not.be.disabled');
    });

    it('can submit the form', () => {
        cy.visit('/admin/delete/UQ:67abc8/');
        cy.contains('h2', 'Delete record');
        cy.contains('button', 'Delete')
            .should('not.be.disabled')
            .click();
        cy.get('[class*="Alert-info"] .alert-text')
            .should('contain', deleteFormLocale.progressAlert.title)
            .should('contain', deleteFormLocale.progressAlert.message);
        cy.get('[class*="Alert-done"] .alert-text')
            .should('contain', deleteFormLocale.successAlert.title)
            .should('contain', deleteFormLocale.successAlert.message);
        cy.contains('h6', deleteFormLocale.successWorkflowConfirmation.confirmationTitle)
            .should('have.length', 1);
        cy.contains('button', deleteFormLocale.successWorkflowConfirmation.confirmButtonLabel)
            .click();
        cy.url()
            .should('equal', `${baseUrl}/view/UQ:67abc8`);
    });

    it('can enter reason and submit the form', () => {
        cy.visit('/admin/delete/UQ:67abc8/');
        cy.get('#Pleaseenterareasonwhyyouaredeletingthisrecord')
            .type('reason');
        cy.contains('button', 'Delete')
            .should('not.be.disabled')
            .click();
        cy.get('[class*="Alert-info"] .alert-text')
            .should('contain', deleteFormLocale.progressAlert.title)
            .should('contain', deleteFormLocale.progressAlert.message);
        cy.get('[class*="Alert-done"] .alert-text')
            .should('contain', deleteFormLocale.successAlert.title)
            .should('contain', deleteFormLocale.successAlert.message);
        cy.contains('h6', deleteFormLocale.successWorkflowConfirmation.confirmationTitle)
            .should('have.length', 1);
        cy.contains('button', deleteFormLocale.successWorkflowConfirmation.cancelButtonLabel)
            .click();
        cy.url()
            .should('equal', `${baseUrl}/records/search`);
    });

    it('should show nav dialog when exit the form with reason entered', () => {
        cy.visit('/admin/delete/UQ:67abc8/');
        cy.get('#Pleaseenterareasonwhyyouaredeletingthisrecord')
            .type('reason');
        cy.navToHomeFromMenu(deleteFormLocale.cancelWorkflowConfirmation);
    });

    it('should show UQ DOI alert and disable the delete button', () => {
        cy.visit('/admin/delete/UQ:327650/');
        cy.get('[class*="Alert-error"] .alert-text')
            .should('contain', deleteFormLocale.uqDoiAlert.message('UQ:327650'));
        cy.contains('button', 'Delete')
            .should('be.disabled');
    });
});
