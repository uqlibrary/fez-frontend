context('Masquerade', () => {
    it('unprivileged users cant masquerade', () => {
        cy.visit('/admin/masquerade');
        cy.get('body').contains('The requested page is available to authorised users only.');
    });

    it('privileged users can masquerade', () => {
        cy.intercept('GET', /auth.library.uq.edu.au/, {
            statusCode: 200,
            body: 'user has navigated to auth',
        });

        cy.visit('/admin/masquerade/?user=uqmasquerade');
        cy.get('#userName').type('s1111111');
        cy.get('button')
            .contains('Masquerade')
            .click();
        cy.get('body').contains('user has navigated to auth');
    });
});
