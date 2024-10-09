Cypress.Commands.add('loadAdminDashboard', (user = 'uqstaff') => {
    cy.viewport(1200, 1000);
    cy.visit(`/admin/dashboard?user=${user}`);
    cy.waitUntil(
        () =>
            cy
                .get('h2')
                .should('exist')
                .should('be.visible'),
        {
            timeout: 10000,
        },
    );

    cy.get('h2').should('contain.text', 'Admin dashboard');
});
