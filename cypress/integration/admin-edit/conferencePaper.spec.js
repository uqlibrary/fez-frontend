import { default as recordList } from '../../../src/mock/data/records/publicationTypeListConferencePaper';

context('Conference Paper admin edit', () => {
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
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Title of paper')
                    .should('contain', 'Conference name')
                    .should('contain', 'Conference details')
                    .should('contain', 'Proceedings title')
                    .should('contain', 'Journal name');
                cy.get('#Conferencename')
                    .should(
                        'have.value',
                        record.fez_record_search_key_conference_name.rek_conference_name,
                    );
                cy.get('#Nativescriptconferencename')
                    .should(
                        'have.value',
                        // prettier-ignore
                        record.fez_record_search_key_native_script_conference_name
                            .rek_native_script_conference_name,
                    );
                cy.get('#Romanscriptconferencename')
                    .should(
                        'have.value',
                        // prettier-ignore
                        record.fez_record_search_key_roman_script_conference_name
                            .rek_roman_script_conference_name,
                    );
                cy.get('#Translatedconferencename')
                    .should(
                        'have.value',
                        record.fez_record_search_key_translated_conference_name.rek_translated_conference_name,
                    );
                cy.get('#Conferencelocation')
                    .should(
                        'have.value',
                        record.fez_record_search_key_conference_location.rek_conference_location,
                    );
                cy.get('#Conferencedates')
                    .should(
                        'have.value',
                        record.fez_record_search_key_conference_dates.rek_conference_dates,
                    );
                cy.get('#Proceedingstitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_proceedings_title.rek_proceedings_title,
                    );

                cy.get('[data-testid=rek-language-of-proceedings-title-select]')
                    .should('have.text', 'German')
                    .siblings('[role=button] span')
                    .should('have.length', 0);
                cy.get('#Nativescriptproceedingstitle')
                    .should(
                        'have.value',
                        // prettier-ignore
                        record.fez_record_search_key_native_script_proceedings_title
                            .rek_native_script_proceedings_title,
                    );
                cy.get('#Romanscriptproceedingstitle')
                    .should(
                        'have.value',
                        // prettier-ignore
                        record.fez_record_search_key_roman_script_proceedings_title
                            .rek_roman_script_proceedings_title,
                    );
                cy.get('#Translatedproceedingstitle')
                    .should(
                        'have.value',
                        // prettier-ignore
                        record.fez_record_search_key_translated_proceedings_title
                            .rek_translated_proceedings_title,
                    );
                cy.get('#Journalname')
                    .should('have.value', record.fez_record_search_key_journal_name.rek_journal_name);
                cy.get('[data-testid=rek-language-of-journal-name-select]')
                    .should('have.text', 'German')
                    .siblings('[role=button] span')
                    .should('have.length', 0);
                cy.get('#Nativescriptjournalname')
                    .should(
                        'have.value',
                        record.fez_record_search_key_native_script_journal_name.rek_native_script_journal_name,
                    );
                cy.get('#Romanscriptjournalname')
                    .should(
                        'have.value',
                        record.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name,
                    );
                cy.get('#Translatedjournalname')
                    .should(
                        'have.value',
                        record.fez_record_search_key_translated_journal_name.rek_translated_journal_name,
                    );

                cy.get('#series-field-input')
                    .should('have.value', record.fez_record_search_key_series.rek_series);

                cy.get('#Articlenumber')
                    .should(
                        'have.value',
                        record.fez_record_search_key_article_number.rek_article_number,
                    );
            });

        const errorMessages = [
            'Conference name is required',
            'Conference location is required',
            'Conference dates are required',
        ];
        ['#Conferencename', '#Conferencelocation', '#Conferencedates'].forEach((selector, index) => {
            cy.get('@bibliographicTab')
                .find(selector)
                .clear();
            cy.get('.StandardPage form > div:nth-child(2) .Alert .alert-text li')
                .should('have.length', index + 1)
                .eq(index)
                .should('have.text', errorMessages[index]);
        });
    });
});
