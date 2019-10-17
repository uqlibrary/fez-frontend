import { default as recordList } from '../../../src/mock/data/records/publicationTypeListAudio';
import moment from 'moment';

context('Audio admin edit', () => {
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
                    .should('have.length', 3)
                    .should('contain', 'Publication date is required')
                    .should('contain', 'Author/creator names are required')
                    .should('contain', 'Editor/contributor names are required');
            });

        cy.get('.StandardPage form > div > div:nth-child(10) button')
            .should('exist')
            .should('be.disabled');

        cy.get('input[value=tabbed]')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');

        cy.get('[role="tab"]')
            .eq(2)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '1');

        cy.get('[role="tab"]')
            .eq(3)
            .find('[class*="MuiBadge-colorError"]')
            .should('have.text', '2');
    });

    it('should render Identifiers tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(2)')
            .within(() => {
                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Manage links');
                        const links = [
                            {
                                url: record.fez_record_search_key_link[0].rek_link,
                                description: record.fez_record_search_key_link_description[0].rek_link_description,
                            },
                        ];
                        links.forEach((link, index) => {
                            cy.get('[class*=ListRow-NoLabel]')
                                .eq(index)
                                .find('p')
                                .should('have.text', `Link: ${link.url}`)
                                .siblings('span')
                                .should('have.text', `Description: ${link.description}`);
                        });
                    });
            });
    });

    it('should render Bibliographic tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .within(() => {
                cy.get('div:nth-child(5) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');
                        cy.get('#Yearrecorded')
                            .should(
                                'have.value',
                                moment(record.fez_record_search_key_date_recorded.rek_date_recorded)
                                    .format('YYYY'),
                            );
                        cy.get('#Acknowledgements')
                            .should(
                                'have.text',
                                record.fez_record_search_key_acknowledgements.rek_acknowledgements,
                            );
                        cy.get('#Length')
                            .should('have.value', record.fez_record_search_key_length.rek_length);
                        cy.get('#Type')
                            .should('have.value', record.rek_genre);
                        cy.get('label[id="License-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                            .siblings('[role=button]')
                            .invoke('text')
                            .should('match', new RegExp(`^${record.fez_record_search_key_license.rek_license_lookup}`));
                        cy.get('#Source')
                            .should('have.text', record.fez_record_search_key_source.rek_source);
                        cy.get('#Rights')
                            .should('have.text', record.fez_record_search_key_rights.rek_rights);
                        cy.get('span span')
                            .eq(1)
                            .should('have.text', 'Transcript');
                        cy.get('#cke_editor5')
                            .should('exist');
                        cy.read_ckeditor('editor5')
                            .then(text => {
                                expect(text).to.contain(record.fez_record_search_key_transcript.rek_transcript);
                            });
                        cy.get('label[id="Alternate genre-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_alternate_genre.map(item => item.rek_alternate_genre)
                                    .join(','),
                            )
                            .siblings('[role=button]')
                            .invoke('text')
                            .should(
                                'eq',
                                record.fez_record_search_key_alternate_genre
                                    .map(item => item.rek_alternate_genre_lookup)
                                    .join(','),
                            );
                    });
            });
    });

    it('should render Files tab', () => {
        cy.get('.StandardPage form > div > div:nth-child(7)')
            .within(() => {
                cy.get('div:nth-child(2) > div > div:nth-child(1) .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Attached files');
                        cy.get('.Alert .alert-text')
                            .should(
                                'have.text',
                                record.fez_record_search_key_advisory_statement.rek_advisory_statement,
                            );
                    });

                cy.get('div:nth-child(2) > div > div:nth-child(3) .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Advisory statement');
                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Advisory statement');
                        cy.get('#cke_editor7')
                            .should('exist');
                        cy.read_ckeditor('editor7')
                            .then(text => {
                                // prettier-ignore
                                expect(text).to.contain(
                                    record.fez_record_search_key_advisory_statement.rek_advisory_statement
                                );
                            });
                    });
            });
    });
});
