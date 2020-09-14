import componentsLocale from '../../src/locale/components';
import { default as recordListBook } from '../../src/mock/data/records/publicationTypeListBookEdited';
import { default as recordListImage } from '../../src/mock/data/records/publicationTypeListImage';

const recordBook = recordListBook.data[0];
const recordImage = recordListImage.data[0];

const changeDisplayTypeLocale = componentsLocale.components.changeDisplayType;

context('Change display type', () => {
    const selectItem = (field, firstChildlabel) => {
        cy.get(`[data-testid=${field}-select]`).should('exist');
        cy.get(`[data-testid=${field}-select]`).click();
        cy.waitUntil(() => cy.get(`[data-testid=${field}-options]`).should('exist'));
        cy.get(`[data-testid=${field}-options]`)
            .find('li[role=option]')
            .contains(firstChildlabel)
            .click();
    };

    it('should work as expected when changing to a record type with subtypes', () => {
        const pid = 'UQ:603315';
        cy.visit(`/admin/change-display-type/${pid}?user=uqstaff`).then(() => {
            cy.get('h2')
                .should('have.length', 1)
                .should('contain', changeDisplayTypeLocale.title)
                .should('contain', recordBook.rek_display_type_lookup)
                .should('contain', recordBook.rek_subtype);

            cy.get('.publicationCitation .citationTitle').should('contain', recordBook.rek_title);

            // select display type
            selectItem('rek-display-type', 'Conference Paper');

            // select Conference Paper, as it has subtypes, so the second dropdown will appear
            cy.get('[data-testid=changeDisplayType-submit]').should('be.disabled');

            // select subtype
            selectItem('rek-subtype', 'Fully published paper');
            cy.get('[data-testid=changeDisplayType-submit]').should('not.be.disabled');

            cy.get('[data-testid=changeDisplayType-submit]')
                .should('have.text', changeDisplayTypeLocale.submit)
                .click();

            // form submitted and the green 'all good' message appears, with 'view' and 'edit' buttons
            cy.get('[data-testid=changeDisplayType-submit-status]')
                .should('contain', changeDisplayTypeLocale.successAlert.title)
                .should('contain', changeDisplayTypeLocale.successAlert.message);

            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', changeDisplayTypeLocale.workflowConfirmation.confirmationTitle);

            cy.get('[data-testid=cancel-changeDisplayTypeDone]').contains(
                'button',
                changeDisplayTypeLocale.workflowConfirmation.cancelButtonLabel,
            );
            cy.get('[data-testid=confirm-changeDisplayTypeDone]')
                .contains('button', changeDisplayTypeLocale.workflowConfirmation.confirmButtonLabel)
                .click();
            cy.location().should(loc => {
                expect(loc.pathname).to.eq(`/admin/edit/${pid}`);
                // this loads a 404 page because the '?user=uqstaff' isnt in the url, but the url is fine
            });
        });
    });

    it('should work as expected when changing to a record type withOUT subtypes', () => {
        const pid = 'UQ:134700';
        cy.visit(`/admin/change-display-type/${pid}?user=uqstaff`).then(() => {
            cy.get('h2')
                .should('have.length', 1)
                .should('contain', changeDisplayTypeLocale.title)
                .should('contain', recordImage.rek_display_type_lookup);

            cy.get('.publicationCitation .citationTitle').should('contain', recordImage.rek_title);

            // select display type
            selectItem('rek-display-type', 'Image');

            // The Image type does not have subtypes, so the second dropdown will not appear
            // and the submit button is enabled immediately
            cy.get('[data-testid=changeDisplayType-submit]').should('not.be.disabled');

            cy.get('[data-testid=changeDisplayType-submit]')
                .should('have.text', changeDisplayTypeLocale.submit)
                .click();

            // form submitted and the green 'all good' message appears, with 'view' and 'edit' buttons
            cy.get('[data-testid=changeDisplayType-submit-status]')
                .should('contain', changeDisplayTypeLocale.successAlert.title)
                .should('contain', changeDisplayTypeLocale.successAlert.message);

            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', changeDisplayTypeLocale.workflowConfirmation.confirmationTitle);

            cy.get('[data-testid=confirm-changeDisplayTypeDone]').contains(
                'button',
                changeDisplayTypeLocale.workflowConfirmation.confirmButtonLabel,
            );
            cy.get('[data-testid=cancel-changeDisplayTypeDone]')
                .contains('button', changeDisplayTypeLocale.workflowConfirmation.cancelButtonLabel)
                .click();
            cy.location().should(loc => {
                expect(loc.pathname).to.eq(`/view/${pid}`);
            });
        });
    });
});
