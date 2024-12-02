import formsLocale from '../../src/locale/forms';
import { myRecordsList } from '../../src/mock/data/records';
const record = myRecordsList.data[0];

context('Request correction form', () => {
    const baseUrl = Cypress.config('baseUrl');
    const fixFormLocale = formsLocale.forms.fixPublicationForm;
    const unfixFormLocale = formsLocale.forms.unclaimPublicationForm;

    beforeEach(() => {
        cy.visit(`/records/${record.rek_pid}/fix`);
    });

    afterEach(() => {
        cy.navToHomeFromMenu(fixFormLocale.cancelWorkflowConfirmation);
    });

    it('should render as expected', () => {
        // This causes flake since the mock returns data too quickly.
        // Need to mock network layer in Cypress to resolve.
        // cy.contains('Loading work');

        // cy.contains('h2', fixPageLocale.title);
        cy.contains('h2', 'Request a correction, add more information or upload files');
        cy.get('.StandardCard')
            .should('have.length', 1)
            // .contains('h3', fixPageLocale.subTitle);
            .contains('h3', 'Work to be amended');
        cy.contains('.StandardCard .publicationCitation h6 a', record.rek_title);
        cy.get('[data-testid=rek-content-indicator]').contains('Scholarship of Teaching and Learning');
        cy.contains('Select an action');
        cy.contains('[data-testid=alert]', 'Validation');
        cy.contains('button', 'Cancel');
    });

    it('should show expected fields on confirming authorship', () => {
        cy.get('[data-testid=fix-action-select]').click();
        cy.get('[data-testid=fix-action-options]')
            .contains('I am the author')
            .click();
        cy.get('.StandardCard h3')
            .should('have.length', 4)
            .should('contain', fixFormLocale.contentIndicators.title)
            .should('contain', fixFormLocale.comments.title)
            .should('contain', fixFormLocale.fileUpload.title);
        cy.contains('button', 'Submit').should('be.disabled');
    });

    it('should show expected message on denying authorship', () => {
        cy.get('[data-testid=fix-action-select]').click();
        cy.get('[data-testid=fix-action-options]')
            .contains('I am not the author')
            .click();
        cy.get('.StandardCard h3')
            .should('have.length', 2)
            .contains(unfixFormLocale.title)
            .closest('.StandardCard')
            .should('contain', unfixFormLocale.alert.title)
            .should('contain', unfixFormLocale.alert.message);
        cy.contains('button', 'Submit').should('not.be.disabled');
    });

    it('allows selection of unselected content indicators, but does not allow deselection of existing', () => {
        cy.get('[data-testid=fix-action-select]').click();
        cy.get('[data-testid=fix-action-options]')
            .contains('I am the author')
            .click();
        cy.contains(fixFormLocale.contentIndicators.title).scrollIntoView();
        cy.get('[data-testid=rek-content-indicator-select]').click();
        // Click new item in multiselect modal
        cy.get('[data-testid=rek-content-indicator-options]')
            .contains('Protocol')
            .click();
        // Click outside the multiselect
        cy.get('[data-testid=rek-content-indicator-options]').click(10, 10);
        cy.get('[data-testid=rek-content-indicator-select]')
            .contains('Scholarship of Teaching and Learning, Protocol')
            .click();
        // Preselected item in multiselect modal should be unclickable
        cy.get('[data-testid=rek-content-indicator-options]')
            .contains('Scholarship of Teaching and Learning')
            .should('have.css', 'pointer-events', 'none');
        // Click outside the multiselect
        cy.get('[data-testid=rek-content-indicator-options]').click(10, 10);
        // Selection has not changed
        cy.get('[data-testid=rek-content-indicator-select]').contains('Scholarship of Teaching and Learning, Protocol');
    });

    it('will detect and prevent submission of invalid URLs', () => {
        cy.get('[data-testid=fix-action-select]').click();
        cy.get('[data-testid=fix-action-options]')
            .contains('I am the author')
            .click();
        // Enter invalid data triggers validation errors
        cy.contains('.StandardCard', fixFormLocale.comments.title)
            .find('input')
            .type('invalid')
            .closest('.StandardCard')
            .contains('URL is not valid');
        // Confirm form submission is disabled until URL is fixed
        cy.contains('button', 'Submit').should('be.disabled');
        cy.contains('.StandardCard', fixFormLocale.comments.title)
            .find('input')
            .type('.com');
        cy.contains('button', 'Submit').should('be.disabled');
        cy.contains('.StandardCard', fixFormLocale.comments.title)
            .find('input')
            .type('{home}{del}{del}https://');
        cy.contains('button', 'Submit').should('not.be.disabled');
    });

    it('Can choose a content indicator, then submit the form', () => {
        cy.get('[data-testid=fix-action-select]').click();
        cy.get('[data-testid=fix-action-options]')
            .contains('I am the author')
            .click();
        cy.get('[data-testid=rek-content-indicator-select]').click();
        // Click new item in multiselect modal
        cy.get('[data-testid=rek-content-indicator-options]')
            .contains('Protocol')
            .click();
        cy.get('[data-testid=rek-content-indicator-options]').click(10, 10);
        cy.contains('button', 'Submit')
            .should('not.be.disabled')
            .click();
        cy.get('[data-testid=alert] .alert-text')
            .should('contain', fixFormLocale.progressAlert.title)
            .should('contain', fixFormLocale.progressAlert.message);
        cy.get('[data-testid=alert] .alert-text')
            .should('contain', fixFormLocale.successAlert.title)
            .should('contain', fixFormLocale.successAlert.message);
        cy.contains('h2', fixFormLocale.successWorkflowConfirmation.confirmationTitle).should('have.length', 1);
        cy.contains('button', fixFormLocale.successWorkflowConfirmation.cancelButtonLabel).click();
        cy.url().should('equal', `${baseUrl}/dashboard`);
    });
});
