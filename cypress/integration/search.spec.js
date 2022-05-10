context('Search', () => {
    // const searchLocale = componentsLocale.components.searchComponent;
    const cleanExtraSpaces = $string => $string.replace(/\s+/g, ' ').trim();

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
        cy.get('[data-testid="search-records-results"]').should(
            'contain',
            'Displaying works 1 to 20 of 35 total works.',
        );
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
        cy.get('[data-testid="search-records-results"]').contains('Displaying works 1 to 20 of 35 total works.');
    });

    context('Search results in Image Gallery', () => {
        it.only('has Display As drop down with expected values', () => {
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

            cy.get('#displayRecordsAs').contains('Standard');
            cy.get('#displayRecordsAs').click();
            cy.contains('[role=listbox] li', 'Standard');
            cy.contains('[role=listbox] li', 'Image Gallery').click();
            cy.get('#displayRecordsAs').contains('Image Gallery');
            cy.get('img[data-testid^=imageGalleryItemImage-]').should('have.length', 8);
            cy.get('li[data-testid^=image-gallery-item-]')
                .first()
                .find('svg[data-testid$=-restricted]')
                .should('have.attr', 'title', "This record's thumbnail is locked");
            cy.get('li[data-testid^=image-gallery-item-]')
                .first()
                .find('svg[data-testid$=-advisory]')
                .should(
                    'have.attr',
                    'title',
                    'This record has an advisor statement - caution is advised when viewing this record',
                );
        });
    });
});
