import { default as recordList } from '../../../src/mock/data/records/publicationTypeListNewspaperArticle';

context('Newspaper Article admin edit', () => {
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

    it('should load with specifed elements', () => {
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
            });

        cy.get('.StandardPage form button')
            .contains('Submit')
            .should('exist')
            .parent()
            .should('be.enabled');

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Newspaper Article specific fields on the Bibliographic tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .eq(3)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');

                        cy.get('#Placeofpublication')
                            .should(
                                'have.value',
                                record.fez_record_search_key_place_of_publication.rek_place_of_publication,
                            );
                        cy.get('#Publishername')
                            .should(
                                'have.value',
                                record.fez_record_search_key_publisher.rek_publisher,
                            );
                        cy.get('#Edition')
                            .should('have.value', record.fez_record_search_key_edition.rek_edition);
                        cy.get('#Newspaper')
                            .should('have.value', record.fez_record_search_key_newspaper.rek_newspaper);
                        cy.get('#Section')
                            .should('have.value', record.fez_record_search_key_section.rek_section);
                        cy.get('#Translatednewspaper')
                            .should(
                                'have.value',
                                record.fez_record_search_key_translated_newspaper.rek_translated_newspaper,
                            );
                    });
            });
    });
});
