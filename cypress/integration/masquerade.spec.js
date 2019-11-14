context('Masquerade', () => {
    it('unprivileged users cant masquerade', () => {
        cy.visit('/admin/masquerade/?user=s1111111');
        cy.get('body')
            .contains('The requested page could not be found.');
    });

    it('privileged users can masquerade', () => {
        cy.visit('/admin/masquerade/?user=uqmasquerade');
        cy.closeUnsupported();
        cy.get('#userName')
            .type('s1111111');
        cy.get('button')
            .contains('Masquerade')
            .click();
        cy.url()
            .should('include', 'https://auth.library.uq.edu.au/masquerade?user=s1111111');
    });
});
