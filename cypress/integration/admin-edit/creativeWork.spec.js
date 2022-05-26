import { default as recordList } from '../../../src/mock/data/records/publicationTypeListCreativeWork';

context('Creative Work admin edit', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('tabs for Creative entry should also include NTRO', () => {
        cy.adminEditCountCards(9);
        cy.adminEditNoAlerts();
        cy.adminEditTabbedView();
        cy.adminEditCheckDefaultTab('Bibliographic');
    });

    it('should render the Bibliographic section as expected', () => {
        cy.get('[data-testid=bibliographic-section-content]')
            .as('bibliographicTab')
            .within(() => {
                cy.get('h4').should('contain', 'Related publications');
                const pubList = record.fez_record_search_key_isderivationof.map(item => item.rek_isderivationof_lookup);
                pubList.forEach((pub, index) => {
                    cy.get(`[data-testid=rek-isderivationof-list-row-${index}]`).should('have.text', pub);
                });
            });
    });

    it('should render the Additional Information section as expected', () => {
        cy.get('[data-testid=admin-section-content]')
            .as('adminTab')
            .within(() => {
                cy.get('h4').should('contain', 'Additional information');
                cy.get('[data-testid=rek-license-input]')
                    .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                    .siblings('[role=button]')
                    .invoke('text')
                    .should('equal', record.fez_record_search_key_license.rek_license_lookup);
                cy.get('[data-testid="rek-content-indicator-select"]').should(
                    'have.text',
                    'Scholarship of Teaching and Learning',
                );
            });
    });

    // it('in the NTRO section, should render Audience size section as expected', () => {
    //     cy.adminEditTabbedView();
    //     cy.get('[data-testid="ntro-tab"]').click();
    //     cy.get('[data-testid=ntro-section-content]')
    //         .as('NTRO')
    //         .within(() => {
    //             // https://www.pivotaltracker.com/story/show/173121745
    //             cy.get('.AdminCard')
    //                 .eq(0)
    //                 .within(() => {
    //                     cy.get('h4').should('contain', 'Audience size');
    //                     cy.get('[data-testid=rek-audience-size-select]')
    //                         .should('have.text', record.fez_record_search_key_audience_size.rek_audience_size_lookup)
    //                         .get('[data-testid=rek-audience-size-input]')
    //                         .should(
    //                             'have.value',
    //                             record.fez_record_search_key_audience_size.rek_audience_size.toString(),
    //                         );
    //                 });
    //         });
    // });

    function assertChangeSelectFromTo(item, changeFrom, changeTo) {
        cy.log(`expect ${item}-select to change from '${changeFrom}' to '${changeTo}'`);
        cy.waitUntil(() => cy.get(`[data-testid="${item}-select"]`).should('exist'));
        if (changeFrom === '') {
            cy.log('look for an unselected item');
            cy.get(`[data-testid="${item}-select"]`)
                .then(text => {
                    expect(text).to.have.lengthOf(1); // special zero length string
                })
                .click();
        } else {
            cy.log('look for a selected item', changeFrom);
            cy.get(`[data-testid="${item}-select"]`)
                .should('exist')
                .should('contain', changeFrom)
                .click();
        }
        cy.waitUntil(() => cy.get(`[data-testid="${item}-options"]`).should('exist'));
        cy.get(`[data-testid="${item}-options"]`)
            .contains(changeTo)
            .click();
        cy.get(`[data-testid="${item}-select"]`).should('contain', changeTo);
    }

    function clickFormSaveButton(label) {
        const button = 'button[data-testid="rek-significance-add"]';
        cy.waitUntil(() => cy.get(button).should('exist'));
        cy.get(button)
            .should('contain', label)
            .click();
    }

    function clickFormClearButton() {
        cy.get('button[data-testid="rek-significance-clear"]')
            .should('contain', 'Cancel')
            .click();
    }

    function clickRowEditButton(rowId) {
        const editButton = rowId => `[data-testid="rek-significance-list-row-${rowId}-edit"]`;
        cy.waitUntil(() => cy.get(editButton(rowId)).should('exist'));
        cy.get(editButton(rowId)).click();
        // cy.get('button[data-testid="rek-significance-add"]').should('contain', 'UPDATE');
    }

    function clickButtonShowForm() {
        cy.get('[data-testid="rek-significance-showhidebutton"]')
            .should('exist')
            .click();
    }

    const statementList = {
        0: {
            statementContains: 'This is an online lecture',
            significance: 'Major',
            newSignificance: 'Minor',
            newText: 'Changed content',
        },
        1: {
            statementContains: 'Missing',
            significance: '',
        },
        2: {
            statementContains: 'Missing',
            significance: 'Minor',
        },
    };

    it('in the NTRO section, the significance and statement list rows have the correct content', () => {
        cy.adminEditTabbedView();
        cy.get('[data-testid="ntro-tab"]').click();
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('h4').should('contain', 'Scale/Significance of work & Creator research statement');

                        record.fez_record_search_key_significance
                            .map(item => item.rek_significance_lookup)
                            .forEach((significance, index) => {
                                cy.get(`[data-testid="rek-significance-list-row-${index}"]`)
                                    .find('p')
                                    .eq(0)
                                    .should('have.text', significance || 'Missing');
                            });

                        record.fez_record_search_key_creator_contribution_statement
                            .map(item => item.rek_creator_contribution_statement)
                            .forEach((contribution, index) => {
                                const reducedContributionStatement = [/<p>/, /<\/p>/].reduce(
                                    (statement, regex) => statement.replace(regex, ''),
                                    contribution,
                                );
                                cy.get(`[data-testid="rek-significance-list-row-${index}"]`)
                                    .find('span')
                                    .eq(0)
                                    .should('contain', reducedContributionStatement);
                            });
                    });
            });
    });

    it('in the NTRO section, the user can add an entry to significance and statement ', () => {
        cy.adminEditTabbedView();
        cy.get('[data-testid="ntro-tab"]').click();
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', 3);

                        clickButtonShowForm();
                        cy.get('button[data-testid="rek-significance-add"]')
                            .should('exist')
                            .should('contain', 'ADD');
                        cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                        cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                            expect(text).to.be.empty;
                        });
                    });
            });

        // popup appears at foot of page, outside Admin section
        assertChangeSelectFromTo('rek-significance', '', 'Minor'); // was unselected

        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        const newContributionStatementText = 'new entry';
                        cy.typeCKEditor('rek-creator-contribution-statement', newContributionStatementText);
                        clickFormSaveButton('ADD');
                        // the newly added item appears correctly
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', 4);
                        cy.get('[data-testid="rek-significance-list-row-3"]')
                            .find('span')
                            .eq(0)
                            .should('contain', newContributionStatementText);
                        cy.get('[data-testid="rek-significance-list-row-3"]')
                            .find('p')
                            .eq(0)
                            .should('have.text', 'Minor');
                        // the show hide status is correct
                        cy.waitUntil(() => cy.get('[data-testid="rek-significance-showhidebutton"]').should('exist'));
                        cy.get('[data-testid="rek-significance-form"]').should('not.exist');
                    });
            });
    });

    // bug fix: the values of the previously edited entry were preloaded when adding
    it('in the NTRO section, the add form loads empty after using the edit form', () => {
        cy.adminEditTabbedView();
        cy.get('[data-testid="ntro-tab"]').click();
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        const rowId = 0;
                        clickRowEditButton(rowId);

                        cy.get('button[data-testid="rek-significance-add"]').should('contain', 'UPDATE');
                        cy.get('[data-testid="rek-significance-select"]').should(
                            'contain',
                            statementList[rowId].significance,
                        );
                        cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                            expect(text).to.contain(statementList[rowId].statementContains);
                        });

                        clickFormClearButton();

                        // the add button now gets a blank form
                        clickButtonShowForm();

                        cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                            expect(text).to.be.empty;
                        });
                        cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                    });
            });
    });

    it('in the NTRO section, editing loads the significance and statement values into the form correctly', () => {
        cy.adminEditTabbedView();
        cy.get('[data-testid="ntro-tab"]').click();
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        for (const [rowId, value] of Object.entries(statementList)) {
                            clickRowEditButton(rowId);

                            cy.get('button[data-testid="rek-significance-add"]').should('contain', 'UPDATE');
                            cy.get('[data-testid="rek-significance-select"]').should('contain', value.significance);
                            cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                                expect(text).to.contain(value.statementContains);
                            });
                            if (rowId === 0) {
                                // the cancel button clears the form when loaded from edit
                                clickFormClearButton();
                                cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                                cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                                    expect(text).to.be.empty;
                                });
                            }
                        }
                    });
            });
    });

    it('in the NTRO section, the user can edit a significance and statement row', () => {
        cy.adminEditTabbedView();
        cy.get('[data-testid="ntro-tab"]').click();
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        clickRowEditButton(0);
                        cy.typeCKEditor('rek-creator-contribution-statement', statementList[0].newText);
                    });
            });

        // popup appears at foot of page, outside Admin section
        assertChangeSelectFromTo('rek-significance', statementList[0].significance, statementList[0].newSignificance);

        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        clickFormSaveButton('UPDATE');
                        cy.get('[data-testid="rek-significance-list-row-0"]')
                            .find('p')
                            .eq(0)
                            .should('have.text', statementList[0].newSignificance);
                        cy.get('[data-testid="rek-significance-list-row-0"]')
                            .find('span')
                            .eq(0)
                            .should('contain', statementList[0].newText);
                    });
            });
    });

    it('in the NTRO section, the clear button clears the significance and statement add form', () => {
        cy.adminEditTabbedView();
        cy.get('[data-testid="ntro-tab"]').click();
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', 3);

                        // the form is initially hidden
                        cy.get('[data-testid="rek-significance-form"]').should('not.exist');

                        clickButtonShowForm();
                        cy.waitUntil(() => cy.get('[data-testid="rek-significance-form"]').should('exist'));
                        cy.get('[data-testid="rek-significance-showhidebutton"]').should('not.exist');

                        // enter some data in the form
                        cy.typeCKEditor('rek-creator-contribution-statement', 'New content');
                    });
            });

        // popup appears at foot of page, outside Admin section
        assertChangeSelectFromTo('rek-significance', '', 'Minor');

        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(0)
                    .within(() => {
                        // clear the form
                        clickFormClearButton();

                        // the add form is cleared and the entered values have NOT appeared in the list
                        cy.get('[data-testid="rek-significance-list"]')
                            .children()
                            .should('have.length', 3);
                    });
            });
    });

    it('should render the NTRO quality indicators section as expected', () => {
        cy.get('[data-testid=ntro-section-content]')
            .as('NTRO')
            .within(() => {
                cy.get('.AdminCard')
                    .eq(1)
                    .within(() => {
                        cy.get('h4').should('contain', 'Quality indicators');
                        const qualityIndicators = record.fez_record_search_key_quality_indicator;
                        cy.get('[data-testid="rek-quality-indicator-input"]')
                            .should('have.value', qualityIndicators.map(item => item.rek_quality_indicator).join(','))
                            .get('[data-testid=rek-quality-indicator-select]')
                            .should(
                                'have.text',
                                qualityIndicators.map(item => item.rek_quality_indicator_lookup).join(', '),
                            );
                    });
            });
    });
});
