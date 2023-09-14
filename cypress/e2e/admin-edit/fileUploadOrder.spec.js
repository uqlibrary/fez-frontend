import { default as recordList } from '../../../src/mock/data/records/publicationTypeListDigilibImage';

const getFilenamePart = filename => filename.split('.').shift();

context('File Upload Order', () => {
    const record = recordList.data[0];

    beforeEach(() => {
        cy.loadRecordForAdminEdit(record.rek_pid);
    });

    afterEach(() => {
        cy.adminEditCleanup();
    });

    it('should allow up and down ordering for newly attached files', () => {
        cy.get('[data-testid=fez-datastream-info-input]').attachFile('test.jpg', { subjectType: 'drag-n-drop' });
        cy.get('[data-testid=fez-datastream-info-input]').attachFile('test_two.jpg', { subjectType: 'drag-n-drop' });
        cy.get('[data-testid="new-file-upload-down-0"]').click();
        cy.get('[data-testid="fez-datastream-info-list-row-0"]').should('contain', 'test_two.jpg');
        cy.get('[data-testid="new-file-upload-up-1"]').click();
        cy.get('[data-testid="fez-datastream-info-list-row-0"]').should('contain', 'test.jpg');
    });

    it('should allow up and down ordering for existing attached files', () => {
        const file1 = 'BA_MM_147.tif';
        const file2 = 'BA_MM_147_2.tif';

        cy.get('[data-testid=standard-card-attached-files-content').within(() => {
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(0)
                .should('contain', file1);
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(1)
                .should('contain', file2);
            cy.get('[data-testid="order-down-file-0"]').click();
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(0)
                .should('contain', file2);
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(1)
                .should('contain', file1);
            cy.get('[data-testid="order-up-file-1"]').click();
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(0)
                .should('contain', file1);
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(1)
                .should('contain', file2);
        });
    });

    it('should allow up and down ordering for existing attached files when renaming', () => {
        const file1 = 'BA_MM_147.tif';
        const file2 = 'BA_MM_147_2.tif';
        const file1name = getFilenamePart(file1);
        const file2name = getFilenamePart(file2);

        cy.get('[data-testid=standard-card-attached-files-content').within(() => {
            // show the edit inputs
            cy.get('[data-testid=file-name-1-edit]').click();
            cy.get('[data-testid=file-name-2-edit]').click();

            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(0)
                .find('[data-testid=file-name-1-editing-input]')
                .should('have.value', file1name);
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(1)
                .find('[data-testid=file-name-2-editing-input]')
                .should('have.value', file2name);

            // reorder the rows down
            cy.get('[data-testid="order-down-file-0"]').click();

            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(0)
                .find('[data-testid=file-name-2-editing-input]')
                .should('have.value', file2name);
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(1)
                .find('[data-testid=file-name-1-editing-input]')
                .should('have.value', file1name);

            // reorder the rows up
            cy.get('[data-testid="order-up-file-1"]').click();

            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(0)
                .find('[data-testid=file-name-1-editing-input]')
                .should('have.value', file1name);
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(1)
                .find('[data-testid=file-name-2-editing-input]')
                .should('have.value', file2name);

            // reorder down again
            cy.get('[data-testid="order-down-file-0"]').click();

            // save the filenames to set the filenames back to text in page rather than input
            cy.get('[data-testid=file-name-1-save]').click();
            cy.get('[data-testid=file-name-2-save]').click();

            // confirm the filenames are as expected in the new order
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(0)
                .should('contain', file2);
            cy.get('[data-testid^=fez-datastream-info-attached-list-row-]')
                .eq(1)
                .should('contain', file1);
        });
    });
});
