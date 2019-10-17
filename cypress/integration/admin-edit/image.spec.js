import { default as recordList } from '../../../src/mock/data/records/publicationTypeListImage';

context('Image admin edit', () => {
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
                    .should('not.exist');
                cy.get('button')
                    .should('be.enabled');
            });

        cy.wait(1000); // Allow more time for rendering tabbing mechanism
        cy.get('input[value=tabbed]')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Image specific fields on the Bibliographic tab', () => {
        const baseUrl = Cypress.config('baseUrl');
        console.log('baseUrl = ', baseUrl);
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.root()
                    .children('.StandardCard')
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('div:nth-child(3) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');

                        cy.get('#Type')
                            .should('have.value', record.rek_genre);
                        cy.get('#Originalformat')
                            .should(
                                'have.value',
                                record.fez_record_search_key_original_format.rek_original_format,
                            );
                        cy.get('label[id="Refereed source-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_refereed_source.rek_refereed_source)
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_refereed_source.rek_refereed_source_lookup);
                        cy.get('#Source')
                            .should('have.value', record.fez_record_search_key_source.rek_source);
                        cy.get('#Rights')
                            .should('have.value', record.fez_record_search_key_rights.rek_rights);

                        cy.get('label[id="License-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_license.rek_license)
                            .siblings('[role=button]')
                            .contains(record.fez_record_search_key_license.rek_license_lookup);
                    });
            });
    });
});
