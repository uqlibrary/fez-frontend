context('Author Identifier Orcid Link', () => {
    it('should show linking buttons for authors with no linked orcid id', () => {
        cy.visit('/author-identifiers/orcid/link');
        cy.waitUntil(() => cy.location('pathname').should('contain', '/dashboard'));
    });

    it('should redirect to dashboard for authors with linked orcid id', () => {
        cy.visit('/author-identifiers/orcid/link?user=s4444444');
        cy.get('[data-testid="page-title"]').should('contain', 'Link ORCID ID to UQ eSpace');
        cy.contains(
            '[data-testid="standard-card-i-already-have-an-orcid-id-content"] button',
            'Link your existing ORCID iD',
        );
        cy.contains('[data-testid="standard-card-i-need-an-orcid-id-content"] button', 'Create a new ORCID iD');
    });
});
