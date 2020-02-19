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
                cy.get('#Chapternumber')
                    .should(
                        'have.value',
                        record.fez_record_search_key_chapter_number.rek_chapter_number);
                cy.get('label')
                    .should('contain', 'Book title');
                cy.get('#Booktitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_book_title.rek_book_title,
                    );
                const langCodes = record.fez_record_search_key_language_of_book_title.map(
                    lang => lang.rek_language_of_book_title,
                );
                cy.get('label[id="Language of book title-label"]')
                    .parent()
                    .find('input[type=hidden]')
                    .should('have.value', langCodes.join(','))
                    .siblings('[role=button] span')
                    .should('have.length', 0); // If no matching codes found, there is a span present
                cy.get('#Nativescriptbooktitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_native_script_book_title.rek_native_script_book_title,
                    );
                cy.get('#Romanscriptbooktitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_roman_script_book_title.rek_roman_script_book_title,
                    );
                cy.get('#Translatedbooktitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_translated_book_title.rek_translated_book_title,
                    );
            });

        cy.get('@bibliographicTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'ISBN');

                const isbns = record.fez_record_search_key_isbn.map(item => item.rek_isbn);
                isbns.forEach((isbn, index) => {
                    cy.get('p')
                        .eq(index)
                        .should('have.text', isbn);
                });
            });

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.viewport(1000,2000);
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(2)
            .as('authorDetailsTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Editors');
            });
        const editors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
        cy.get('@authorDetailsTab')
            .get('.contributorEditor')
            .eq(1)
            .within(() => {
                editors.forEach((editor, index) => {
                        cy.get('p')
                        .eq(index)
                        .should('have.text', editor);
                });
            });
    });
});
