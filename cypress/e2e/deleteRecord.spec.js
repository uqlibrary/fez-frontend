import formsLocale from '../../src/locale/forms';
import {
    myRecordsList,
    publicationTypeListThesis,
    recordWithRDM,
    collectionRecord,
    recordThatFailsDeletion,
} from '../../src/mock/data/records';
const record = myRecordsList.data[0];
const recordWithCrossrefDoi = publicationTypeListThesis.data[0];
const recordWithDataCiteDoi = recordWithRDM;

const selectors = {
    reasonInput: '[data-testid=reason-input]',
    submitButton: '[data-testid=submit-delete-record]',
    cancelButton: '[data-testid=cancel-delete-record]',
};

const loadPage = record => {
    cy.visit(`/admin/delete/${record.rek_pid}?user=uqstaff`);
};

const submit = () => {
    const deleteFormLocale = formsLocale.forms.deleteRecordForm;
    cy.assertEnabled(selectors.submitButton).click();
    cy.get('[data-testid=alert] .alert-text')
        .should('contain', deleteFormLocale.progressAlert.title)
        .should('contain', deleteFormLocale.progressAlert.message);
    cy.get('[data-testid=alert] .alert-text')
        .should('contain', deleteFormLocale.successAlert.title)
        .should('contain', deleteFormLocale.successAlert.message);
    cy.contains('h2', deleteFormLocale.successWorkflowConfirmation.confirmationTitle).should('have.length', 1);
    cy.contains('button', deleteFormLocale.successWorkflowConfirmation.confirmButtonLabel).click();
};

const assertPageChangeOnSuccessfulFormSubmission = record => {
    const baseUrl = Cypress.config('baseUrl');
    cy.url().should('equal', `${baseUrl}/view/${record.rek_pid}`);
};

const triggerReasonFieldValidationError = () => {
    cy.fillInput(selectors.reasonInput, 'a', 256);
    cy.get('p', { timeout: 1000 }).should('contain', 'Must be 255 characters or less');
};

context('Delete work form', () => {
    const deleteFormLocale = formsLocale.forms.deleteRecordForm;

    it('should render as expected', () => {
        loadPage(record);
        cy.contains('h2', 'Delete work');
        cy.get('.StandardCard')
            .should('have.length', 2)
            // .contains('h3', fixPageLocale.subTitle);
            .contains('h3', 'Work to be deleted');
        cy.contains('.StandardCard .publicationCitation h6 a', myRecordsList.data[0].rek_title);
        cy.get('[data-testid=rek-content-indicator]').contains('Scholarship of Teaching and Learning');
        cy.contains('Describe the reason to delete this work');
        cy.contains('button', 'Cancel').should('not.be.disabled');
        cy.contains('button', 'Delete').should('not.be.disabled');
    });

    context('form submission', () => {
        it('can submit the form for a record without DOI', () => {
            loadPage(record);
            submit();
            assertPageChangeOnSuccessfulFormSubmission(record);
        });
        assertPageChangeOnSuccessfulFormSubmission;
        it('can enter reason and submit the form for a record without DOI', () => {
            loadPage(record);
            cy.get(selectors.reasonInput).type('reason');
            submit();
            assertPageChangeOnSuccessfulFormSubmission(record);
        });

        it('can enter reason, new doi resolution URL and submit form for a record with Crossref DOI', () => {
            loadPage(recordWithCrossrefDoi);
            cy.get(selectors.reasonInput).type('reason');
            cy.get('[data-testid=rek-doi-resolution-url-input]').type('https://web.library.uq.edu.au/test');
            submit();
            assertPageChangeOnSuccessfulFormSubmission(recordWithCrossrefDoi);
        });

        it('can enter reason, new doi resolution URL and submit form for a record with Crossref DOI', () => {
            loadPage(recordWithDataCiteDoi);
            cy.get(selectors.reasonInput).type('reason');
            cy.get('[data-testid=rek-new-doi-input]').type('10.1234/uql5678');
            cy.typeCKEditor('rek-deletion-notes', 'deletion notes');
            submit();
            assertPageChangeOnSuccessfulFormSubmission(recordWithDataCiteDoi);
        });
    });

    context('validation', () => {
        context('form', () => {
            it('should validate reason field for a record without DOI', () => {
                loadPage(record);
                cy.assertTriggersDisabled(selectors.submitButton, () => {
                    triggerReasonFieldValidationError();
                });
            });

            it('should validate fields for a record with Crossref DOI', () => {
                loadPage(recordWithCrossrefDoi);
                cy.assertTriggersDisabled(selectors.submitButton, () => {
                    triggerReasonFieldValidationError();
                    cy.fillInput('[data-testid=rek-doi-resolution-url-input]', 'bad.url');
                    cy.get('p').should('contain', 'URL is not valid');
                });
            });

            it('can enter reason, new doi resolution URL and submit form for a record with Crossref DOI', () => {
                loadPage(recordWithDataCiteDoi);
                cy.assertTriggersDisabled(selectors.submitButton, () => {
                    triggerReasonFieldValidationError();
                    cy.fillInput('[data-testid=rek-new-doi-input]', '10.123.bad-doi');
                    cy.get('p').should('contain', 'DOI is not valid');
                    cy.typeCKEditor('rek-deletion-notes', 'a'.repeat(2001));
                    cy.get('span').should('contain', 'Must be 2000 characters or less');
                });
            });
        });

        context('server', () => {
            it('should display "not found" message on 404', () => {
                loadPage({ rek_pid: 'UQ:abc123' });
                cy.get('[data-testid=page-title]').contains('Work not found');
            });

            it('should display error message on server error', () => {
                loadPage(recordThatFailsDeletion);
                cy.assertEnabled(selectors.submitButton).click();
                cy.get('[data-testid=ErrorOutlineIcon]').should('be.visible');
                cy.assertEnabled(selectors.submitButton);
                cy.assertEnabled(selectors.cancelButton);
            });

            it('should display error when trying to delete collection record with children', () => {
                loadPage(collectionRecord);
                cy.assertEnabled(selectors.submitButton).click();
                cy.get('[data-testid=ErrorOutlineIcon]').should('be.visible');
                cy.assertEnabled(selectors.submitButton);
                cy.assertEnabled(selectors.cancelButton);
            });
        });
    });

    context('navigation', () => {
        it('should navigate to view record on cancel', () => {
            loadPage(record);
            cy.assertEnabled(selectors.cancelButton).click();
            assertPageChangeOnSuccessfulFormSubmission(record);
        });

        it('should show nav dialog when exit the form with reason entered', () => {
            loadPage(record);
            cy.get(selectors.reasonInput).type('reason');
            cy.navToHomeFromMenu(deleteFormLocale.cancelWorkflowConfirmation);
        });
    });
});
assertPageChangeOnSuccessfulFormSubmission;
