import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBook';

context('Book admin edit', () => {
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
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
                cy.get('button')
                    .should('be.enabled');
            });

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.not.checked');

        cy.get('@cards')
            .should('have.length', 8);
    });

    it('should render Bibliographic tab', () => {
        cy.waitForCkeditorToHaveLoaded();
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
                cy.get('div:nth-child(5) > .StandardCard')
                    .as('bibliographicTab')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');
                    });
            });

        cy.get('@bibliographicTab')
            .find('#Placeofpublication')
            .clear()
            .parent()
            .parent()
            .children('p')
            .should('exist')
            .should('have.text', 'This field is required');

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 1)
                    .should('have.text', 'Place of publication is required');
            });
    });
});
