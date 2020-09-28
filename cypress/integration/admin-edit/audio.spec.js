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
        cy.adminEditCountCards(7);
        cy.adminEditVerifyAlerts(1, ['Publication date is required']);
        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
        cy.adminEditCheckTabErrorBadge(1);
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        cy.log('Identifiers tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(0)
            .as('identifiersCard')
            .within(() => {
                cy.get('h4').should('contain', 'Manage links');
                const links = [
                    {
                        url: record.fez_record_search_key_link[0].rek_link,
                        description: record.fez_record_search_key_link_description[0].rek_link_description,
                    },
                ];
                links.forEach((link, index) => {
                    cy.get(`[data-testid=rek-link-list-row-${index}]`)
                        .find('p')
                        .should('have.text', `Link: ${link.url}`)
                        .siblings('span')
                        .should('have.text', `Description: ${link.description}`);
                });
            });

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicCard')
            .within(() => {
                cy.get('h4').should('contain', 'Bibliographic');
                cy.checkPartialDateFromRecordValue(
                    'rek-date-recorded',
                    record.fez_record_search_key_date_recorded.rek_date_recorded,
                );
                cy.get('[data-testid=rek-acknowledgements-input]').should(
                    'have.text',
                    record.fez_record_search_key_acknowledgements.rek_acknowledgements,
                );
                cy.get('[data-testid=rek-length-input]').should(
                    'have.value',
                    record.fez_record_search_key_length.rek_length,
                );
                cy.get('[data-testid=rek-source-input]').should(
                    'have.text',
                    record.fez_record_search_key_source.rek_source,
                );
                cy.get('[data-testid=rek-rights-input]').should(
                    'have.text',
                    record.fez_record_search_key_rights.rek_rights,
                );
                cy.get('div:nth-child(14) span span')
                    .eq(0)
                    .should('have.text', 'Transcript');
                cy.get('#cke_rek-transcript-editor').should('exist');
                cy.readCKEditor('rek-transcript').should(text => {
                    expect(text).to.contain(record.fez_record_search_key_transcript.rek_transcript);
                });
                cy.get('[data-testid=rek-alternate-genre-input]')
                    .should(
                        'have.value',
                        record.fez_record_search_key_alternate_genre.map(item => item.rek_alternate_genre).join(','),
                    )
                    .siblings('[role=button]')
                    .invoke('text')
                    .should(
                        'eq',
                        record.fez_record_search_key_alternate_genre
                            .map(item => item.rek_alternate_genre_lookup)
                            .join(','),
                    );
                cy.get('[data-testid=rek-location-input]').should(
                    'have.value',
                    record.fez_record_search_key_location.map(item => item.rek_location).join(''), // only has a single entry
                );
            });

        cy.get('@bibliographicCard')
            .find('[id=rek-date]')
            .as('pubDateBlock')
            .find('p')
            .should('exist')
            .should('have.text', 'Year required');
        cy.setPartialDate('rek-date', { day: 1, month: 1, year: 2020 });
        cy.get('@pubDateBlock')
            .find('p')
            .should('not.exist');

        cy.adminEditNoAlerts();

        // ---------------------------------------------- FILES TAB --------------------------------------------------
        cy.log('Files tab');
        cy.get('.StandardPage form > div > div')
            .get('.StandardCard')
            .eq(5)
            .as('filesTab');

        // start: check embargo date can be cleared
        cy.get('@filesTab')
            .find('#embargoDateButton-UQFL173_b57_R298B_2579510-mp3')
            .within(() => {
                cy.get('div > div > input').should('have.value', '01/01/2099');
                cy.get('div > div > div > button').click(); // date picker popup appears
            });

        cy.get('[role="presentation"] > div:nth-child(3) > div').within(() => {
            cy.get('div > button:nth-child(1) > span > h6').should('have.text', '2099');
        });

        cy.get('[role="presentation"] > div:nth-child(1)').click();

        cy.get('@filesTab')
            .find('#embargoDateButton-UQFL173_b57_R298B_2579510-mp3')
            .within(() => {
                cy.get('div > div > input').clear();
            });

        cy.get('@filesTab')
            .find('.StandardCard svg + span')
            .should('have.text', 'Embargo date removed - review security policy on Security tab');
        // end: check embargo date can be cleared

        cy.get('@filesTab')
            .find('.AdminCard')
            .eq(1)
            .within(() => {
                cy.get('h4').should('contain', 'Advisory statement');
                cy.get('span span')
                    .eq(0)
                    .should('contain', 'Advisory statement');
                cy.get('#cke_rek-advisory-statement-editor').should('exist');
                cy.readCKEditor('rek-advisory-statement').should(text => {
                    // prettier-ignore
                    expect(text).to.contain(
                            'Aboriginal and Torres Strait Islander material and information accessed on this site may be culturally sensitive for some individuals and communities. The University of Queensland has approval from traditional owners and or descendants of the people who participated in the Queensland Speech Survey by Elwyn Flint in the 1960s.'
                        );
                });
            });
    });
});
