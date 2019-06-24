import formsLocale from '../../src/locale/forms';
// import pagesLocale from '../../src/locale/pages';

context('Claim possible work', () => {
    const baseUrl = Cypress.config('baseUrl');
    const claimFormLocale = formsLocale.forms.claimPublicationForm;
    // const possibleClaimsLocale = pagesLocale.pages.claimPublications;

    beforeEach(() => {
        cy.visit('/records/possible');
        cy.get('#unsupportedBrowser.card button')
            .then(($button) => {
                // Button is only visible if browser is unsupported.
                if ($button.filter(':visible')) {
                    $button.click();
                }
            });
    });

    afterEach(() => {
        // Navigate away to trigger 'Are you sure' dialogue about unsaved changes
        cy.get('button[title="Main navigation"]')
            .click();
        cy.get('#mainMenu .menu-item-container')
            .contains('Home')
            .click();
        // Say yes to 'Are you sure' if it does trigger
        cy.url()
            .then(($url) => {
                if ($url !== `${baseUrl}/`) {
                    cy.contains(claimFormLocale.cancelWorkflowConfirmation.confirmationTitle)
                        .closest('[role="document"]')
                        .contains(claimFormLocale.cancelWorkflowConfirmation.confirmButtonLabel)
                        .click();
                }
            });
    });

    it('Renders a list of possible works with filters', () => {
        cy.get('h2')
            .should('have.length', 1)
            .should('contain', 'Claim possible works');
        cy.get('h2 + div')
            .should('have.length', 1)
            .should('contain', 'Searching for possibly your works');
        cy.get('.StandardCard h6[class*="PublicationCitation-citationTitle"] > a')
            .should('have.length', 8);
        cy.get('[class*="MuiGrid-grid-sm-3"] h6')
            .should('have.length', 1)
            .should('contain', 'Refine results');
        cy.get('[class*="MuiGrid-grid-sm-3"] .facetsFilter [class*="MuiListItem-root-"]')
            .should('have.length', 6);
    });

    it('Can navigate to a claim page with specific elements', () => {
        cy.get('.StandardCard button.publicationAction')
            .first()
            .click();
        cy.url()
            .should('equal', `${baseUrl}/records/claim`);
        cy.get('h2')
            .should('have.length', 1)
            .should('contain', claimFormLocale.title);
        cy.get('.StandardCard h3')
            .should('contain', claimFormLocale.claimingInformation.title)
            .should('contain', claimFormLocale.authorLinking.title)
            .should('contain', claimFormLocale.contributorLinking.title)
            .should('contain', claimFormLocale.contentIndicators.title)
            .should('contain', claimFormLocale.comments.title)
            .should('contain', claimFormLocale.fileUpload.title);
        cy.get('.Alert b')
            .scrollIntoView()
            .should('contain', claimFormLocale.validationAlert.title);
        cy.contains(claimFormLocale.cancel)
            .closest('button')
            .should('not.be.disabled');
        cy.contains(claimFormLocale.submit)
            .closest('button')
            .should('be.disabled');
    });

    it('Allows selection of unselected content indicators, but does not allow deselection of existing', () => {
        cy.get('.StandardCard button.publicationAction')
            .first()
            .click();
        cy.url()
            .should('equal', `${baseUrl}/records/claim`);
        cy.contains(claimFormLocale.contentIndicators.title)
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
        // Click preselected item in multiselect modal
        cy.get('#menu-')
            .contains('Scholarship of Teaching and Learning')
            .should('not.be.above'); // Item is marked as disabled
        // Click outside the multiselect
        cy.get('#menu-')
            .click(10, 10);
        // Selection has not changed
        cy.get('#content-indicators')
            .contains('Scholarship of Teaching and Learning, Protocol');
    });

    it('Can choose author, then submit the claim.', () => {
        cy.get('.StandardCard button.publicationAction')
            .first()
            .click();
        cy.url()
            .should('equal', `${baseUrl}/records/claim`);
        cy.contains(claimFormLocale.authorLinking.title)
            .closest('.StandardCard')
            .find('button')
            .first()
            .click();
        cy.contains('I confirm and understand')
            .click();
        cy.contains(claimFormLocale.submit)
            .closest('button')
            .should('not.be.disabled')
            .click();
        cy.get('[class*="Alert-info"] .alert-text')
            .should('contain', claimFormLocale.progressAlert.title)
            .should('contain', claimFormLocale.progressAlert.message);
        cy.get('[class*="Alert-done"] .alert-text')
            .should('contain', claimFormLocale.successAlert.title)
            .should('contain', claimFormLocale.successAlert.message);
        cy.get('h6')
            .contains(claimFormLocale.successWorkflowConfirmation.confirmationTitle)
            .should('have.length', 1);
        cy.get('button')
            .contains(claimFormLocale.successWorkflowConfirmation.cancelButtonLabel)
            .click();
        cy.url()
            .should('equal', `${baseUrl}/records/possible`);
    });

    it('Can choose editor, then submit the claim.', () => {
        cy.contains('Book with editors')
            .closest('.publicationCitation')
            .find('button.publicationAction')
            .first()
            .click();
        cy.url()
            .should('equal', `${baseUrl}/records/claim`);
        cy.contains(claimFormLocale.contributorLinking.title)
            .closest('.StandardCard')
            .find('button')
            .first()
            .click();
        cy.contains('I confirm and understand')
            .click();
        cy.contains(claimFormLocale.submit)
            .closest('button')
            .should('not.be.disabled')
            .click();
        cy.get('[class*="Alert-info"] .alert-text')
            .should('contain', claimFormLocale.progressAlert.title)
            .should('contain', claimFormLocale.progressAlert.message);
        cy.get('[class*="Alert-done"] .alert-text')
            .should('contain', claimFormLocale.successAlert.title)
            .should('contain', claimFormLocale.successAlert.message);
        cy.get('h6')
            .contains(claimFormLocale.successWorkflowConfirmation.confirmationTitle)
            .should('have.length', 1);
        cy.get('button')
            .contains(claimFormLocale.successWorkflowConfirmation.cancelButtonLabel)
            .click();
        cy.url()
            .should('equal', `${baseUrl}/records/possible`);
    });
});
