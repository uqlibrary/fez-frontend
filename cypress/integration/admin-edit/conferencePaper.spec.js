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
        cy.adminEditCountCards(8);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Title of paper')
                    .should('contain', 'Conference name')
                    .should('contain', 'Conference details')
                    .should('contain', 'Proceedings title')
                    .should('contain', 'Journal name');
                cy.get('[data-testid=rek-conference-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_conference_name.rek_conference_name,
                );
                cy.get('[data-testid=rek-native-script-conference-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_native_script_conference_name.rek_native_script_conference_name,
                );
                cy.get('[data-testid=rek-roman-script-conference-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_roman_script_conference_name.rek_roman_script_conference_name,
                );
                cy.get('[data-testid=rek-translated-conference-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_translated_conference_name.rek_translated_conference_name,
                );
                cy.get('[data-testid=rek-conference-location-input]').should(
                    'have.value',
                    record.fez_record_search_key_conference_location.rek_conference_location,
                );
                cy.get('[data-testid=rek-conference-dates-input]').should(
                    'have.value',
                    record.fez_record_search_key_conference_dates.rek_conference_dates,
                );
                cy.get('[data-testid=rek-proceedings-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_proceedings_title.rek_proceedings_title,
                );

                cy.get('[data-testid=rek-language-of-proceedings-title-select]')
                    .should('have.text', 'German')
                    .siblings('[role=button] span')
                    .should('have.length', 0);
                cy.get('[data-testid=rek-native-script-proceedings-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_native_script_proceedings_title.rek_native_script_proceedings_title,
                );
                cy.get('[data-testid=rek-roman-script-proceedings-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_roman_script_proceedings_title.rek_roman_script_proceedings_title,
                );
                cy.get('[data-testid=rek-translated-proceedings-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_translated_proceedings_title.rek_translated_proceedings_title,
                );
                cy.get('[data-testid=rek-journal-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_journal_name.rek_journal_name,
                );
                cy.get('[data-testid=rek-language-of-journal-name-select]')
                    .should('have.text', 'German')
                    .siblings('[role=button] span')
                    .should('have.length', 0);
                cy.get('[data-testid=rek-native-script-journal-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_native_script_journal_name.rek_native_script_journal_name,
                );
                cy.get('[data-testid=rek-roman-script-journal-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name,
                );
                cy.get('[data-testid=rek-translated-journal-name-input]').should(
                    'have.value',
                    record.fez_record_search_key_translated_journal_name.rek_translated_journal_name,
                );

                cy.get('[data-testid=rek-series-input]').should(
                    'have.value',
                    record.fez_record_search_key_series.rek_series,
                );

                cy.get('[data-testid=rek-article-number-input]').should(
                    'have.value',
                    record.fez_record_search_key_article_number.rek_article_number,
                );
            });

        const errorMessages = [
            'Conference name is required',
            'Conference location is required',
            'Conference dates are required',
        ];
        [
            '[data-testid=rek-conference-name-input]',
            '[data-testid=rek-conference-location-input]',
            '[data-testid=rek-conference-dates-input]',
        ].forEach((selector, index) => {
            cy.get('@bibliographicTab')
                .find(selector)
                .clear();
            cy.get('[data-testid=alert-warning]').should('contain', errorMessages[index]);
        });
    });
});
context('Author affiliations', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });
    it('should be available for this work type', () => {
        cy.assertAffiliationsAllowed({
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 4,
            allowed: true,
        });
    });
});
