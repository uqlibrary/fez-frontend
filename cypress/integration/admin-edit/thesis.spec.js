import { default as recordList } from '../../../src/mock/data/records/publicationTypeListThesis';
import moment from 'moment';

context('Thesis admin edit', () => {
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

    it('should load the nav bar', () => {
        cy.get('.StandardPage form > div > div > div.StandardCard > div > div > h3')
            .as('cards')
            .should('have.length', 7);

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('not.exist');
            });

        cy.get('.StandardPage form button')
            .contains('Submit')
            .should('exist')
            .parent()
            .should('be.enabled');

        cy.wait(1000); // Wait for tabbing init
        cy.get('input[value=tabbed]')
            .should('have.value', 'tabbed')
            .click()
            .should('be.checked');

        cy.get('@cards')
            .should('have.length', 1)
            .should('have.text', 'Bibliographic');
    });

    it('should render Thesis specific fields on the Bibliographic tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(2)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Bibliographic');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Title');
                        cy.get('span span')
                            .eq(0)
                            .should('contain.text', 'Formatted title');
                        cy.get('#cke_editor3')
                            .should('exist');
                        cy.read_ckeditor('editor3')
                            .should(text => {
                                expect(text).to.contain(record.rek_title);
                            });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Language of work');
                        const langCodes = record.fez_record_search_key_language.map(lang => lang.rek_language);
                        cy.get('label[id="Language of work-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', langCodes.join(','))
                            .siblings('[role=button] span')
                            .should('have.length', 0); // If no matching codes found, there is a span present
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Bibliographic');

                        cy.get('[id="Totalpages/Extent"]')
                            .should(
                                'have.value',
                                record.fez_record_search_key_total_pages.rek_total_pages,
                            );

                        cy.get('[placeholder="Publication date"]')
                            .should(
                                'have.value',
                                moment(record.rek_date)
                                    .format('DD/MM/YYYY'),
                            );

                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Abstract / Description');

                        cy.get('label[id="Thesis type-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.rek_genre_type)
                            .siblings('[role=button]')
                            .should('have.text', record.rek_genre_type);

                        cy.get('#Institution-input')
                            .should(
                                'have.value',
                                record.fez_record_search_key_org_name.rek_org_name,
                            );
                        cy.get('#Schoolcentreorinstitute-input')
                            .should(
                                'have.value',
                                record.fez_record_search_key_org_unit_name.rek_org_unit_name,
                            );
                    });

                cy.get('@cards')
                    .eq(3)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Keyword(s)');
                        const keywords = record.fez_record_search_key_keywords.map(item => item.rek_keywords);
                        keywords.forEach((keyword, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', keyword);
                        });
                    });

                cy.get('@cards')
                    .eq(4)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Subject');
                        const subjects = record.fez_record_search_key_subject.map(item => item.rek_subject_lookup);
                        subjects.forEach((subject, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', subject);
                        });
                    });

                cy.get('@cards')
                    .eq(5)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Related publications');
                        const relatedPubs = record.fez_record_search_key_isderivationof.map(
                            item => item.rek_isderivationof_lookup,
                        );
                        relatedPubs.forEach((pub, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', pub);
                        });
                    });
            });

        cy.get('#clear-input')
            .click()
            .parent()
            .parent()
            .parent()
            .children('p')
            .should('have.text', 'This field is required');

        cy.get('.StandardPage form > div:nth-child(2)')
            .within(() => {
                cy.get('.Alert')
                    .should('exist')
                    .find('.alert-text')
                    .should('contain', 'Validation -')
                    .find('li')
                    .should('have.length', 1)
                    .should('contain', 'Enrolling unit is required');
            });

        cy.get('.StandardPage form button')
            .contains('Submit')
            .parent()
            .should('be.disabled');
    });

    it('should render Thesis specific fields on the Author tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(3)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Author details');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Authors');
                        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
                        authors.forEach((person, index) => {
                            cy.get('p')
                                .eq(2 * index)
                                .should('have.text', person);
                        });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Editors');
                        const contributors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
                        contributors.forEach((person, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', person);
                        });
                    });

                cy.get('@cards')
                    .eq(2)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Supervisors');
                        const supervisors = record.fez_record_search_key_supervisor.map(item => item.rek_supervisor);
                        supervisors.forEach((person, index) => {
                            cy.get('p')
                                .eq(index)
                                .should('have.text', person);
                        });
                    });
            });
    });

    it('should render Thesis specific fields on the Additional Information tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(4)
            .within(() => {
                cy.get('h3')
                    .should('have.text', 'Additional information');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Member of collections');
                        cy.get('#Memberofcollections-input-label')
                            .should('contain', 'Member of collections');
                        // prettier-ignore
                        const collections = record.fez_record_search_key_ismemberof.map(
                            item => item.rek_ismemberof_lookup
                        );
                        collections.forEach((collection, index) => {
                            cy.get('[class*="MuiChip-label-"]')
                                .eq(index)
                                .should('have.text', collection);
                        });
                    });

                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Additional information');
                        cy.get('label[id="OA status-label"]')
                            .parent()
                            .find('input[type=hidden]')
                            .should('have.value', record.fez_record_search_key_oa_status.rek_oa_status.toString())
                            .siblings('[role=button]')
                            .should('have.text', record.fez_record_search_key_oa_status.rek_oa_status_lookup);
                        cy.get('span span')
                            .eq(0)
                            .should('have.text', 'Additional notes');
                        cy.get('#cke_editor5')
                            .should('exist');
                        cy.read_ckeditor('editor5')
                            .should(text => {
                                expect(text).to.contain(record.fez_record_search_key_notes.rek_notes);
                            });
                    });
            });
    });

    it('should render Thesis specific fields on the Files tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(5)
            .within(() => {
                cy.get('h3')
                    .eq(0)
                    .should('have.text', 'Files');

                cy.get('.AdminCard')
                    .as('cards')
                    .eq(0)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Files');
                        // No visible files in mock
                    });
                // cy.get('.AdminCard')
                //     .eq(1)
                //     .within(() => {
                //         cy.get('h3')
                //             .should('have.text', 'Advisory statement');
                //         cy.get('span span')
                //             .eq(0)
                //             .should('have.text', 'Advisory statement');
                //         // No advisory statement in mock
                //     });
                cy.get('@cards')
                    .eq(1)
                    .within(() => {
                        cy.get('h4')
                            .should('contain', 'Copyright agreement');
                        cy.get('#deposit-agreement')
                            .should($checkbox => {
                                if (record.rek_copyright === 'on') {
                                    expect($checkbox).to.be.checked;
                                } else {
                                    expect($checkbox).not.to.be.checked;
                                }
                            });
                    });
            });
    });

    it('should render Thesis specific fields on the Security tab', () => {
        cy.get('.StandardPage form .StandardCard')
            .eq(7)
            .within(() => {
                cy.root()
                    .children('div')
                    .children('div')
                    .children('h3')
                    .should('have.text', 'Security');

                cy.get('div:nth-child(1) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should(
                                'have.text',
                                `${record.rek_object_type_lookup} level security - ${record.rek_pid}`,
                            );
                        cy.get('h6')
                            .eq(0)
                            .should('have.text', 'Inherited security policy details');
                        record.fez_record_search_key_ismemberof.forEach((collection, index) => {
                            cy.get('h6')
                                .eq(2 * index + 1)
                                .should('have.text', collection.rek_ismemberof);
                            cy.get('h6')
                                .eq(2 * index + 2)
                                .should('have.text', collection.rek_ismemberof_lookup);
                            cy.get('p')
                                .eq(index)
                                .should('have.text', `Public (${collection.parent.rek_security_policy})`);
                        });
                        if (record.rek_security_inherited) {
                            cy.get('label')
                                .contains('Override inherited security (detailed below)')
                                .parent()
                                .find('input')
                                .should('not.be.checked');
                        }
                    });
                cy.get('div:nth-child(2) > .StandardCard')
                    .within(() => {
                        cy.get('h3')
                            .should('have.text', `Datastream level security - ${record.rek_pid}`);
                        cy.get('h6')
                            .eq(0)
                            .should('have.text', 'Inherited datastream security policy details');
                        cy.get('h6')
                            .eq(5)
                            .should('have.text', 'Override datastream security policy details');
                        cy.get('a')
                            .should('have.length', 22);
                    });
            });
    });
});
