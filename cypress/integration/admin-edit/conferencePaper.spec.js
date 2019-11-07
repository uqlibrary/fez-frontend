import { default as recordList } from '../../../src/mock/data/records/publicationTypeListConferencePaper';

context('Conference Paper admin edit', () => {
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
                    .should('not.exist');
                cy.get('button')
                    .should('be.enabled');
            });

        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed') // force the get to wait for the element
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Bibliographic tab', () => {
        cy.waitForCkeditorToHaveLoaded();
        cy.get('.StandardPage form > div > div:nth-child(3)')
            .as('bibliographicTab')
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
                        cy.get('#Nativescriptconferencename')
                            .should(
                                'have.value',
                                // prettier-ignore
                                record.fez_record_search_key_native_script_conference_name
                                    .rek_native_script_conference_name,
                            );
                        cy.get('#Romanscriptconferencename')
                            .should(
                                'have.value',
                                // prettier-ignore
                                record.fez_record_search_key_roman_script_conference_name
                                    .rek_roman_script_conference_name,
                            );
                        cy.get('#Translatedconferencename')
                            .should(
                                'have.value',
                                record.fez_record_search_key_translated_conference_name.rek_translated_conference_name,
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
                        const langCodes = record.fez_record_search_key_language_of_proceedings_title.map(
                            lang => lang.rek_language_of_proceedings_title,
                        );
                        cy.get('label[id="Language of proceedings title-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', langCodes.join(','))
                            .siblings('[role=button] span')
                            .should('have.length', 0);
                        cy.get('#Nativescriptproceedingstitle')
                            .should(
                                'have.value',
                                // prettier-ignore
                                record.fez_record_search_key_native_script_proceedings_title
                                    .rek_native_script_proceedings_title,
                            );
                        cy.get('#Romanscriptproceedingstitle')
                            .should(
                                'have.value',
                                // prettier-ignore
                                record.fez_record_search_key_roman_script_proceedings_title
                                    .rek_roman_script_proceedings_title,
                            );
                        cy.get('#Translatedproceedingstitle')
                            .should(
                                'have.value',
                                // prettier-ignore
                                record.fez_record_search_key_translated_proceedings_title
                                    .rek_translated_proceedings_title,
                            );
                    });

                cy.get('div:nth-child(6) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Journal name');
                        cy.get('#Journalname')
                            .should(
                                'have.value',
                                record.fez_record_search_key_journal_name.rek_journal_name,
                            );
                        const langCodes = record.fez_record_search_key_language_of_journal_name.map(
                            lang => lang.rek_language_of_journal_name,
                        );
                        cy.get('label[id="Language of journal name-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', langCodes.join(','))
                            .siblings('[role=button] span')
                            .should('have.length', 0);
                        cy.get('#Nativescriptjournalname')
                            .should(
                                'have.value',
                                record.fez_record_search_key_native_script_journal_name.rek_native_script_journal_name,
                            );
                        cy.get('#Romanscriptjournalname')
                            .should(
                                'have.value',
                                record.fez_record_search_key_roman_script_journal_name.rek_roman_script_journal_name,
                            );
                        cy.get('#Translatedjournalname')
                            .should(
                                'have.value',
                                record.fez_record_search_key_translated_journal_name.rek_translated_journal_name,
                            );
                    });

                cy.get('div:nth-child(9) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', 'Bibliographic');
                        cy.get('#Series-input')
                            .should('have.value', record.fez_record_search_key_series.rek_series);
                        cy.get('#Articlenumber')
                            .should(
                                'have.value',
                                record.fez_record_search_key_article_number.rek_article_number,
                            );
                    });
            });

        const errorMessages = [
            'Conference name is required',
            'Conference location is required',
            'Conference dates are required',
            'Journal name is required',
        ];
        ['#Conferencename', '#Conferencelocation', '#Conferencedates', '#Journalname'].forEach((selector, index) => {
            cy.get('@bibliographicTab')
                .find(selector)
                .clear();
            cy.get('.StandardPage form > div > div:nth-child(9) .Alert .alert-text li')
                .should('have.length', index + 1)
                .eq(index)
                .should('have.text', errorMessages[index]);
        });
    });
});
