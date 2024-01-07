import { default as recordListBook } from '../../src/mock/data/records/publicationTypeListBookEdited';
import { default as recordListImage } from '../../src/mock/data/records/publicationTypeListImage';

const recordBook = recordListBook.data[0];
const recordImage = recordListImage.data[0];

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
                .should('contain', 'Change display type from ')
                .should('contain', recordBook.rek_display_type_lookup)
                .should('contain', recordBook.rek_subtype);

            cy.get('.publicationCitation .citationTitle').should('contain', recordBook.rek_title);

            // select display type
            selectItem('rek-display-type', 'Conference Paper');

            // select Conference Paper, as it has subtypes, so the second dropdown will appear
            cy.get('[data-testid=change-display-type-submit]').should('be.disabled');

            // select subtype
            selectItem('rek-subtype', 'Fully published paper');
            cy.get('[data-testid=change-display-type-submit]').should('not.be.disabled');

            cy.get('[data-testid=change-display-type-submit]')
                .should('have.text', 'Change display type')
                .click();

            // form submitted and the green 'all good' message appears, with 'view' and 'edit' buttons
            cy.get('[data-testid=change-display-type-submit-status]')
                .should('contain', 'Success')
                .should('contain', 'Display type has been changed successfully.');

            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', 'Change Display type');

            cy.get('[data-testid=cancel-changeDisplayTypeDone]').contains('button', 'View work');
            cy.get('[data-testid=confirm-changeDisplayTypeDone]')
                .contains('button', 'Edit full work')
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
                .should('contain', 'Change display type from ')
                .should('contain', recordImage.rek_display_type_lookup);

            cy.get('.publicationCitation .citationTitle').should('contain', recordImage.rek_title);

            // select display type
            selectItem('rek-display-type', 'Image');

            // The Image type does not have subtypes, so the second dropdown will not appear
            // and the submit button is enabled immediately
            cy.get('[data-testid=change-display-type-submit]').should('not.be.disabled');

            cy.get('[data-testid=change-display-type-submit]')
                .should('have.text', 'Change display type')
                .click();

            // form submitted and the green 'all good' message appears, with 'view' and 'edit' buttons
            cy.get('[data-testid=change-display-type-submit-status]')
                .should('contain', 'Success')
                .should('contain', 'Display type has been changed successfully.');

            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', 'Change Display type');

            cy.get('[data-testid=confirm-changeDisplayTypeDone]').contains('button', 'Edit full work');
            cy.get('[data-testid=cancel-changeDisplayTypeDone]')
                .contains('button', 'View work')
                .click();
            cy.location().should(loc => {
                expect(loc.pathname).to.eq(`/view/${pid}`);
            });
        });
    });
});
