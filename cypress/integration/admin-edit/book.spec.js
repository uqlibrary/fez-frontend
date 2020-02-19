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
            .eq(2)
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
    });
});
