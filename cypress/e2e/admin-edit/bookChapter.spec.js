import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBookChapter';

context('Book Chapter admin edit', () => {
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
                cy.get('[data-testid=rek-chapter-number-input]').should(
                    'have.value',
                    record.fez_record_search_key_chapter_number.rek_chapter_number,
                );
                cy.get('label').should('contain', 'Book title');
                cy.get('[data-testid=rek-book-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_book_title.rek_book_title,
                );
                // const langCodes = record.fez_record_search_key_language_of_book_title.map(
                //     lang => lang.rek_language_of_book_title,
                // );
                cy.get('[data-testid=rek-language-of-book-title-select]')
                    .should('have.text', 'Japanese')
                    .siblings('[role=button] span')
                    .should('have.length', 0); // If no matching codes found, there is a span present
                cy.get('[data-testid=rek-native-script-book-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_native_script_book_title.rek_native_script_book_title,
                );
                cy.get('[data-testid=rek-roman-script-book-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_roman_script_book_title.rek_roman_script_book_title,
                );
                cy.get('[data-testid=rek-translated-book-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_translated_book_title.rek_translated_book_title,
                );
            });

        cy.get('@bibliographicTab').within(() => {
            cy.get('h4').should('contain', 'ISBN');

            const isbns = record.fez_record_search_key_isbn.map(item => item.rek_isbn);
            isbns.forEach((isbn, index) => {
                cy.get(`[data-testid="rek-isbn-list-row-${index}"] p`).should('have.text', isbn);
            });
        });

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('[data-testid=authors-section-content]')
            .as('authorDetailsTab')
            .within(() => {
                cy.get('h4').should('contain', 'Editors');
            });
        const editors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
        cy.get('@authorDetailsTab').within(() => {
            editors.forEach((editor, index) => {
                cy.get(`[data-testid=rek-contributor-list-row-${index}-name-as-published]`).should('have.text', editor);
            });
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
            rowId: 2,
            allowed: true,
        });
    });
});
