import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBook';

context('Book admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(7);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');

        cy.adminEditTabbedView(false);
        cy.adminEditCountCards(7);
    });

    it('should render the different sections as expected', () => {
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
            .within(() => {
                cy.get('.AdminCard')
                    .contains('h4', 'ISSN')
                    .parents('.AdminCard')
                    .as('issnBlock')
                    .find('input')
                    .as('issnInput')
                    .type('11111111{enter}');
                cy.get('@issnBlock')
                    .should('contain', '1111-1111')
                // Mock returns no sherpa data for issn 1111-1111 or 2222-2222.
                    .should('not.contain', "Check publisher's open access policy");
                cy.get('@issnInput')
                    .type('12121212{enter}');
                cy.get('@issnBlock')
                    .should('contain', "1212-1212 Check publisher's open access policy")
                    .contains('span', '1212-1212')
                    .siblings('a')
                    .should('have.attr', 'href', 'http://www.sherpa.ac.uk/romeo/search.php?issn=1212-1212');
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
    });
});
