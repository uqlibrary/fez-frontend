import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBook';

context('Book chapter admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load
    });

    afterEach(() => {
        cy.window()
            .then(win => (win.onbeforeunload = undefined));
    });

    it('should load expected tabs', () => {
        // cy.get('.StandardPage h3')
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.wait(1000); // Allow more time for rendering tabbing mechanism
        cy.get('input[value=tabbed]')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.wait(1000); // Test going back to list view
        cy.get('input[value=tabbed]')
            .click()
            .should('be.not.checked');

        cy.get('@cards')
            .should('have.length', 8);
    });
});
