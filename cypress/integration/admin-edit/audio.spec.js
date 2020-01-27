import { default as recordList } from '../../../src/mock/data/records/publicationTypeListAudio';

context('Audio admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should load expected tabs', () => {
        cy.adminEditCountCards(8);
        cy.adminEditVerifyAlerts(1, ['Publication date is required']);

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(2);
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        cy.log('Identifiers tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(1)
            .find('.AdminCard')
            .eq(1)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Manage links');
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

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .find('.AdminCard')
            .eq(4)
            .as('bibliographicCard')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Bibliographic');
                cy.get('#Yearrecorded')
                    .should(
                        'have.value',
                        Cypress.moment(record.fez_record_search_key_date_recorded.rek_date_recorded)
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
                cy.get('div:nth-child(15) span span')
                    .eq(0)
                    .should('have.text', 'Transcript');
                cy.get('#cke_editor5')
                    .should('exist');
                cy.read_ckeditor('editor5')
                    .should(text => {
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

        cy.get('@bibliographicCard')
            .find('[placeholder=Date]')
            .as('pubDateField')
            .parent()
            .parent()
            .children('p')
            .should('exist')
            .should('have.text', 'This field is required');
        cy.get('@pubDateField')
            .type('01/10/2019')
            .blur()
            .parent()
            .parent()
            .children('p')
            .should('not.exist');
        cy.adminEditNoAlerts();

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        cy.log('Files tab');
        cy.get('.StandardPage form .StandardCard')
            .eq(6)
            .as('filesTab')
            .find('.StandardCard')
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Attached files');
                cy.get('.Alert .alert-text')
                    .should(
                        'have.text',
                        record.fez_record_search_key_advisory_statement.rek_advisory_statement,
                    );
            });

        // start: check embargo date can be cleared
        cy.get('@filesTab')
            .find('#embargoDateButton-UQFL173_b57_R298B_2579510-mp3')
            .within(() => {
                cy.get('div > div > input')
                    .should('have.value', '01/01/2099');
                cy.get('div > div > div > button')
                    .click(); // date picker popup appears
            });

        cy.get('[role="dialog"] > div:nth-child(2) > div')
            .within(() => {
                cy.get('div > div > h6')
                    .should('have.text', '2099');

                cy.get('> div:nth-child(2) > button:nth-child(1)')
                    .should('have.text', 'Clear')
                    .click(); // 'clear' button on date picker popup has been pressed
            });

        cy.get('@filesTab')
            .find('.StandardCard svg + span')
            .should('have.text', 'Embargo date removed - review security policy on Security tab');
        // end: check embargo date can be cleared

        cy.get('@filesTab')
            .find('.AdminCard')
            .eq(1)
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Advisory statement');
                cy.get('span span')
                    .eq(0)
                    .should('contain', 'Advisory statement');
                cy.get('#cke_editor7')
                    .should('exist');
                cy.read_ckeditor('editor7')
                    .should(text => {
                    // prettier-ignore
                        expect(text).to.contain(
                            record.fez_record_search_key_advisory_statement.rek_advisory_statement
                        );
                    });
            });
    });
});
