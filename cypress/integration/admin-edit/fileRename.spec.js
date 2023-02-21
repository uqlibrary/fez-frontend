import { default as recordList } from '../../../src/mock/data/records/publicationTypeListJournalArticle';

const getFilenamePart = filename => filename.split('.').shift();
const getFilenameExtension = filename => filename.split('.').pop();
const getNewFilename = (filename, extension) => `${filename}.${extension}`;

context('File rename admin edit', () => {
    const alertId = 'alert-files';
    const newFilename = 'rename';
    const invalidFilename = 'invalid.pdf';

    const getIds = (record, index) => {
        const originalFilename = record.fez_datastream_info[index].dsi_dsid;
        const originalFilenameExt = getFilenameExtension(originalFilename);

        return {
            editId: `file-name-${record.fez_datastream_info[index].dsi_id}-edit`,
            editedId: `file-name-${record.fez_datastream_info[index].dsi_id}-edited`,
            editingId: `file-name-${record.fez_datastream_info[index].dsi_id}-editing-input`,
            saveId: `file-name-${record.fez_datastream_info[index].dsi_id}-save`,
            cancelId: `file-name-${record.fez_datastream_info[index].dsi_id}-cancel`,
            resetId: `file-name-${record.fez_datastream_info[index].dsi_id}-reset`,
            filenameText: `file-name-${record.fez_datastream_info[index].dsi_id}`,
            originalFilename,
            originalFilenameExt,
            originalFilepart: getFilenamePart(originalFilename),
            newFilenamefull: getNewFilename(newFilename, originalFilenameExt),
        };
    };

    it('should handle rename operations as expected', () => {
        const record = recordList.data[1];
        const vars = getIds(record, 1);
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

        // rename
        cy.get('[data-testid=files-section-content]').within(() => {
            cy.get(`[data-testid=${vars.editId}]`).should('exist');
            cy.get(`[data-testid=${vars.resetId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.filenameText}]`).should('contain', vars.originalFilename);

            // rename pass 1
            cy.get(`[data-testid=${vars.editId}]`).click();
            cy.get(`[data-testid=${vars.editId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.editingId}]`).should('exist');
            cy.get(`[data-testid=${vars.saveId}]`).should('exist');
            cy.get(`[data-testid=${vars.cancelId}]`).should('exist');
            cy.get(`[data-testid=${vars.editingId}]`).should('have.value', vars.originalFilepart);
            cy.get(`[data-testid=${vars.editingId}]`)
                .clear()
                .type(newFilename);
            cy.get(`[data-testid=${vars.saveId}]`).click();
            cy.get(`[data-testid=${vars.editingId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.saveId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.cancelId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.editId}]`).should('exist');
            cy.get(`[data-testid=${vars.resetId}]`).should('exist');
            cy.get(`[data-testid=${vars.editedId}]`).should('contain', vars.newFilenamefull);

            // rename pass 2
            cy.get(`[data-testid=${vars.editId}]`).click();
            cy.get(`[data-testid=${vars.editingId}]`).type('d');
            cy.get(`[data-testid=${vars.editingId}]`).should('have.value', `${newFilename}d`);
            cy.get(`[data-testid=${vars.saveId}]`).click();
            cy.get(`[data-testid=${vars.editedId}]`).should('contain', `${newFilename}d`);

            // cancel a rename
            cy.get(`[data-testid=${vars.editId}]`).click();
            cy.get(`[data-testid=${vars.editingId}]`).type('-again');
            cy.get(`[data-testid=${vars.editingId}]`).should('have.value', `${newFilename}d-again`);
            cy.get(`[data-testid=${vars.cancelId}]`).click();
            cy.get(`[data-testid=${vars.editedId}]`).should('contain', `${newFilename}d`);

            // reset renamed file to original
            cy.get(`[data-testid=${vars.resetId}]`).click();
            cy.get(`[data-testid=${vars.editId}]`).should('exist');
            cy.get(`[data-testid=${vars.resetId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.filenameText}]`).should('exist');
            cy.get(`[data-testid=${vars.editedId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.filenameText}]`).should('contain', vars.originalFilename);

            // invalid filename
            cy.get(`[data-testid=${alertId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.editId}]`).click();
            cy.get(`[data-testid=${vars.editingId}]`).type(invalidFilename);
            cy.get(`[data-testid=${vars.saveId}]`).click();
            // state of input should remain visible and not return to text-only
            cy.get(`[data-testid=${vars.editingId}]`).should('exist');
            cy.get(`[data-testid=${vars.saveId}]`).should('exist');
            cy.get(`[data-testid=${vars.cancelId}]`).should('exist');
            cy.get(`[data-testid=${vars.filenameText}]`).should('not.exist');
            cy.get(`[data-testid=${vars.editedId}]`).should('not.exist');
            cy.get(`[data-testid=${alertId}]`).should('exist');
            cy.get(`[data-testid=${alertId}]`).should('contain', 'invalid file name');
            cy.get(`[data-testid=${vars.cancelId}]`).click();
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

    it('should prevent renaming conflicts', () => {
        const record = recordList.data[2];
        const vars = getIds(record, 12);

        cy.loadRecordForAdminEdit(record.rek_pid);
        // rename
        cy.get('[data-testid=files-section-content]').within(() => {
            cy.get(`[data-testid=${vars.editId}]`).should('exist');
            cy.get(`[data-testid=${vars.resetId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.filenameText}]`).should('contain', vars.originalFilename);

            // rename pass 1 - cant rename a file to a filename that already exists in the DS
            const anotherExistingFilename = record.fez_datastream_info[13].dsi_dsid;
            const anotherExistingFilenamePart = getFilenamePart(anotherExistingFilename);

            cy.get(`[data-testid=${vars.editId}]`).click();
            cy.get(`[data-testid=${vars.editId}]`).should('not.exist');
            cy.get(`[data-testid=${vars.editingId}]`).should('exist');
            cy.get(`[data-testid=${vars.saveId}]`).should('exist');
            cy.get(`[data-testid=${vars.cancelId}]`).should('exist');
            cy.get(`[data-testid=${vars.editingId}]`).should('have.value', vars.originalFilepart);
            cy.get(`[data-testid=${vars.editingId}]`)
                .clear()
                .type(anotherExistingFilenamePart);
            cy.get(`[data-testid=${vars.saveId}]`).click();

            cy.get(`[data-testid=${alertId}]`).should('exist');
            cy.get(`[data-testid=${alertId}]`).should('contain', 'name matches with an existing file.');

            cy.get(`[data-testid=${vars.editingId}]`)
                .clear()
                .type(newFilename);

            cy.get(`[data-testid=${vars.saveId}]`).click();
            cy.get(`[data-testid=${alertId}]`).should('not.exist');

            // pass 2 - can't rename another file using the original filename of a file we've renamed
            const vars2 = getIds(record, 13);
            cy.get(`[data-testid=${vars2.editId}]`).click();
            cy.get(`[data-testid=${vars2.editingId}]`)
                .clear()
                .type(vars.originalFilepart);
            cy.get(`[data-testid=${vars2.saveId}]`).click();
            cy.get(`[data-testid=${alertId}]`).should('exist');
            cy.get(`[data-testid=${alertId}]`).should('contain', 'name matches with an existing file.');

            cy.get(`[data-testid=${vars2.cancelId}]`).click();
            cy.get(`[data-testid=${alertId}]`).should('not.exist');

            // pass 3 - can't rename another file using the new filename of a file we've renamed
            const vars3 = getIds(record, 14);
            cy.get(`[data-testid=${vars3.editId}]`).click();
            cy.get(`[data-testid=${vars3.editingId}]`)
                .clear()
                .type(newFilename);
            cy.get(`[data-testid=${vars3.saveId}]`).click();

            cy.get(`[data-testid=${alertId}]`).should('exist');
            cy.get(`[data-testid=${alertId}]`).should('contain', 'name matches with an existing file.');
        });
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
            cy.get(`[data-testid=${editId}]`).should('not.be.visible');
            cy.get(`[data-testid=${resetId}]`).should('not.exist');
            cy.get(`[data-testid=${filenameText}]`).should('contain', originalFilename);
        });
    });
});
