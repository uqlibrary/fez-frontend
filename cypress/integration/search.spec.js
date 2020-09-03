// import { default as componentsLocale } from '../../src/locale/components';
// import internalTitleSearchList from '../../src/mock/data/records/internalTitleSearchList.js';

context('Search', () => {
    // const searchLocale = componentsLocale.components.searchComponent;
    const cleanExtraSpaces = $string => $string.replace(/\s+/g, ' ').trim();

    beforeEach(() => {
        cy.visit('/records/search');
    });

    it('Doing a basic search to advanced search', () => {
        // Perform a basic search
        cy.get('#simple-search-input')
            .should(
                'have.attr',
                'aria-label',
                // searchLocale.ariaInputLabel
                'Enter your search query to search eSpace and then press Enter',
            )
            .closest('[class*="MuiFormControl-root"]')
            // .contains('label', searchLocale.searchBoxPlaceholder);
            .contains('label', 'Search eSpace');
        cy.get('#simple-search-input').type('cats and dogs{enter}');
        cy.get('[data-testid="standard-card-content"]').should('contain', 'Displaying works 1 to 7 of 7 total works.');
        cy.get('.StandardPage > div > div > div:nth-of-type(4) h6').should('contain', 'Refine results');

        // Click through to advanced search UI
        cy.get('button#showAdvancedSearchButton')
            .should('contain', 'Advanced search')
            .should('have.attr', 'aria-label', 'Click to switch to Advanced search')
            .click();
        cy.get('#advancedSearchForm h5').should('contain', 'Advanced search');
        cy.get('input[name="searchField0"]')
            .should('have.value', 'cats and dogs')
            .type("{home}it's raining ");
        cy.contains('label > span:nth-child(2)', 'Open access')
            .get('#advanced-search-open-access')
            .should(
                'have.attr',
                'aria-label',
                'Check to search for publications with are only open access / full text',
            );
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
        cy.get('button#advancedSearchButton')
            .should('be.disabled')
            .should('have.text', 'Search');
        cy.get('[placeholder="Add an author name"]').type('Ky Lane{enter}');
        cy.get('button#advancedSearchButton').should('not.be.disabled');
        // Add a set of collections to search from
        cy.contains('button', 'Add another field').click();
        cy.contains('Select a field').click();
        cy.contains('#field-type-options li', 'Collection').click();
        cy.get('button#advancedSearchButton').should('be.disabled');
        cy.get('[data-testid=rek-ismemberof-input]').click();
        cy.contains(
            '[data-testid=rek-ismemberof-options] li',
            '5th Australasian Congress on Applied Mechanics',
        ).click();
        cy.get('[data-testid=rek-ismemberof-input]').click();
        cy.contains('[data-testid=rek-ismemberof-options] li', 'Adaptive Interactive Profit Expectations').click();
        cy.get('[data-testid=rek-ismemberof-input]').click();
        cy.contains('[data-testid=rek-ismemberof-options] li', 'Admin only - CHRC').click();
        cy.get('[data-testid=advanced-search-caption]').should($caption => {
            expect(cleanExtraSpaces($caption.text())).to.equal(
                "Any fieldcontainsit's raining cats and dogsANDAuthor NamecontainsKy LaneANDCollectionis one ofUQ:131735, UQ:131375 or UQ:292807ANDisopen access/full text",
            );
        });
        cy.get('button#advancedSearchButton')
            .should('not.be.disabled')
            .click();
        cy.get('[data-testid="standard-card-content"]')
            .should('contain', 'Searching for works')
            .contains('Displaying works 1 to 7 of 7 total works.');
    });

    it('should show appropriate form validation for PID field', () => {
        const helpMessage = 'Please provide a valid PID (e.g. UQ:129af6)';

        cy.get('button#showAdvancedSearchButton').click();
        cy.contains('Select a field').click();
        cy.contains('#field-type-options li', 'PID').click();
        cy.get('#rek-pid-helper-text')
            .as('helpText')
            .should('contain', 'This field is required');
        cy.get('button#advancedSearchButton')
            .as('searchButton')
            .should('be.disabled');

        cy.get('[placeholder="Add a PID"]').as('pidField');

        const invalidPIDs = ['abcd', '_uq:123', 'UQ: 12', 'uq:'];

        invalidPIDs.forEach(invalidPID => {
            cy.get('@pidField')
                .clear()
                .type(invalidPID);
            cy.get('@helpText').should('contain', helpMessage);
            cy.get('@searchButton').should('be.disabled');
        });

        cy.get('@pidField')
            .clear()
            .type('uq:123');
        cy.get('@searchButton').should('not.be.disabled');
        cy.get('@helpText').should('not.exist');

        cy.get('[data-testid=advanced-search-caption]').should($caption => {
            expect(cleanExtraSpaces($caption.text())).to.equal('PIDisuq:123');
        });
    });

    // context('API call tests', () => {
    //     // Should be run in exclusion while running with `npm run start:url`
    //
    //     let count = 0;
    //     const baseUrl = 'http://dev-espace.library.uq.edu.au:3000';
    //     Cypress.config('baseUrl', baseUrl);

    //     beforeEach(() => {
    //         cy.server({
    //             response: [],
    //         });
    //         cy.route({
    //             url: 'https://api.library.uq.edu.au/staging/account*',
    //             status: 403,
    //         });
    //         cy.route('https://api.library.uq.edu.au/staging/fez-news');
    //         cy.route('https://api.library.uq.edu.au/staging/records/trending');
    //         cy.route({
    //             url: 'https://api.library.uq.edu.au/staging/records/search*',
    //             // For some reasons, returning the full list seems to be
    //             // resulting in test failure.
    //             response: {
    //                 ...internalTitleSearchList,
    //                 total: 5,
    //                 to: 5,
    //                 data: internalTitleSearchList.data.slice(-5),
    //             },
    //             headers: {
    //                 'content-type': 'application/json',
    //             },
    //             onRequest: () => {
    //                 count++;
    //             },
    //             delay: 500,
    //         })
    //             .as('searchAPICall');
    //     });

    //     afterEach(() => {
    //         count = 0;
    //         cy.server({
    //             enable: false
    //         });
    //     });

    //     it('should issue and handle API calls as expected when searching from homepage header', () => {
    //         cy.visit('/');

    //         cy.get('#simple-search-input')
    //             .type('test1{enter}');

    //         cy.get('.StandardPage > div > div > div:nth-of-type(2)')
    //             .should('contain', 'Searching for works');

    //         cy.url()
    //             .should('equal',
    //                 `${baseUrl}/#/records/search?searchQueryParams%5Ball%5D=test1&page=
    //                 1&pageSize=20&sortBy=score&sortDirection=Desc`
    //             );
    //         cy.wait(['@searchAPICall']);

    //         cy.get('.StandardPage > div > div > div:nth-of-type(2)')
    //             .contains('Displaying works 1 to 5 of 5 total records.')
    //             .then(() => {
    //                 expect(count).to.equal(1);
    //             });
    //     });

    //     it('should issue and handle API calls as expected when changing the search query', () => {
    //         cy.visit('/#/records/search');

    //         cy.get('#simple-search-input')
    //             .type('vaccination{enter}');

    //         cy.get('.StandardPage > div > div > div:nth-of-type(2)')
    //             .should('contain', 'Searching for works');

    //         cy.wait(['@searchAPICall']);

    //         cy.get('.StandardPage > div > div > div:nth-of-type(2)')
    //             .contains('Displaying works 1 to 5 of 5 total records.')
    //             .then(() => {
    //                 expect(count).to.equal(1);
    //             });
    //     });
    // });
});
