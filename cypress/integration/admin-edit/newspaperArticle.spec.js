import { default as recordList } from '../../../src/mock/data/records/publicationTypeListNewspaperArticle';

context('Newspaper Article admin edit', () => {
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

    it('should load with specifed elements', () => {
        cy.get('h2')
            .should('have.length', 1)
            .should('have.text', `Edit ${record.rek_display_type_lookup} - ${record.rek_title}: ${record.rek_pid}`);

        cy.get('input[value=tabbed]')
            .should('be.not.checked');

        cy.get('button[title="Learn about keyboard shortcuts"]')
            .should('exist');

        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 8);
    });

    it('should render Newspaper Article specific fields on the Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('div:nth-child(4) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');

                        cy.get('#Placeofpublication')
                            .should(
                                'have.value',
                                record.fez_record_search_key_place_of_publication.rek_place_of_publication,
                            );
                        cy.get('#Publishername')
                            .should('have.value', record.fez_record_search_key_publisher.rek_publisher);
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
