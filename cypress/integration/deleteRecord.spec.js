import formsLocale from '../../src/locale/forms';
import { myRecordsList, publicationTypeListThesis } from '../../src/mock/data/records';
const record = myRecordsList.data[0];
const uqDoiRecord = publicationTypeListThesis.data[0];

context('Delete work form', () => {
    const baseUrl = Cypress.config('baseUrl');
    const deleteFormLocale = formsLocale.forms.deleteRecordForm;

    it('should render as expected', () => {
        cy.visit(`/admin/delete/${record.rek_pid}/?user=uqstaff`);
        cy.contains('h2', 'Delete work');
        cy.get('.StandardCard')
            .should('have.length', 2)
            // .contains('h3', fixPageLocale.subTitle);
            .contains('h3', 'Work to be deleted');
        cy.contains('.StandardCard .publicationCitation h6 a', myRecordsList.data[0].rek_title);
        cy.get('[data-testid=rek-content-indicator]').contains('Scholarship of Teaching and Learning');
        cy.contains('Describe the reason to delete this work');
        cy.contains('button', 'Cancel');
        cy.contains('button', 'Delete').should('not.be.disabled');
    });

    it('can submit the form', () => {
        cy.visit(`/admin/delete/${record.rek_pid}/?user=uqstaff`);
        cy.contains('h2', 'Delete work');
        cy.get('button#submit-delete-record')
            .should('not.be.disabled')
            .click();
        cy.get('[data-testid=alert] .alert-text')
            .should('contain', deleteFormLocale.progressAlert.title)
            .should('contain', deleteFormLocale.progressAlert.message);
        cy.get('[data-testid=alert] .alert-text')
            .should('contain', deleteFormLocale.successAlert.title)
            .should('contain', deleteFormLocale.successAlert.message);
        cy.contains('h2', deleteFormLocale.successWorkflowConfirmation.confirmationTitle).should('have.length', 1);
        cy.contains('button', deleteFormLocale.successWorkflowConfirmation.confirmButtonLabel).click();
        cy.url().should('equal', `${baseUrl}/view/${record.rek_pid}`);
    });

    it('can enter reason and submit the form', () => {
        cy.visit(`/admin/delete/${record.rek_pid}/?user=uqstaff`);
        cy.get('[data-testid=reason-input]').type('reason');
        cy.get('button#submit-delete-record')
            .should('not.be.disabled')
            .click();
        cy.get('[data-testid=alert] .alert-text')
            .should('contain', deleteFormLocale.progressAlert.title)
            .should('contain', deleteFormLocale.progressAlert.message);
        cy.get('[data-testid=alert] .alert-text')
            .should('contain', deleteFormLocale.successAlert.title)
            .should('contain', deleteFormLocale.successAlert.message);
        cy.contains('h2', deleteFormLocale.successWorkflowConfirmation.confirmationTitle).should('have.length', 1);
        cy.contains('button', deleteFormLocale.successWorkflowConfirmation.cancelButtonLabel).click();
        cy.url().should('equal', `${baseUrl}/records/search`);
    });

    it('should show nav dialog when exit the form with reason entered', () => {
        cy.visit(`/admin/delete/${record.rek_pid}/?user=uqstaff`);
        cy.get('[data-testid=reason-input]').type('reason');
        cy.navToHomeFromMenu(deleteFormLocale.cancelWorkflowConfirmation);
    });
});
