import { default as recordList } from '../../../src/mock/data/records/publicationTypeListCreativeWork';

context('Creative Work admin edit, general', () => {
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

    context('in the Bibliographic section', () => {
        it('should render as expected', () => {
            cy.get('[data-testid=bibliographic-section-content]')
                .as('bibliographicTab')
                .within(() => {
                    cy.get('h4').should('contain', 'Related publications');
                    const pubList = record.fez_record_search_key_isderivationof.map(
                        item => item.rek_isderivationof_lookup,
                    );
                    pubList.forEach((pub, index) => {
                        cy.get(`[data-testid=rek-isderivationof-list-row-${index}]`).should('have.text', pub);
                    });
                });
        });
    });
    context('in the Additional section', () => {
        it('should render  as expected', () => {
            cy.get('[data-testid=admin-section-content]')
                .as('adminTab')
                .within(() => {
                    cy.get('h4').should('contain', 'Additional information');
                    cy.get('[data-testid=rek-license-input]')
                        .should('have.value', record.fez_record_search_key_license.rek_license.toString())
                        .siblings('[role=combobox]')
                        .invoke('text')
                        .should('equal', record.fez_record_search_key_license.rek_license_lookup);
                    cy.get('[data-testid="rek-content-indicator-select"]').should(
                        'have.text',
                        'Scholarship of Teaching and Learning',
                    );
                });
        });
    });
    context('in the NTRO section', () => {
        function rowAuthorDisplaysAs(rowId, authorName) {
            const ordinalLabelList = ['First', 'Second', 'Third', 'Fourth'];
            const ordinalLabel = ordinalLabelList[rowId];
            cy.get(`[data-testid="scalesignif-author-${rowId}"]`).should('contain', authorName);
            cy.get(`[data-testid="scalesignif-author-${rowId}"]`).should('contain', ordinalLabel);
        }

        function rowScaleDisplaysAs(rowId, significanceLabel) {
            cy.get(`[data-testid="scale-item-${rowId}"]`).should('have.text', significanceLabel);
        }

        function rowStatementDisplaysAs(rowId, statement) {
            cy.get(`[data-testid="statement-item-${rowId}"]`).should('contain', statement);
        }

        function clickFormSaveButton(label) {
            const button = 'button[data-testid="rek-significance-add"]';
            cy.waitUntil(() => cy.get(button).should('exist'));
            cy.get(button)
                .should('contain', label)
                .click();
        }

        function clickFormCancelButton() {
            cy.get('button[data-testid="rek-significance-clear"]')
                .should('contain', 'Cancel')
                .click();
        }

        function clickRowEditButton(rowId) {
            const editButton = rowId => `[data-testid="rek-significance-list-row-${rowId}-edit"]`;
            cy.waitUntil(() => cy.get(editButton(rowId)).should('exist'));
            cy.get(editButton(rowId)).click();
            cy.get('[data-testid="rek-significance-form"]')
                .should('exist')
                .scrollIntoView();
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
                                .should(
                                    'have.value',
                                    qualityIndicators.map(item => item.rek_quality_indicator).join(','),
                                )
                                .get('[data-testid=rek-quality-indicator-select]')
                                .should(
                                    'have.text',
                                    qualityIndicators.map(item => item.rek_quality_indicator_lookup).join(', '),
                                );
                        });
                });
        });

        it('loads the correct content in the significance and statement list rows', () => {
            cy.adminEditTabbedView();
            cy.get('[data-testid="ntro-tab"]').click();
            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            cy.get('h4').should('contain', 'Scale/Significance of work & Creator research statement');

                            record.fez_record_search_key_author
                                .map(item => item.rek_author)
                                .forEach((author, index) => rowAuthorDisplaysAs(index, author));

                            record.fez_record_search_key_significance
                                .map(item => item.rek_significance_lookup)
                                .forEach((significance, index) => rowScaleDisplaysAs(index, significance || 'Missing'));

                            record.fez_record_search_key_creator_contribution_statement
                                .map(item => item.rek_creator_contribution_statement)
                                .forEach((contribution, index) => {
                                    const reducedContributionStatement = [/<p>/, /<\/p>/].reduce(
                                        (statement, regex) => statement.replace(regex, ''),
                                        contribution,
                                    );
                                    rowStatementDisplaysAs(index, reducedContributionStatement);
                                });
                        });
                });
        });

        it('can add an entry to significance and statement ', () => {
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
                            cy.get('button[data-testid="rek-significance-add"]').should('contain', 'ADD');
                            cy.get('[data-testid="rek-significance-showhidebutton"]')
                                .parent()
                                .should('not.be.visible');

                            cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                            cy.assertCKEditorEmpty('rek-creator-contribution-statement');
                        });
                });

            // popup appears at foot of page, outside Admin section
            cy.assertChangeSelectFromTo('rek-significance', '', 'Minor'); // was unselected

            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            const newContributionStatementText = 'new entry';
                            cy.typeCKEditor('rek-creator-contribution-statement', newContributionStatementText);
                            clickFormSaveButton('ADD');
                            // the show hide status is correct
                            cy.waitUntil(() =>
                                cy.get('[data-testid="rek-significance-showhidebutton"]').should('be.visible'),
                            );
                            cy.get('[data-testid="rek-significance-form"]').should('not.be.visible');
                            // the newly added item appears correctly
                            cy.get('[data-testid="rek-significance-list"]')
                                .children()
                                .should('have.length', 4);
                            rowStatementDisplaysAs(3, newContributionStatementText);
                            rowScaleDisplaysAs(3, 'Minor');

                            // try editing after adding
                        });
                });
        });

        it('loads the add form empty after cancelling out of the edit form', () => {
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

                            clickFormCancelButton();
                            cy.get('[data-testid="rek-significance-form"]').should('not.be.visible');
                            cy.get('[data-testid="rek-significance-showhidebutton"]')
                                .parent()
                                .should('be.visible');

                            // the add button now gets a blank form
                            clickButtonShowForm();
                            cy.get('button[data-testid="rek-significance-add"]').should('contain', 'ADD');
                            cy.get('[data-testid="rek-significance-showhidebutton"]')
                                .parent()
                                .should('not.be.visible');

                            // the fields are empty ready for entry
                            cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                            cy.assertCKEditorEmpty('rek-creator-contribution-statement');
                        });
                });
        });

        it('loads the significance and statement values into the edit form correctly', () => {
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

                                // the form loads correctly
                                cy.get('button[data-testid="rek-significance-add"]').should('contain', 'UPDATE');
                                if (['Minor', 'Major'].includes(value.significance)) {
                                    cy.get('[data-testid="rek-significance-select"]').should(
                                        'contain',
                                        value.significance,
                                    );
                                } else {
                                    // a display of 'Missing' will load the selector with the message below
                                    cy.get('[data-testid="rek-significance-label"]').should(
                                        'contain',
                                        'Scale/Significance of work',
                                    );
                                }
                                if (value.statementContains === 'Missing') {
                                    cy.assertCKEditorEmpty('rek-creator-contribution-statement');
                                } else {
                                    cy.readCKEditor('rek-creator-contribution-statement').then(text => {
                                        expect(text).to.contain(value.statementContains);
                                    });
                                }

                                if (rowId === 0) {
                                    // the cancel button clears the form when loaded from edit
                                    clickFormCancelButton();
                                    cy.get('[data-testid="rek-significance-form"]').should('not.be.visible');
                                    cy.get('[data-testid="rek-significance-showhidebutton"]')
                                        .parent()
                                        .should('be.visible');

                                    cy.get('[data-testid="rek-significance-select"]').should('contain', '');
                                    cy.assertCKEditorEmpty('rek-creator-contribution-statement');
                                }
                            }
                        });
                });
        });

        it('can edit an existing significance and statement row', () => {
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
            cy.assertChangeSelectFromTo(
                'rek-significance',
                statementList[0].significance,
                statementList[0].newSignificance,
            );

            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            clickFormSaveButton('UPDATE');
                            rowScaleDisplaysAs(0, statementList[0].newSignificance);
                            rowStatementDisplaysAs(0, statementList[0].newText);
                            rowAuthorDisplaysAs(0, 'Ashkanasy');
                            rowAuthorDisplaysAs(1, 'Belanger');
                        });
                });

            // save does not cause crash
            cy.get('[data-testid="submit-admin-top"]').click();
            // Confirmation message
            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', 'Work has been updated');
        });

        it('can edit a significance and statement row where that was previously "Missing"', () => {
            cy.adminEditTabbedView();
            cy.get('[data-testid="ntro-tab"]').click();
            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            clickRowEditButton(1);
                            cy.typeCKEditor('rek-creator-contribution-statement', statementList[0].newText);
                        });
                });

            // popup appears at foot of page, outside Admin section
            cy.assertChangeSelectFromTo('rek-significance', '', statementList[0].newSignificance);

            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            clickFormSaveButton('UPDATE');
                            rowScaleDisplaysAs(1, statementList[0].newSignificance);
                            rowStatementDisplaysAs(1, statementList[0].newText);
                            rowAuthorDisplaysAs(1, 'Belanger');
                        });
                });

            // save does not cause crash
            cy.get('[data-testid="submit-admin-top"]').click();
            // Confirmation message
            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', 'Work has been updated');
        });

        it('can reorder the scale-statement row set', () => {
            cy.adminEditTabbedView();
            cy.get('[data-testid="ntro-tab"]').click();
            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            cy.get('h4').should('contain', 'Scale/Significance of work & Creator research statement');

                            rowAuthorDisplaysAs(0, 'Ashkanasy');
                            rowAuthorDisplaysAs(1, 'Belanger');
                            rowAuthorDisplaysAs(2, 'Bernal');

                            cy.get('[data-testid="rek-significance-list-row-1-move-down"]')
                                .should('exist')
                                .click();

                            // note order change
                            rowAuthorDisplaysAs(0, 'Ashkanasy');
                            rowAuthorDisplaysAs(1, 'Bernal');
                            rowAuthorDisplaysAs(2, 'Belanger');

                            cy.get('[data-testid="rek-significance-list-row-1-move-up"]')
                                .should('exist')
                                .click();

                            rowAuthorDisplaysAs(0, 'Bernal');
                            rowAuthorDisplaysAs(1, 'Ashkanasy');
                            rowAuthorDisplaysAs(2, 'Belanger');
                        });
                });
        });

        it('can edit the scale-statement row set then be reordered and the record is still updated', () => {
            cy.adminEditTabbedView();
            cy.get('[data-testid="ntro-tab"]').click();
            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            clickRowEditButton(1);
                            cy.typeCKEditor('rek-creator-contribution-statement', statementList[0].newText);
                        });
                });

            // popup appears at foot of page, outside Admin section
            cy.assertChangeSelectFromTo('rek-significance', '', statementList[0].newSignificance);

            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            clickFormSaveButton('UPDATE');
                            rowScaleDisplaysAs(1, statementList[0].newSignificance);
                            rowStatementDisplaysAs(1, statementList[0].newText);
                            rowAuthorDisplaysAs(1, 'Belanger');
                        });
                });

            rowAuthorDisplaysAs(0, 'Ashkanasy');
            rowAuthorDisplaysAs(1, 'Belanger');
            rowAuthorDisplaysAs(2, 'Bernal');

            cy.get('[data-testid="rek-significance-list-row-1-move-down"]')
                .should('exist')
                .click();

            // note order change
            rowAuthorDisplaysAs(0, 'Ashkanasy');
            rowAuthorDisplaysAs(1, 'Bernal');
            rowAuthorDisplaysAs(2, 'Belanger');

            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            rowScaleDisplaysAs(2, statementList[0].newSignificance);
                            rowStatementDisplaysAs(2, statementList[0].newText);
                        });
                });

            // save does not cause crash
            cy.get('[data-testid="submit-admin-top"]').click();
            // Confirmation message
            cy.get('[role=dialog]')
                .should('exist')
                .find('h2')
                .should('contain', 'Work has been updated');
        });

        it('can clear the significance and statement add form wih the Cancel button', () => {
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
                            cy.get('[data-testid="rek-significance-form"]').should('not.be.visible');

                            clickButtonShowForm();
                            cy.get('button[data-testid="rek-significance-add"]').should('contain', 'ADD');
                            cy.get('[data-testid="rek-significance-showhidebutton"]')
                                .parent()
                                .should('not.be.visible');

                            // enter some data in the form
                            cy.typeCKEditor('rek-creator-contribution-statement', 'New content');
                        });
                });

            // popup appears at foot of page, outside Admin section
            cy.assertChangeSelectFromTo('rek-significance', '', 'Minor');

            cy.get('[data-testid=ntro-section-content]')
                .as('NTRO')
                .within(() => {
                    cy.get('.AdminCard')
                        .eq(0)
                        .within(() => {
                            // clear the form & the form hides and add button reappears
                            clickFormCancelButton();
                            cy.get('[data-testid="rek-significance-form"]').should('not.be.visible');
                            cy.get('[data-testid="rek-significance-showhidebutton"]')
                                .parent()
                                .should('be.visible');

                            // the add form is cleared and the entered values have NOT appeared in the list
                            cy.get('[data-testid="rek-significance-list"]')
                                .children()
                                .should('have.length', 3);
                        });
                });
        });
    });
});
