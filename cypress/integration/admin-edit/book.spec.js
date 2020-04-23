import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBook';
import { sherpaRomeo as sherpaMocks } from '../../../src/mock/data/sherpaRomeo';

context('Book admin edit', () => {
    const record = recordList.data[0];

    it('should load expected tabs', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.adminEditCountCards(7);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');

        cy.adminEditTabbedView(false);
        cy.adminEditCountCards(7);
        cy.adminEditCleanup();
    });

    it('should render the different sections as expected', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('.StandardPage form > div >div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4')
                    .should('contain', 'Title');
                const langCodes = record.fez_record_search_key_language_of_title.map(
                    lang => lang.rek_language_of_title,
                );
                cy.get('label[id="Language of title-label"]')
                    .parent()
                    .find('input[type=hidden]')
                    .should('have.value', langCodes.join(','))
                    .siblings('[role=button] span')
                    .should('have.length', 0); // If no matching codes found, there is a span present
                cy.get('#Nativescripttitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_native_script_title.rek_native_script_title,
                    );
                cy.get('#Romanscripttitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_roman_script_title.rek_roman_script_title,
                    );
                cy.get('#Translatedtitle')
                    .should(
                        'have.value',
                        record.fez_record_search_key_translated_title.rek_translated_title,
                    );
            });

        cy.get('@bibliographicTab')
            .find('#Placeofpublication')
            .clear()
            .parent()
            .parent()
            .children('p')
            .should('exist')
            .should('have.text', 'This field is required');

        cy.adminEditVerifyAlerts(1, ['Place of publication is required']);
        cy.adminEditCleanup();
    });

    it('should render ISSN as expected', () => {
        const record = recordList.data[1];
        const ulrichsLinkPrefix =
            'http://ezproxy.library.uq.edu.au/login?url=http://ulrichsweb.serialssolutions.com/title/';

        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.get('.StandardPage form > div >div')
            .get('.StandardCard')
            .eq(1)
            .as('bibliographicTab');

        const checkIssnLinks = (container, issn) => {
            const sherpaLink =
                (sherpaMocks.find(item => item.srm_issn === issn) || {}).srm_journal_link ||
                sherpaMocks[0].srm_journal_link;
            cy.wrap(container)
                .find('span > span')
                .should('contain', issn)
                .siblings('a')
                // Make sure the data has loaded...
                // .should('contain', 'SHERPA/RoMEO')
                .should('contain', 'Ulrichs')
                .as('issnLinks')
                // ...before finding 'nth'
                .eq(0)
                .should('have.attr', 'href', sherpaLink);
            const ulrichsID = issn === '0302-9743' ? '122527' : issn.replace('-', '');
            cy.get('@issnLinks')
                .eq(1)
                .should('have.attr', 'href', `${ulrichsLinkPrefix}${ulrichsID}`);
        };

        cy.get('@bibliographicTab')
            .within(() => {
                cy.get('.AdminCard')
                    .contains('h4', 'ISSN')
                    .parents('.AdminCard')
                    .as('issnBlock');
                cy.log('Find existing entry');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(0)
                    .within(row => {
                        checkIssnLinks(row, '0302-9743');
                    });
                cy.log('Find existing entry with placeholder data');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(1)
                    .should('contain', '1611-3349 Ulrichs')
                    .within(() => {
                        cy.get('a')
                            .should('have.length', 1)
                            .should('have.attr', 'title', 'Lecture Notes in Computer Science')
                            .should(
                                'have.attr',
                                'aria-label',
                                'Source publisher name/place and alternate ISSNs in a new window',
                            )
                            .should('have.attr', 'href', `${ulrichsLinkPrefix}339301`);
                        cy.get('button[aria-label="Edit this item"]')
                            .click();
                    });
                cy.log('Edit issn to one with valid data');
                cy.get('@issnBlock')
                    .find('input')
                    .type('{backspace}0{enter}');
                cy.get('@issnBlock')
                    .find('.ListRow-ISSNvalue')
                    .eq(1);
            // temp removal for 172467486
            // .within(row => {
            //     checkIssnLinks(row, '1611-3340');
            // })
            // cy.log('Add a 3rd entry without match in API');
            // cy.get('@issnBlock')
            //     .find('input')
            //     .type('11111111{enter}');
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(2)
            //     .should('contain', '1111-1111')
            // // Mock returns no sherpa/ulrichs data for issn 1111-1111 or 2222-2222.
            //     .should('not.contain', 'SHERPA/RoMEO')
            //     .should('not.contain', 'Ulrichs');
            // cy.viewport(1000, 1000);
            // cy.log('Add 4th entry with match in API');
            // cy.get('@issnBlock')
            //     .find('input')
            //     .type('33333333{enter}');
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(3)
            //     .within(row => {
            //         checkIssnLinks(row, '3333-3333');
            //         cy.get('span > a')
            //             .eq(1)
            //             .should('have.attr', 'title', 'Lecture Notes in Computer Science')
            //             .should(
            //                 'have.attr',
            //                 'aria-label',
            //                 'Source publisher name/place and alternate ISSNs in a new window',
            //             );
            //     })
            //     .parents('.ListRow-ISSNvalue')
            //     .find('button[aria-label="Edit this item"]')
            //     .click();
            // cy.log('Edit the 4th entry');
            // cy.get('@issnBlock')
            //     .find('input')
            //     .type('{selectall}{del}44444444{enter}');
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(3)
            //     .should('not.contain', '3333-3333')
            //     .within(row => {
            //         checkIssnLinks(row, '4444-4444');
            //     });
            // cy.log('Add a 5th entry');
            // cy.get('@issnBlock')
            //     .find('input')
            //     .type('55555555{enter}');
            // cy.log('Verify and move up the 5th entry');
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(4)
            //     .as('issnToReorder')
            //     .within(row => {
            //         checkIssnLinks(row, '5555-5555');
            //     });
            // cy.get('@issnToReorder')
            //     .find('button[title="Move item up the order"]')
            //     .click();
            // cy.log('Ensure 4th and 5th entries have swapped properly');
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(3)
            //     .within(row => {
            //         checkIssnLinks(row, '5555-5555');
            //     });
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(4)
            //     .within(row => {
            //         checkIssnLinks(row, '4444-4444');
            //     });
            // cy.log('New entry with sherpa placeholder data');
            // cy.get('@issnBlock')
            //     .find('input')
            //     .type('00000000{enter}');
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(5)
            //     .should('contain', '0000-0000')
            //     .find('a')
            //     .should('not.contain', 'SHERPA/RoMEO')
            //     .should('contain', 'Ulrichs');
            // cy.log('New entry with unknown sherpa status');
            // cy.get('@issnBlock')
            //     .find('input')
            //     .type('66666666{enter}');
            // cy.get('@issnBlock')
            //     .find('.ListRow-ISSNvalue')
            //     .eq(6)
            //     .within(row => {
            //         checkIssnLinks(row, '6666-6666');
            //     });
            });

        cy.adminEditCleanup();
    });
});
