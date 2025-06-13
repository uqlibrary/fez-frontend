import records from '../../src/mock/data/records/internalTitleSearchList';

context('Search', () => {
    // const searchLocale = componentsLocale.components.searchComponent;
    const cleanExtraSpaces = $string => $string.replace(/\s+/g, ' ').trim();
    const xs = 320;
    const sm = 600;
    const md = 960;
    const xl = 1600;
    const filterByTop = top => {
        return function _() {
            return this.offsetTop === top;
        };
    };

    beforeEach(() => {
        cy.visit('/records/search');
    });

    it('Doing a basic search to advanced search', () => {
        // Perform a basic search
        cy.get('[data-testid=simple-search-input]')
            .should(
                'have.attr',
                'aria-label',
                // searchLocale.ariaInputLabel
                'Enter your search query to search eSpace and then press Enter',
            )
            .closest('[class*="MuiFormControl-root"]')
            // .contains('label', searchLocale.searchBoxPlaceholder);
            .contains('label', 'Search eSpace');

        cy.get('[data-testid=simple-search-input]').type('cats and dogs{enter}');
        cy.get('[data-testid="search-records-results"]').should('contain', 'Displaying works 1 to 7 of 7 total works.');
        cy.get('.StandardPage > div > div > div:nth-of-type(3) > div > div > div').should('contain', 'Refine results');

        // Click through to advanced search UI
        cy.get('[data-testid=show-advanced-search]')
            .should('contain', 'Advanced search')
            .should('have.attr', 'aria-label', 'Click to switch to Advanced search')
            .click();
        cy.get('#advancedSearchForm h5').should('contain', 'Advanced search');
        cy.get('[data-testid=any-field-input]')
            .should('have.value', 'cats and dogs')
            .type("{home}it's raining ");
        cy.contains('label > span:nth-child(2)', 'Open access')
            .get('#advanced-search-open-access')
            .should('have.attr', 'aria-label', 'Check to search for open access / full text works');
        cy.contains('label', 'Open access').click();
        cy.contains('button', 'Add another field')
            .should('have.attr', 'aria-label', 'Click to add another advanced search field')
            .click();
        cy.get('.content-container').scrollTo('top');
        cy.contains('Select a field')
            .closest('[class*="MuiInput-root"]')
            .should(
                'have.attr',
                'aria-label',
                'Click to select a field to search from the list - Select a field currently selected',
            )
            .siblings('p')
            .contains('Please select a field to search');
        cy.contains('Select a field').click();
        // Select author from the field dropdown
        cy.contains('#field-type-options li', 'Author Name').click();
        cy.get('[data-testid=advanced-search]')
            .should('be.disabled')
            .should('have.text', 'Search');
        cy.get('[data-testid=rek-author-input]').type('Ky Lane{enter}');
        cy.get('[data-testid=advanced-search]').should('not.be.disabled');
        // Add a set of collections to search from
        cy.contains('button', 'Add another field').click();
        cy.contains('Select a field').click();
        cy.contains('#field-type-options li', 'Collection').click();
        cy.get('[data-testid=advanced-search]').should('be.disabled');
        cy.get('[data-testid=rek-ismemberof-input]').click();
        cy.contains('[data-testid=rek-ismemberof-options] li', '16th Australasian Fluid Mechanics Conference').click();
        cy.get('[data-testid=rek-ismemberof-input]').click();
        cy.contains(
            '[data-testid=rek-ismemberof-options] li',
            '2004 Higher Education Research Data Collection',
        ).click();
        cy.get('[data-testid=advanced-search-caption]').should($caption => {
            expect(cleanExtraSpaces($caption.text())).to.equal(
                "Any fieldcontainsit's raining cats and dogsANDAuthor NamecontainsKy LaneANDCollectionis one ofUQ:120743 or UQ:217410ANDisopen access/full text",
            );
        });
        cy.get('[data-testid=advanced-search]')
            .should('not.be.disabled')
            .click();
        cy.get('[data-testid="search-records-loading"]')
            .should('exist')
            .should('contain', 'Searching for works');
        cy.get('[data-testid="search-records-results"]').contains('Displaying works 1 to 7 of 7 total works.');
    });

    context('Simple search with back and forward buttons pressed', () => {
        it('should update the queryString and make API call when going back and forward on a search', () => {
            // simple search input field
            const catSearchString =
                '?searchQueryParams%5Ball%5D=cat&page=1&pageSize=20&sortBy=score&sortDirection=Desc';
            const dogSearchString =
                '?searchQueryParams%5Ball%5D=dog&page=1&pageSize=20&sortBy=score&sortDirection=Desc';
            cy.get('[data-testid=simple-search-input]').type('cat{enter}');
            cy.location('search').should('eq', catSearchString);
            cy.get('[data-testid=simple-search-input]')
                .clear()
                .type('dog{enter}');
            cy.location('search').should('eq', dogSearchString);

            cy.go('back');
            cy.get('[data-testid=simple-search-input]').should('have.value', 'cat');
            cy.location('search').should('eq', catSearchString);

            cy.go('forward');
            cy.get('[data-testid=simple-search-input]').should('have.value', 'dog');
            cy.location('search').should('eq', dogSearchString);
        });
    });

    context('facets', () => {
        it('should have facets that can be selected', () => {
            cy.get('[data-testid=simple-search-input]')
                .should(
                    'have.attr',
                    'aria-label',
                    // searchLocale.ariaInputLabel
                    'Enter your search query to search eSpace and then press Enter',
                )
                .closest('[class*="MuiFormControl-root"]')
                // .contains('label', searchLocale.searchBoxPlaceholder);
                .contains('label', 'Search eSpace');

            cy.get('[data-testid=simple-search-input]').type('Test{enter}');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );

            cy.get('[data-testid="refine-results-facets"]').should('be.visible');
            cy.get('[data-testid="refine-results-facets"]')
                .find('[data-testid="facets-filter"] nav > div')
                .should('have.length', 8);

            cy.get('[data-testid="clickable-facet-category-display-type"]').click();

            cy.get('[data-testid="clear-facet-filter-nested-item-display-type-journal-article"]').should('not.exist');

            cy.get('[data-testid="facet-filter-nested-item-display-type-journal-article"]').click();
            cy.get('[data-testid="clear-facet-filter-nested-item-display-type-journal-article"]').should('be.visible');

            cy.get('[data-testid="clear-facet-filter-nested-item-display-type-journal-article"]').click();
            cy.get('[data-testid="clear-facet-filter-nested-item-display-type-journal-article"]').should('not.exist');
        });
    });

    context('Search results in Image Gallery', () => {
        it('has Display As drop down with expected values', () => {
            cy.viewport(xl, 1600);

            cy.get('[data-testid=simple-search-input]')
                .should(
                    'have.attr',
                    'aria-label',
                    // searchLocale.ariaInputLabel
                    'Enter your search query to search eSpace and then press Enter',
                )
                .closest('[class*="MuiFormControl-root"]')
                // .contains('label', searchLocale.searchBoxPlaceholder);
                .contains('label', 'Search eSpace');

            cy.get('[data-testid=simple-search-input]').type('Test{enter}');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );

            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Auto');
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').click();
            cy.contains('[role=listbox] li', 'Auto');
            cy.contains('[role=listbox] li', 'Standard');
            cy.contains('[role=listbox] li', 'Image Gallery').click();
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Image Gallery');

            cy.get('img[data-testid^=imageGalleryItemImage-]').should('have.length', 8);
            cy.get('li[data-testid^=image-gallery-item-]')
                .first()
                .find('div[data-testid$="-alert"]')
                .siblings('div')
                .siblings('div')
                .should('contain.text', 'Content warning');
            cy.get('li[data-testid^=image-gallery-item-]').each((item, index) => {
                if (index > 0) {
                    cy.wrap(item)
                        .find('div[data-testid$="-alert"]')
                        .siblings('div')
                        .siblings('div')
                        .should('contain.text', 'Image not available');
                }
            });
            cy.get('li[data-testid^=image-gallery-item-]').each((item, index) => {
                cy.wrap(item)
                    .find('div[data-testid$="-title"]')
                    .siblings('div')
                    .siblings('div')
                    .should('contain.text', records.data[index].rek_title);
            });
        });

        it('should preserve users displayAs choice across searches', () => {
            cy.get('[data-testid=simple-search-input]')
                .should(
                    'have.attr',
                    'aria-label',
                    // searchLocale.ariaInputLabel
                    'Enter your search query to search eSpace and then press Enter',
                )
                .closest('[class*="MuiFormControl-root"]')
                // .contains('label', searchLocale.searchBoxPlaceholder);
                .contains('label', 'Search eSpace');

            cy.get('[data-testid=simple-search-input]').type('Brisbane{enter}');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );

            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Auto');
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').click();
            cy.contains('[role=listbox] li', 'Auto');
            cy.contains('[role=listbox] li', 'Standard');
            cy.contains('[role=listbox] li', 'Image Gallery').click();
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Image Gallery');

            cy.get('[data-testid=simple-search-input]')
                .clear()
                .type('Queensland{enter}');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );

            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Image Gallery');
            cy.location().should(location => {
                // choice should persist in querystring too
                expect(location.search).to.contain('image-gallery');
            });
        });

        it('should show 4 items in the first row at >=medium breakpoint', () => {
            cy.viewport(md, 768);
            cy.get('[data-testid=simple-search-input]')
                .should(
                    'have.attr',
                    'aria-label',
                    // searchLocale.ariaInputLabel
                    'Enter your search query to search eSpace and then press Enter',
                )
                .closest('[class*="MuiFormControl-root"]')
                // .contains('label', searchLocale.searchBoxPlaceholder);
                .contains('label', 'Search eSpace');

            cy.get('[data-testid=simple-search-input]').type('Test{enter}');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );

            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Auto');
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').click();
            cy.contains('[role=listbox] li', 'Auto');
            cy.contains('[role=listbox] li', 'Standard');
            cy.contains('[role=listbox] li', 'Image Gallery').click();
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Image Gallery');

            cy.get('li[data-testid^=image-gallery-item-]')
                .should('have.length', 8)
                .then(() => {
                    const firstElement = cy.$$('li[data-testid^=image-gallery-item-]')[0];
                    cy.get('li[data-testid^=image-gallery-item-]')
                        .filter(filterByTop(firstElement.offsetTop))
                        .should('have.length', 4);
                });
        });
        it('should show 3 items in the first row at >=small & <medium breakpoint', () => {
            cy.viewport(sm, 768);
            cy.get('[data-testid=simple-search-input]')
                .should(
                    'have.attr',
                    'aria-label',
                    // searchLocale.ariaInputLabel
                    'Enter your search query to search eSpace and then press Enter',
                )
                .closest('[class*="MuiFormControl-root"]')
                // .contains('label', searchLocale.searchBoxPlaceholder);
                .contains('label', 'Search eSpace');

            cy.get('[data-testid=simple-search-input]').type('Test{enter}');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );

            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Auto');
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').click();

            cy.contains('[role=listbox] li', 'Auto');
            cy.contains('[role=listbox] li', 'Standard');
            cy.contains('[role=listbox] li', 'Image Gallery').click();
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Image Gallery');

            cy.get('li[data-testid^=image-gallery-item-]')
                .should('have.length', 8)
                .then(() => {
                    const firstElement = cy.$$('li[data-testid^=image-gallery-item-]')[0];
                    cy.get('li[data-testid^=image-gallery-item-]')
                        .filter(filterByTop(firstElement.offsetTop))
                        .should('have.length', 3);
                });
        });
        it('should show 2 items in the first row at >=xs & <small breakpoint', () => {
            cy.viewport(xs, 768);
            cy.get('[data-testid=simple-search-input]')
                .should(
                    'have.attr',
                    'aria-label',
                    // searchLocale.ariaInputLabel
                    'Enter your search query to search eSpace and then press Enter',
                )
                .closest('[class*="MuiFormControl-root"]')
                // .contains('label', searchLocale.searchBoxPlaceholder);
                .contains('label', 'Search eSpace');

            cy.get('[data-testid=simple-search-input]').type('Test{enter}');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );

            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Auto');
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').click();
            cy.contains('[role=listbox] li', 'Auto');
            cy.contains('[role=listbox] li', 'Standard');
            cy.contains('[role=listbox] li', 'Image Gallery').click();
            cy.get('[data-testid="publication-list-display-records-as"] [role="combobox"]').contains('Image Gallery');

            cy.get('li[data-testid^=image-gallery-item-]')
                .should('have.length', 8)
                .then(() => {
                    const firstElement = cy.$$('li[data-testid^=image-gallery-item-]')[0];
                    cy.get('li[data-testid^=image-gallery-item-]')
                        .filter(filterByTop(firstElement.offsetTop))
                        .should('have.length', 2);
                });
        });
    });
});

