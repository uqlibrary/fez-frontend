import { default as recordList } from '../../../src/mock/data/records/publicationTypeListConferencePaper';

context('Conference Paper admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.visit(`/admin/edit/${record.rek_pid}?user=uqstaff`);
        cy.closeUnsupported();
        cy.wait(1000); // Wait for data load
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
    });

    it('should render Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Title of paper');
                    });
                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Conference name');
                        cy.get('#Conferencename')
                            .should(
                                'have.value',
                                record.fez_record_search_key_conference_name.rek_conference_name,
                            );
                    });
                cy.get('div:nth-child(4) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Conference details');
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
                    });
                cy.get('div:nth-child(5) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Proceedings title');
                        cy.get('#Proceedingstitle')
                            .should(
                                'have.value',
                                record.fez_record_search_key_proceedings_title.rek_proceedings_title,
                            );
                    });
                cy.get('div:nth-child(6) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Journal name');
                        cy.get('#Journalname')
                            .should('have.value', record.fez_record_search_key_journal_name.rek_journal_name);
                    });
            });
    });
});
