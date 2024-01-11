import recordVersion from '../../src/mock/data/records/recordVersion';
import recordVersionLegacy from '../../src/mock/data/records/recordVersionLegacy';

context('Record version view', () => {
    it('should load record version', () => {
        cy.visit(`/view/${recordVersion.rek_pid}/${recordVersion.rek_version}?user=uqstaff`);
        cy.get('#alert-info')
            .should('contain.text', recordVersion.rek_pid)
            .should('contain.text', recordVersion.rek_version);
    });

    it('should load record with legacy version', () => {
        cy.visit(`/view/${recordVersionLegacy.rek_pid}/${recordVersionLegacy.rek_version}?user=uqstaff`);
        cy.get('#alert-info')
            .should('contain.text', recordVersionLegacy.rek_pid)
            .should('contain.text', recordVersionLegacy.rek_version);
    });

    it('should not allow record version to be rendered to non admins', () => {
        cy.visit(`/view/${recordVersion.rek_pid}/${recordVersion.rek_version}`);
        cy.get('#page-title').should('contain.text', 'Page not found');
    });

    it('should not allow record legacy version to be rendered to non admins', () => {
        cy.visit(`/view/${recordVersionLegacy.rek_pid}/${recordVersionLegacy.rek_version}`);
        cy.get('#page-title').should('contain.text', 'Page not found');
    });
});
