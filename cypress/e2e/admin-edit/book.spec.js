import { default as recordList } from '../../../src/mock/data/records/publicationTypeListBook';
import { default as editedBookList } from '../../../src/mock/data/records/publicationTypeListBookEdited';
import { sherpaRomeo as sherpaMocks } from '../../../src/mock/data/sherpaRomeo';

context('Book admin edit', () => {
    const record = recordList.data[0];

    it('should load expected tabs', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.adminEditCountCards(8);
        cy.adminEditNoAlerts();

        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');

        cy.adminEditTabbedView(false);
        cy.adminEditCountCards(8);
        cy.adminEditCleanup();
    });

    it('should render the different sections as expected', () => {
        cy.loadRecordForAdminEdit(record.rek_pid);
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        cy.log('Bibliographic tab');
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4').should('contain', 'Title');
                const langCodes = record.fez_record_search_key_language_of_title.map(
                    lang => lang.rek_language_of_title,
                );
                cy.get('[data-testid=rek-language-of-title-input]')
                    .should('have.value', langCodes.join(','))
                    .siblings('[role=button] span')
                    .should('have.length', 0); // If no matching codes found, there is a span present
                cy.get('[data-testid=rek-native-script-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_native_script_title.rek_native_script_title,
                );
                cy.get('[data-testid=rek-roman-script-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_roman_script_title.rek_roman_script_title,
                );
                cy.get('[data-testid=rek-translated-title-input]').should(
                    'have.value',
                    record.fez_record_search_key_translated_title.rek_translated_title,
                );
            });

        cy.get('@bibliographicTab')
            .find('[data-testid=rek-place-of-publication-input]')
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
            'https://resolver.library.uq.edu.au/openathens/redir?qurl=' +
            encodeURIComponent('https://ulrichsweb.serialssolutions.com/title/');

        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.get('[data-testid=bibliographic-section-content]').as('bibliographicTab');

        const checkIssnLinks = (container, issn) => {
            const sherpaLink =
                (sherpaMocks.find(item => item.srm_issn === issn) || {}).srm_journal_link ||
                sherpaMocks[0].srm_journal_link;
            cy.wrap(container)
                .should('contain', issn)
                // Make sure the data has loaded...
                .should('contain', 'SHERPA/RoMEO')
                .should('contain', 'Ulrichs')
                .get('#sherparomeo-link')
                .should('have.attr', 'href', sherpaLink);
            let ulrichsID = issn.replace('-', '');
            switch (issn) {
                case '0302-9743':
                    ulrichsID = '122527';
                    break;
                case '1611-3349':
                    ulrichsID = '339301';
                    break;
                default:
                    break;
            }
            cy.get('#ulrichs-link').should('have.attr', 'href', `${ulrichsLinkPrefix}${ulrichsID}`);
        };

        cy.get('@bibliographicTab').within(() => {
            cy.get('.AdminCard')
                .contains('h4', 'ISSN')
                .parents('.AdminCard')
                .as('issnBlock');
            cy.log('Find existing entry');
            cy.get('#rek-issn-list-row-0').within(row => {
                checkIssnLinks(row, '0302-9743');
            });

            cy.log('Find existing entry with placeholder data');
            cy.get('#rek-issn-list-row-1')
                .should('contain', '1611-3349')
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
                    cy.get('button[aria-label="Edit this item"]').click();
                });
            cy.log('Edit issn to a different one with valid data');
            cy.get('@issnBlock')
                .find('input')
                .type('{backspace}0{enter}');
            cy.get('#rek-issn-list-row-1').within(row => {
                checkIssnLinks(row, '1611-3340');
            });
            cy.log('Add a 3rd entry without match in API');
            cy.get('@issnBlock')
                .find('input')
                .type('11111111{enter}');
            cy.get('#rek-issn-list-row-2')
                .should('contain', '1111-1111')
                // Mock returns no sherpa/ulrichs data for issn 1111-1111 or 2222-2222.
                .should('not.contain', 'SHERPA/RoMEO')
                .should('not.contain', 'Ulrichs');
            cy.viewport(1000, 1000);
            cy.log('Add 4th entry with match in API');
            cy.get('@issnBlock')
                .find('input')
                .type('33333333{enter}');
            cy.get('#rek-issn-list-row-3').within(row => {
                checkIssnLinks(row, '3333-3333');
                cy.get('span > a')
                    .eq(1)
                    .should('have.attr', 'title', 'Lecture Notes in Computer Science')
                    .should(
                        'have.attr',
                        'aria-label',
                        'Source publisher name/place and alternate ISSNs in a new window',
                    );
            });
            cy.get('#rek-issn-list-row-3')
                .find('button[aria-label="Edit this item"]')
                .click();
            cy.log('Edit the 4th entry');
            cy.get('@issnBlock')
                .find('input')
                .type('{selectall}{del}44444444{enter}');
            cy.get('#rek-issn-list-row-3')
                .should('not.contain', '3333-3333')
                .within(row => {
                    checkIssnLinks(row, '4444-4444');
                });
            cy.log('Add a 5th entry');
            cy.get('@issnBlock')
                .find('input')
                .type('55555555{enter}');
            cy.log('Verify and move up the 5th entry');
            cy.get('#rek-issn-list-row-4').within(row => {
                checkIssnLinks(row, '5555-5555');
            });
            cy.get('#rek-issn-list-row-4-move-up').click();
            cy.log('Ensure 4th and 5th entries have swapped properly');
            cy.get('#rek-issn-list-row-3').within(row => {
                checkIssnLinks(row, '5555-5555');
            });
            cy.get('#rek-issn-list-row-4').within(row => {
                checkIssnLinks(row, '4444-4444');
            });
            cy.log('New entry with sherpa placeholder data');
            cy.get('@issnBlock')
                .find('input')
                .type('00000000{enter}');
            cy.get('#rek-issn-list-row-5')
                .should('contain', '0000-0000')
                .find('a')
                .should('not.contain', 'SHERPA/RoMEO')
                .should('contain', 'Ulrichs');
            cy.log('New entry with unknown sherpa status');
            cy.get('@issnBlock')
                .find('input')
                .type('66666666{enter}');
            cy.get('#rek-issn-list-row-6').within(row => {
                checkIssnLinks(row, '6666-6666');
            });
        });

        cy.adminEditCleanup();
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
    it('should be available for this work type', () => {
        cy.assertAffiliationsAllowed({
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 2,
            allowed: true,
        });
    });
});
