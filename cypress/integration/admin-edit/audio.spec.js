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
        cy.adminEditCheckTabErrorBadge('bibliographic');
    });

    it('should render the different sections as expected', () => {
        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        cy.log('Identifiers tab');
        cy.get('[data-testid=identifiers-section-content]').within(() => {
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
        cy.get('[data-testid=bibliographic-section-content]')
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
                // cy.get('[data-testid="rek-transcript"] .ck-editor__main p').should('exist');
                cy.readCKEditor('rek-transcript').then(text => {
                    cy.log('text=', text);
                    expect(text).to.contain(record.fez_record_search_key_transcript.rek_transcript.substring(0, 10));
                    // substring: hard to compare html to a string!
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
        cy.get('[data-testid=files-section-content]').as('filesTab');

        // start: check embargo date can be cleared
        cy.get('@filesTab')
            .find('#embargoDateButton-UQFL173_b57_R298B_2579510-mp3')
            .within(() => {
                cy.get('div > div > input').should('have.value', '01/01/2099');
                cy.get('div > div > div > button').as('embargoDateButton');
                cy.get('@embargoDateButton').click(); // date picker popup appears
            });

        cy.get('[role="dialog"] [role="presentation"] .MuiPickersCalendarHeader-label').should(
            'have.text',
            'January 2099',
        );
        // cy.get('[role="dialog"] [role="presentation"]').within(() => {
        //     cy.get('.MuiPickersCalendarHeader-label').should('have.text', 'January 2099');
        // });

        cy.get('@embargoDateButton').click(); // date picker disappears

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
                cy.readCKEditor('rek-advisory-statement').then(text => {
                    expect(text).to.contain(record.fez_record_search_key_advisory_statement.rek_advisory_statement);
                });
            });
    });
});
context('Author affiliations', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });
    it('should not be available for this work type', () => {
        cy.assertAffiliationsAllowed({
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 1,
        });
    });
});
