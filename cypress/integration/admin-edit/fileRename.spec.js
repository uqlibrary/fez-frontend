import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournalArticle';

const getFilenamePart = filename => filename.split('.').shift();
const getFilenameExtension = filename => filename.split('.').pop();
const getNewFilename = (filename, extension) => `${filename}.${extension}`;

context('File rename admin edit', () => {
    it('should handle rename operations as expected', () => {
        const record = recordList.data[1];

        cy.loadRecordForAdminEdit(record.rek_pid);

        cy.log('Files Tab');
        cy.get('[data-testid=files-section-header]').should('have.text', 'Files');
        cy.get('[data-testid=files-section-content]').within(() => {
            cy.get('h4')
                .eq(0)
                .should('have.text', 'Attached files');
            cy.get('p')
                .eq(0)
                .should(
                    'have.text',
                    'There may be a delay before newly uploaded or renamed files appear on the record.',
                );
            cy.get('p')
                .eq(2)
                .should('have.text', record.fez_datastream_info[1].dsi_dsid);
        });

        const editId = `file-name-${record.fez_datastream_info[1].dsi_id}-edit`;
        const editedId = `file-name-${record.fez_datastream_info[1].dsi_id}-edited`;
        const editingId = `file-name-${record.fez_datastream_info[1].dsi_id}-editing-input`;
        const saveId = `file-name-${record.fez_datastream_info[1].dsi_id}-save`;
        const cancelId = `file-name-${record.fez_datastream_info[1].dsi_id}-cancel`;
        const resetId = `file-name-${record.fez_datastream_info[1].dsi_id}-reset`;
        const alertId = 'alert-files';
        const filenameText = `file-name-${record.fez_datastream_info[1].dsi_id}`;
        const originalFilename = record.fez_datastream_info[1].dsi_dsid;
        const originalFilepart = getFilenamePart(originalFilename);
        const originalFilenameExt = getFilenameExtension(originalFilename);
        const newFilename = 'rename';
        const newFilenamefull = getNewFilename(newFilename, originalFilenameExt);
        const invalidFilename = 'invalid.pdf';

        // rename
        cy.get('[data-testid=files-section-content]').within(() => {
            cy.get(`[data-testid=${editId}]`).should('exist');
            cy.get(`[data-testid=${resetId}]`).should('not.exist');
            cy.get(`[data-testid=${filenameText}]`).should('contain', originalFilename);

            // rename pass 1
            cy.get(`[data-testid=${editId}]`).click();
            cy.get(`[data-testid=${editId}]`).should('not.exist');
            cy.get(`[data-testid=${editingId}]`).should('exist');
            cy.get(`[data-testid=${saveId}]`).should('exist');
            cy.get(`[data-testid=${cancelId}]`).should('exist');
            cy.get(`[data-testid=${editingId}]`).should('have.value', originalFilepart);
            cy.get(`[data-testid=${editingId}]`)
                .clear()
                .type(newFilename);
            cy.get(`[data-testid=${saveId}]`).click();
            cy.get(`[data-testid=${editingId}]`).should('not.exist');
            cy.get(`[data-testid=${saveId}]`).should('not.exist');
            cy.get(`[data-testid=${cancelId}]`).should('not.exist');
            cy.get(`[data-testid=${editId}]`).should('exist');
            cy.get(`[data-testid=${resetId}]`).should('exist');
            cy.get(`[data-testid=${editedId}]`).should('contain', newFilenamefull);

            // rename pass 2
            cy.get(`[data-testid=${editId}]`).click();
            cy.get(`[data-testid=${editingId}]`).type('d');
            cy.get(`[data-testid=${editingId}]`).should('have.value', `${newFilename}d`);
            cy.get(`[data-testid=${saveId}]`).click();
            cy.get(`[data-testid=${editedId}]`).should('contain', `${newFilename}d`);

            // cancel a rename
            cy.get(`[data-testid=${editId}]`).click();
            cy.get(`[data-testid=${editingId}]`).type('-again');
            cy.get(`[data-testid=${editingId}]`).should('have.value', `${newFilename}d-again`);
            cy.get(`[data-testid=${cancelId}]`).click();
            cy.get(`[data-testid=${editedId}]`).should('contain', `${newFilename}d`);

            // reset renamed file to original
            cy.get(`[data-testid=${resetId}]`).click();
            cy.get(`[data-testid=${editId}]`).should('exist');
            cy.get(`[data-testid=${resetId}]`).should('not.exist');
            cy.get(`[data-testid=${filenameText}]`).should('exist');
            cy.get(`[data-testid=${editedId}]`).should('not.exist');
            cy.get(`[data-testid=${filenameText}]`).should('contain', originalFilename);

            // invalid filename
            cy.get(`[data-testid=${alertId}]`).should('not.exist');
            cy.get(`[data-testid=${editId}]`).click();
            cy.get(`[data-testid=${editingId}]`).type(invalidFilename);
            cy.get(`[data-testid=${saveId}]`).click();
            // state of input should remain visible and not return to text-only
            cy.get(`[data-testid=${editingId}]`).should('exist');
            cy.get(`[data-testid=${saveId}]`).should('exist');
            cy.get(`[data-testid=${cancelId}]`).should('exist');
            cy.get(`[data-testid=${filenameText}]`).should('not.exist');
            cy.get(`[data-testid=${editedId}]`).should('not.exist');
            cy.get(`[data-testid=${alertId}]`).should('exist');
            cy.get(`[data-testid=${alertId}]`).should('contain', 'invalid file name');
            cy.get(`[data-testid=${cancelId}]`).click();
            cy.get(`[data-testid=${alertId}]`).should('not.exist');
        });

        cy.get('[data-testid=files-section-content]').within(() => {
            cy.contains('h4', 'Advisory statement');
            cy.contains('h4', 'Copyright agreement');
            cy.get('[data-testid=rek-copyright-input]').should($checkbox => {
                if (record.rek_copyright === 'on') {
                    expect($checkbox).to.be.checked;
                } else {
                    expect($checkbox).not.to.be.checked;
                }
            });
        });
        cy.get('[data-testid=rek-copyright-input]').click();

        cy.adminEditVerifyAlerts(1, ['You are required to accept deposit agreement']);
        cy.adminEditCleanup();
    });

    it('should not present rename buttons on mobile', () => {
        const record = recordList.data[1];
        cy.loadRecordForAdminEdit(record.rek_pid);
        cy.viewport(584, 1000);

        const editId = `file-name-${record.fez_datastream_info[1].dsi_id}-edit`;
        const resetId = `file-name-${record.fez_datastream_info[1].dsi_id}-reset`;
        const filenameText = `file-name-${record.fez_datastream_info[1].dsi_id}`;
        const originalFilename = record.fez_datastream_info[1].dsi_dsid;

        cy.get('[data-testid=files-section-content]').within(() => {
            cy.get(`[data-testid=${editId}]`).should('not.exist');
            cy.get(`[data-testid=${resetId}]`).should('not.exist');
            cy.get(`[data-testid=${filenameText}]`).should('contain', originalFilename);
        });
    });
});
