import formsLocale from '../../src/locale/forms';
// import { default as pagesLocale } from '../../src/locale/pages';
import { myRecordsList } from '../../src/mock/data/records';

context('Request correction form', () => {
    const baseUrl = Cypress.config('baseUrl');
    const fixFormLocale = formsLocale.forms.fixPublicationForm;
    const unfixFormLocale = formsLocale.forms.unclaimPublicationForm;
    // const fixPageLocale = pagesLocale.pages.fixRecord;

    beforeEach(() => {
        cy.visit('/records/UQ:67abc8/fix');
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
        cy.contains('.StandardCard .publicationCitation h6 a', myRecordsList.data[0].rek_title);
        cy.get('[class*="PublicationCitation-divider"] + div')
            .contains('Scholarship of Teaching and Learning');
        cy.contains('Select an action');
        cy.contains('.Alert', 'Validation');
        cy.contains('button', 'Cancel');
    });

    it('should show expected fields on confirming authorship', () => {
        cy.get('#fixAction')
            .click();
        cy.get('#menu-fixAction')
            .contains('I am the author')
            .click();
        cy.get('.StandardCard h3')
            .should('have.length', 4)
            .should('contain', fixFormLocale.contentIndicators.title)
            .should('contain', fixFormLocale.comments.title)
            .should('contain', fixFormLocale.fileUpload.title);
        cy.contains('button', 'Submit')
            .should('be.disabled');
    });

    it('should show expected message on denying authorship', () => {
        cy.get('#fixAction')
            .click();
        cy.get('#menu-fixAction')
            .contains('I am not the author')
            .click();
        cy.get('.StandardCard h3')
            .should('have.length', 2)
            .contains(unfixFormLocale.title)
            .closest('.StandardCard')
            .should('contain', unfixFormLocale.alert.title)
            .should('contain', unfixFormLocale.alert.message)
            .contains('button', 'Submit')
            .should('not.be.disabled');
    });

    it('allows selection of unselected content indicators, but does not allow deselection of existing', () => {
        cy.get('#fixAction')
            .click();
        cy.get('#menu-fixAction')
            .contains('I am the author')
            .click();
        cy.contains(fixFormLocale.contentIndicators.title)
            .scrollIntoView();
        cy.get('#content-indicators')
            .click();
        // Click new item in multiselect modal
        cy.get('#menu-')
            .contains('Protocol')
            .click();
        // Click outside the multiselect
        cy.get('#menu-')
            .click(10, 10);
        cy.get('#content-indicators')
            .contains('Scholarship of Teaching and Learning, Protocol')
            .click();
        // Preselected item in multiselect modal should be unclickable
        cy.get('#menu-')
            .contains('Scholarship of Teaching and Learning')
            .should('have.css', 'pointer-events', 'none');
        // Click outside the multiselect
        cy.get('#menu-')
            .click(10, 10);
        // Selection has not changed
        cy.get('#content-indicators')
            .contains('Scholarship of Teaching and Learning, Protocol');
    });

    it('will detect and prevent submission of invalid URLs', () => {
        cy.get('#fixAction')
            .click();
        cy.get('#menu-fixAction')
            .contains('I am the author')
            .click();
        // Enter invalid data triggers validation errors
        cy.contains('.StandardCard', fixFormLocale.comments.title)
            .find('input')
            .type('invalid')
            .closest('.StandardCard')
            .contains('URL is not valid');
        // Confirm form submission is disabled until URL is fixed
        cy.contains('button', 'Submit')
            .should('be.disabled');
        cy.contains('.StandardCard', fixFormLocale.comments.title)
            .find('input')
            .type('.com');
        cy.contains('button', 'Submit')
            .should('be.disabled');
        cy.contains('.StandardCard', fixFormLocale.comments.title)
            .find('input')
            .type('{home}{del}{del}https://');
        cy.contains('button', 'Submit')
            .should('not.be.disabled');
    });

    it('Can choose a content indicator, then submit the form', () => {
        cy.get('#fixAction')
            .click();
        cy.get('#menu-fixAction')
            .contains('I am the author')
            .click();
        cy.get('#content-indicators')
            .click();
        // Click new item in multiselect modal
        cy.get('#menu-')
            .contains('Protocol')
            .click();
        cy.get('#menu-')
            .click(10, 10);
        cy.contains('button', 'Submit')
            .should('not.be.disabled')
            .click();
        cy.get('[class*="Alert-info"] .alert-text')
            .should('contain', fixFormLocale.progressAlert.title)
            .should('contain', fixFormLocale.progressAlert.message);
        cy.get('[class*="Alert-done"] .alert-text')
            .should('contain', fixFormLocale.successAlert.title)
            .should('contain', fixFormLocale.successAlert.message);
        cy.contains('h6', fixFormLocale.successWorkflowConfirmation.confirmationTitle)
            .should('have.length', 1);
        cy.contains('button', fixFormLocale.successWorkflowConfirmation.cancelButtonLabel)
            .click();
        cy.url()
            .should('equal', `${baseUrl}/dashboard`);
    });
});
