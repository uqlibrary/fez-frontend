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
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
                cy.get('button')
                    .contains('Submit')
                    .should('exist')
                    .parent()
                    .should('be.enabled');
            });

        cy.wait(1000); // Wait for tabbing to fully load

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('.AdminCard')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
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

                cy.get('.AdminCard')
                    .eq(3)
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

                cy.get('.AdminCard')
                    .eq(5)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');
                        cy.get('#Chapternumber')
                            .should(
                                'have.value',
                                record.fez_record_search_key_chapter_number.rek_chapter_number,
                            );
                    });
            });

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        cy.log('Author Details tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(3)
            .within(() => {
                cy.get('.AdminCard')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Editors');
                        const editors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                        editors.forEach((editor, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', editor);
                        });
                    });
            });
    });
});
