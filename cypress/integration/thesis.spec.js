context('Thesis', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/rhdsubmission?user=s2222222');
        cy.get('#unsupportedBrowser.card button')
            .then(($button) => {
                // Button is only visible if browser is unsupported.
                if ($button.filter(':visible')) {
                    $button.click();
                }
            });
        cy.wait(2000);
    });

    it('Submitting a thesis successfully', () => {
        cy.get('button#submit-thesis').should('to.have.attr', 'disabled');
        cy.wait(1000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 8);
        cy.wait(1000);
        cy.type_ckeditor('editor1', '<p>This is a thesis title</p>');
        cy.wait(1000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 7);
        cy.wait(1000);
        cy.type_ckeditor('editor2', '<p>This is the thesis abstract</p>');
        cy.wait(1000);
        cy.get('.alert-text')
            .find('ul')
            .children()
            .should('have.length', 6);
        cy.wait(10000);
    });
});
