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

    it('should render Bibliographic tab with multilingual fields', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Title');
                        const langCodes = record.fez_record_search_key_language_of_title.map(
                            lang => lang.rek_language_of_title,
                        );
                        cy.get('label[id="Language of title-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', langCodes.join(','))
                            .siblings('[role=button] span')
                            .should('have.length', 0); // If no matching codes found, there is a span present
                        cy.get('#Nativescripttitle')
                            .should(
                                'have.value',
                                record.fez_record_search_key_native_script_title.rek_native_script_title,
                            );
                        cy.get('#Romanscripttitle')
                            .should(
                                'have.value',
                                record.fez_record_search_key_roman_script_title.rek_roman_script_title,
                            );
                        cy.get('#Translatedtitle')
                            .should(
                                'have.value',
                                record.fez_record_search_key_translated_title.rek_translated_title,
                            );
                    });
            });
    });
});
