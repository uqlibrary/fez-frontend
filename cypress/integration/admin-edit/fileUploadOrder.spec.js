import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDigilibImage';

context('File Upload Order', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should allow up and down ordering', () => {
        cy.get('[data-testid=fez-datastream-info-input]').attachFile('test.jpg', { subjectType: 'drag-n-drop' });
        cy.get('[data-testid=fez-datastream-info-input]').attachFile('test_two.jpg', { subjectType: 'drag-n-drop' });
        cy.get('[data-testid="new-file-upload-down-0"]').click();
        cy.get('[data-testid="fez-datastream-info-list-row-0"]').should('contain', 'test_two.jpg');
        cy.get('[data-testid="new-file-upload-up-1"]').click();
        cy.get('[data-testid="fez-datastream-info-list-row-0"]').should('contain', 'test.jpg');
    });
});
