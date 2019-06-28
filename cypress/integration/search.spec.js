// import { default as componentsLocale } from '../../src/locale/components';

context('Search', () => {
    // const searchLocale = componentsLocale.components.searchComponent;
    const cleanExtraSpaces = $string => $string.replace(/\s+/g, ' ').trim();

    beforeEach(() => {
        cy.visit('/records/search');
        cy.get('#unsupportedBrowser.card button').then($button => {
            // Button is only visible if browser is unsupported.
            if ($button.filter(':visible').length) {
                cy.wrap($button).click();
            }
        });
    });
    it('Doing a basic search to advanced search', () => {
        // Perform a basic search
        cy.get('#simpleSearchField')
            .should(
                'have.attr',
                'aria-label',
                // searchLocale.ariaInputLabel
                'Enter your search query to search eSpace and then press Enter'
            )
            .closest('[class*="MuiFormControl-root"]')
            // .contains('label', searchLocale.searchBoxPlaceholder);
            .contains('label', 'Search eSpace');
        cy.get('#simpleSearchField')
            .type('cats and dogs{enter}');
        cy.get('.StandardPage > div > div > div:nth-of-type(2) .StandardCard')
            .should('contain', 'Displaying works 1 to 6 of 6 total records.');
        cy.get('.StandardPage > div > div > div:nth-of-type(3) h6')
            .should('contain', 'Refine results');

        // Click through to advanced search UI
        cy.get('button#showAdvancedSearchButton')
            .should('contain', 'Advanced search')
            .should(
                'have.attr',
                'aria-label',
                'Click to switch to Advanced search'
            )
            .click();
        cy.get('#advancedSearchForm h5')
            .should('contain', 'Advanced search');
        cy.get('input[name="searchField0"]')
            .should('have.value', 'cats and dogs')
            .type('{home}it\'s raining ');
        cy.contains('label', 'Open access')
            .find('[class*="MuiCheckbox"]')
            .should(
                'have.attr',
                'aria-label',
                'Check to search for publications with are only open access / full text'
            );
        cy.contains('label', 'Open access')
            .click();
        cy.contains('button', 'Add another field')
            .should(
                'have.attr',
                'aria-label',
                'Click to add another advanced search field'
            )
            .click();
        cy.get('.content-container').scrollTo('top');
        cy.contains('Select a field')
            .closest('[class*="MuiInput-root"]')
            .should(
                'have.attr',
                'aria-label',
                'Click to select a field to search from the list - Select a field currently selected'
            )
            .siblings('p')
            .contains('Please select a field to search');
        cy.contains('Select a field')
            .click();
        // Select author from the field dropdown
        cy.contains('#menu- li', 'Author Name')
            .click();
        cy.get('button#advancedSearchButton')
            .should('be.disabled')
            .should('have.text', 'Search');
        cy.get('[placeholder="Add an author name"]')
            .type('Ky Lane{enter}');
        cy.get('button#advancedSearchButton')
            .should('not.be.disabled');
        // Add a set of collections to search from
        cy.contains('button', 'Add another field')
            .click();
        cy.contains('Select a field')
            .click();
        cy.contains('#menu- li', 'Collection')
            .click();
        cy.get('button#advancedSearchButton')
            .should('be.disabled');
        cy.contains('Select collections')
            .click();
        cy.contains('#menu- li', '5th Australasian Congress on Applied Mechanics')
            .click();
        cy.contains('#menu- li', 'Adaptive Interactive Profit Expectations')
            .click();
        cy.contains('#menu- li', 'Admin only - CHRC')
            .click();
        cy.get('#menu-')
            .click(10, 10);
        cy.get('#advancedSearchForm .searchQueryCaption')
            .should($caption => {
                expect(
                    cleanExtraSpaces(
                        $caption.text()
                    )
                ).to.equal(
                    'Any field contains it\'s raining cats and dogs AND Author Name contains Ky Lane AND Collection' +
                    ' is one of UQ:131735, UQ:131375 or UQ:292807 AND is open access/full text'
                );
            });
        cy.get('button#advancedSearchButton')
            .should('not.be.disabled')
            .click();
        cy.get('.StandardPage > div > div > div:nth-of-type(2)')
            .should('contain', 'Searching for works')
            .contains('Displaying works 1 to 6 of 6 total records.');
    });
});
