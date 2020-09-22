context('Masquerade', () => {
    it('unprivileged users cant masquerade', () => {
        cy.visit('/admin/masquerade');
        cy.get('body').contains('The requested page is available to authorised users only.');
    });

    it('privileged users can masquerade', () => {
        cy.visit('/admin/masquerade/?user=uqmasquerade');
        cy.get('#userName').type('s1111111');
        cy.get('button')
            .contains('Masquerade')
            .click();
        cy.url().should('include', 'https://auth.library.uq.edu.au/masquerade?user=s1111111');
    });
});