context('Advanced Search', () => {
    // a particular search key can be updated for bulk records
    function assertSearchKeyUpdates(optionId, frskName) {
        // select all items (with checkboxes)
        cy.waitUntil(() => cy.get('[data-testid="select-all-publications-input"]').should('exist'));
        cy.get('[data-testid="select-all-publications-input"]').click();
        // bulk updates drop down appears - open it
        cy.waitUntil(() => cy.get('[data-testid="bulk-updates-actions-select"]').should('exist'));
        cy.get('[data-testid="bulk-updates-actions-select"]').click();
        cy.waitUntil(() => cy.get('[data-testid="bulk-updates-actions-option-5"]').should('exist'));
        // choose "change search key value"
        cy.get('[data-testid="bulk-updates-actions-option-5"]').click();
        // open selector and choose provided type
        cy.waitUntil(() => cy.get('[data-testid="search-key-select"]').should('exist'));
        cy.get('[data-testid="search-key-select"]').click();
        cy.waitUntil(() => cy.get(`[data-testid="search-key-option-${optionId}"]`).should('exist'));
        cy.get(`[data-testid="search-key-option-${optionId}"]`).click();
        // enter some words in the rich editor
        cy.waitUntil(() => cy.get(`[data-testid="${frskName}"]`).should('exist'));
        cy.get('[data-testid="change-search-key-value-submit"]').should('be.disabled');
        cy.assertCKEditorEmpty(frskName);
        cy.typeCKEditor(frskName, 'some words');
        cy.waitUntil(() => cy.get('[data-testid="change-search-key-value-submit"]').should('not.be.disabled'));
        // save & see success
        cy.get('[data-testid="change-search-key-value-submit"]').click();
        cy.waitUntil(() => cy.get('[data-testid=alert] .alert-text').should('be.visible'));
        cy.get('[data-testid=alert] .alert-text').should('contain', 'Bulk update job created successfully');
    }

    beforeEach(() => {
        // visit advanced search page as an admin
        cy.visit(
            '/records/search?user=uqstaff&searchQueryParams%5Ball%5D=test&page=1&pageSize=20&sortBy=score&sortDirection=Desc',
        );
        cy.viewport(960, 768);
    });

    it('should search records when advanced search options are updated', () => {
        cy.get('[data-testid="search-records-loading"]').should('not.exist');
        cy.get('[data-testid="show-advanced-search"').click();
        cy.get('[data-testid="from"]').type('2005');
        cy.get('[data-testid="to"]').type('2018');
        cy.get('[data-testid="advanced-search"]').click();
        cy.location('search').should(
            'contain',
            'activeFacets%5Branges%5D%5BYear+published%5D%5Bfrom%5D=2005&activeFacets%5Branges%5D%5BYear+published%5D%5Bto%5D=2018',
        );
        cy.get('[data-testid="facet-year-range-caption"').should('exist');
        cy.get('[data-testid="search-records-loading"]')
            .should('exist')
            .should('contain', 'Searching for works');
    });

    it('can bulk edit Advisory statement', () => {
        const advisoryStatementOptionId = 8;
        assertSearchKeyUpdates(advisoryStatementOptionId, 'rek-advisory-statement');
    });

    it('can bulk edit Additional notes', () => {
        const additionalNotesOptionId = 5;
        assertSearchKeyUpdates(additionalNotesOptionId, 'rek-notes');
    });
});

