context('Strategic Publishing - Search', () => {
    beforeEach(() => {
        cy.visit('localhost:3000/journals/search/');
        cy.injectAxe();
    });

    it('Renders the search page as expected', () => {
        cy.get('h2[data-testid="page-title"]').should('contain', 'Journal search');
        cy.get('div[data-testid="standard-card"]').should(
            'contain',
            'Step 1. Enter a journal title, keyword, subject or field of research code.',
        );
        cy.get('[data-testid="standard-card"]').should('exist');
        cy.get('button[data-testid="journal-search-keywords-voice-record-tooltip"]').should('exist');
        cy.get('span[data-testid="clear-journal-search-keywords"]').should('exist');
        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');
        cy.get('button[data-testid="journal-search-browse-all-button"]').should('not.have.attr', 'disabled');
        cy.get('button[data-testid="journal-search-favourite-journals-button"]').should('not.have.attr', 'disabled');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Page render',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Renders no search results', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('no result', 200);
        cy.get('[data-testid="standard-card"]').should('contain', 'Titles containing');
        cy.get('[data-testid="standard-card"]').should('contain', 'Keyword matches');
        cy.get('[data-testid="standard-card"]').should('contain', 'Subjects & Field of research');
        cy.get('[data-testid="journal-search-keyword-list-titles containing-no-matches"]').should('exist');
        cy.get('[data-testid="journal-search-keyword-list-keyword matches-no-matches"]').should('exist');
        cy.get('[data-testid="journal-search-keyword-list-subjects & field of research-no-matches"]').should('exist');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('Renders search results', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('tech', 200);
        cy.get('[data-testid="standard-card"]').should('contain', 'Titles containing');
        cy.get('[data-testid="standard-card"]').should('contain', 'Keyword matches');
        cy.get('[data-testid="standard-card"]').should('contain', 'Subjects & Field of research');
        cy.get('[data-testid="standard-card"]').should('not.contain', 'No matches found.');

        cy.get('div[data-testid="journal-search-keyword-list-titles containing"]')
            .find('span')
            .should('have.length', 4);

        cy.get('div[data-testid="journal-search-keyword-list-keyword matches"]')
            .find('span')
            .should('have.length', 6);

        cy.get('div[data-testid="journal-search-keyword-list-subjects & field of research"]')
            .find('span')
            .should('have.length', 22);

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
        cy.get('[data-testid="clear-journal-search-keywords"]').click();
        cy.get('[data-testid="standard-card"]').should('not.contain', 'Titles containing');
        cy.get('[data-testid="standard-card"]').should('not.contain', 'Keyword matches');
        cy.get('[data-testid="standard-card"]').should('not.contain', 'Subjects & Field of research');
    });

    it('Renders search chips', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="standard-card"]').should('contain', 'Titles containing');
        cy.get('[data-testid="standard-card"]').should('contain', 'Keyword matches');
        cy.get('[data-testid="standard-card"]').should('contain', 'Subjects & Field of research');
        cy.get('[data-testid="standard-card"]').should('not.contain', 'No matches found.');

        cy.get('div[data-testid="journal-search-keyword-list-titles containing"]')
            .find('span')
            .should('have.length', 6);

        cy.get('div[data-testid="journal-search-keyword-list-keyword matches"]')
            .find('span')
            .should('have.length', 28);

        cy.get('div[data-testid="journal-search-keyword-list-subjects & field of research"]')
            .find('span')
            .should('have.length', 23);

        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');

        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-chip-Title-Microbiology"]').should('exist');

        cy.get('button[data-testid="journal-search-button"]').should('not.have.attr', 'disabled');

        cy.get('[data-testid="journal-search-chip-Title-Microbiology"]')
            .find('svg')
            .click();
        cy.get('button[data-testid="journal-search-button"]').should('have.attr', 'disabled');

        cy.checkA11y('div.StandardPage', {
            reportName: 'Search Journals',
            scopeName: 'Keywords chips',
            includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
        });
    });

    it('FAQ', () => {
        cy.get('input[data-testid="journal-search-keywords-input"]').type('bio', 200);
        cy.get('[data-testid="journal-search-item-addable-Microbiology-0"]').click();
        cy.get('[data-testid="journal-search-button"]').click();
        cy.get('[data-testid="search-journals-faq"]', { timeout: 1000 }).should('be.visible');
        cy.get('[data-testid="faq-summary-0"]').click();

        cy.checkA11y(
            '[data-testid="search-journals-faq"]',
            {
                rules: { 'color-contrast': { enabled: false } },
                reportName: 'Search Journals',
                scopeName: 'FAQ',
                includedImpacts: ['minor', 'moderate', 'serious', 'critical'],
            },
            violations => console.log(violations),
        );
    });
});
