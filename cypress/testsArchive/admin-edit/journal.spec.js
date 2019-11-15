import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournal';

context('Journal admin edit', () => {
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

        cy.get('.StandardPage form > div > div:nth-child(9)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 2)
                    .should('contain', 'Journal name is required');
            });

        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('exist')
            .should('be.disabled');

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.get('[role="tab"]')
            .eq(2)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');
    });

    it('should render Journal specific fields on the Bibliographic tab', () => {
        cy.waitForCkeditorToHaveLoaded();
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('div:nth-child(5) > .StandardCard')
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
                        cy.get('#Volume')
                            .should('have.value', record.fez_record_search_key_volume_number.rek_volume_number);
                        cy.get('#Issue')
                            .should('have.value', record.fez_record_search_key_issue_number.rek_issue_number);
                        cy.get('label[id="Refereed source-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_refereed_source.rek_refereed_source)
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_refereed_source.rek_refereed_source_lookup);
                    });
            });
    });
});