context('Error handling', () => {
    const expectUserSessionToBe = existent => {
        cy.data('PersonOutlineIcon').should(existent ? 'not.exist' : 'exist');
        cy.data('PersonIcon').should(existent ? 'exist' : 'not.exist');
        cy.getCookie('UQLID').should(existent ? 'exist' : 'not.exist');
        cy.getCookie('UQLID_USER_GROUP').should(existent ? 'exist' : 'not.exist');
    };

    describe('401', () => {
        it('should display the login dialog upon receiving a 401', () => {
            cy.visit('/records/search?searchQueryParams%5Ball%5D=test');
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );
            cy.data('alert').should('not.exist');
            expectUserSessionToBe(true);

            // make a search that returns a 401
            cy.data('simple-search-input')
                .focus()
                .clear()
                .type('should return 401');
            cy.data('simple-search-button').click();
            // assert login dialog is displayed by - see App component
            cy.data('alert')
                .should('be.visible')
                .should('contain', 'You are not logged in');
            expectUserSessionToBe(false);

            // subsequent searches should go through
            cy.data('simple-search-input')
                .focus()
                .clear()
                .type('test');
            cy.data('simple-search-button').click();
            cy.get('[data-testid="search-records-results"]').should(
                'contain',
                'Displaying works 1 to 7 of 7 total works.',
            );
            expectUserSessionToBe(false);
        });
    });
});
