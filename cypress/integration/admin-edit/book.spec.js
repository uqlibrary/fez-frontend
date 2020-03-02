import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBook';

context('Book admin edit', () => {
    const record = recordList.data[0];

    it('should load expected tabs', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.adminEditCountCards(7);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');

        cy.adminEditTabbedView(false);
        cy.adminEditCountCards(7);
        cy.adminEditCleanup();
    });

    it('should render the different sections as expected', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div >div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Title');
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

        cy.get('@bibliographicTab')
            .find('#Placeofpublication')
            .clear()
            .parent()
            .parent()
            .children('p')
            .should('exist')
            .should('have.text', 'This field is required');

        cy.adminEditVerifyAlerts(1, ['Place of publication is required']);
        cy.adminEditCleanup();
    });

    it('should render ISSN as expected', () => {
        const record = recordList.data[1];
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.get('.StandardPage form > div >div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab');

        cy.get('@bibliographicTab')
            .within(() => {
                cy.get('.AdminCard')
                    .contains('h4', 'ISSN')
                    .parents('.AdminCard')
                    .as('issnBlock')
                // Find existing entry with placeholder data
                    .find('.ListRow-ISSNvalue')
                    .eq(1)
                    .should('contain', '1611-3349 Ulrichs')
                    .find('button[aria-label="Edit this item"]')
                    .click();
                // Edit issn to one with valid data
                cy.get('@issnBlock')
                    .find('input')
                    .type('{backspace}0{enter}');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(1)
                    .should('contain', '1611-3340 SHERPA/RoMEO')
                    .should('contain', 'Ulrichs');
                // Add a 3rd entry without match in API
                cy.get('@issnBlock')
                    .find('input')
                    .type('11111111{enter}');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(2)
                    .should('contain', '1111-1111')
                // Mock returns no sherpa data for issn 1111-1111 or 2222-2222.
                    .should('not.contain', 'SHERPA/RoMEO');
                // Add 4th entry with match in API
                cy.get('@issnBlock')
                    .find('input')
                    .type('12121212{enter}');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(3)
                    .should('contain', '1212-1212 SHERPA/RoMEO')
                    .contains('span', '1212-1212')
                    .siblings('a')
                    .eq(0)
                    .should('have.attr', 'href', 'http://www.sherpa.ac.uk/romeo/search.php?issn=1212-1212')
                    .parents('.ListRow-ISSNvalue')
                    .find('button[aria-label="Edit this item"]')
                    .click();
                // Edit the 4th entry
                cy.get('@issnBlock')
                    .find('input')
                    .type('{backspace}3{enter}');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(3)
                    .should('not.contain', '1212-1212')
                    .should('contain', '1212-1213 SHERPA/RoMEO')
                    .contains('span', '1212-1213')
                    .siblings('a')
                    .eq(0)
                    .should('have.attr', 'href', 'http://www.sherpa.ac.uk/romeo/search.php?issn=1212-1213');
                // Add a 5th entry
                cy.get('@issnBlock')
                    .find('input')
                    .type('23232323{enter}');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(4)
                    .should('contain', '2323-2323 SHERPA/RoMEO')
                    .contains('span', '2323-2323')
                    .parents('.ListRow-ISSNvalue')
                // Move up the 5th entry
                    .find('button[title="Move item up the order"]')
                    .click();
                // Ensure 4th and 5th entries have swapped properly.
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(3)
                    .should('contain', '2323-2323 SHERPA/RoMEO')
                    .contains('span', '2323-2323')
                    .siblings('a')
                    .eq(0)
                    .should('have.attr', 'href', 'http://www.sherpa.ac.uk/romeo/search.php?issn=2323-2323');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(4)
                    .should('contain', '1212-1213 SHERPA/RoMEO')
                    .contains('span', '1212-1213')
                    .siblings('a')
                    .eq(0)
                    .should('have.attr', 'href', 'http://www.sherpa.ac.uk/romeo/search.php?issn=1212-1213');
            });

        cy.adminEditCleanup();
    });
});
