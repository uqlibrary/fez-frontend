import recordVersion from '../../src/mock/data/records/recordVersion';
import recordVersionLegacy from '../../src/mock/data/records/recordVersionLegacy';

context('version view', () => {
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

    context('media preview window for larger screensizes (coverage)', () => {
        beforeEach(() => {
            cy.viewport(1024, 768);
        });

        it('should show preview buttons for images', () => {
            cy.visit(`/view/${recordVersion.rek_pid}?user=uqstaff`);
            cy.get('#file-name-1-preview').click();
            cy.get('#media-preview-buttons-smaller-screen').should('not.be.visible');
            cy.get('#media-preview-buttons-larger-screen').should('be.visible');
            cy.get('#media-preview-buttons-larger-screen').within(() => {
                cy.get('#open-original-file').should('contain.text', 'Open original file in a new window');
                cy.get('#open-web-file').should('contain.text', 'Open web version file in a new window');
                cy.get('#close-preview').should('contain.text', 'Close');
            });
        });
        it('should show preview buttons for videos', () => {
            cy.visit(`/view/${recordVersion.rek_pid}?user=uqstaff`);
            cy.get('#file-name-2-preview').click();
            cy.get('#media-preview-buttons-smaller-screen').should('not.be.visible');
            cy.get('#media-preview-buttons-larger-screen').should('be.visible');
            cy.get('#media-preview-buttons-larger-screen').within(() => {
                cy.get('#open-original-file').should('contain.text', 'Open original file in a new window');
                cy.get('#close-preview').should('contain.text', 'Close');
            });
        });
    });
    context('media preview window for smaller screensizes (coverage)', () => {
        beforeEach(() => {
            cy.viewport(599, 1000);
        });

        it('should show preview buttons for images', () => {
            cy.visit(`/view/${recordVersion.rek_pid}?user=uqstaff`);
            cy.get('#file-name-1-preview').click();
            cy.get('#media-preview-buttons-larger-screen').should('not.be.visible');
            cy.get('#media-preview-buttons-smaller-screen').should('be.visible');
            cy.get('#media-preview-buttons-smaller-screen').within(() => {
                cy.get('#open-original-file').should('contain.text', 'Open original file in a new window');
                cy.get('#open-web-file').should('contain.text', 'Open web version file in a new window');
                cy.get('#close-preview').should('contain.text', 'Close');
            });
        });
        it('should show preview buttons for videos', () => {
            cy.visit(`/view/${recordVersion.rek_pid}?user=uqstaff`);
            cy.get('#file-name-2-preview').click();
            cy.get('#media-preview-buttons-larger-screen').should('not.be.visible');
            cy.get('#media-preview-buttons-smaller-screen').should('be.visible');
            cy.get('#media-preview-buttons-smaller-screen').within(() => {
                cy.get('#open-original-file').should('contain.text', 'Open original file in a new window');
                cy.get('#close-preview').should('contain.text', 'Close');
            });
        });
    });
});

context('not found view', () => {
    it('should load', () => {
        cy.visit('/view/not-found?user=anon');
        cy.get('body').should('contain.text', 'Work not found');
        cy.get('body').should('not.contain.text', 'You are not logged in');
    });
});
