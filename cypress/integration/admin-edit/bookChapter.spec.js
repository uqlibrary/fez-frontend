import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBookChapter';

context('Book Chapter admin edit', () => {
    // const baseUrl = Cypress.config('baseUrl');
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

        cy.get('[role="tab"]')
            .eq(3)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '2');
    });

    it('should render Bibliographic tab with multilingual fields', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Book title');
                        cy.get('#Booktitle')
                            .should('have.value', record.fez_record_search_key_book_title.rek_book_title);
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

                cy.get('div:nth-child(4) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'ISBN');

                        const isbns = record.fez_record_search_key_isbn.map(item => item.rek_isbn);
                        isbns.forEach((isbn, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', isbn);
                        });
                    });

                cy.get('div:nth-child(6) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');
                        cy.get('#Chapternumber')
                            .should(
                                'have.value',
                                record.fez_record_search_key_chapter_number.rek_chapter_number,
                            );
                    });
            });
    });

    it('should render Author details tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(4)')
            .within(() => {
                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Editors');
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
