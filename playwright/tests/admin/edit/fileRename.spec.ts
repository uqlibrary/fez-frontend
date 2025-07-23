import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListJournalArticle';
import { adminEditVerifyAlerts, loadRecordForAdminEdit } from '../helpers';

const getFilenamePart = (filename: string): string => String(filename.split('.').shift());
const getFilenameExtension = (filename: string): string => String(filename.split('.').pop());
const getNewFilename = (filename: string, extension: string): string => `${filename}.${extension}`;

test.describe('File rename admin edit', () => {
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

    test('should handle rename operations as expected', async ({ page }) => {
        const record = recordList.data[1];
        const vars = getIds(record, 1);
        await loadRecordForAdminEdit(page, record.rek_pid);
        console.log('Files Tab');
        await expect(page.getByTestId('files-section-header')).toHaveText('Files');
        const filesSectionContent = page.getByTestId('files-section-content');
        await expect(filesSectionContent.locator('h4').first()).toHaveText('Attached files');
        await expect(filesSectionContent.locator('p').first()).toHaveText(
            'There may be a delay before newly uploaded or renamed files appear on the record.',
        );
        await expect(filesSectionContent.locator('p').nth(2)).toHaveText(record.fez_datastream_info[1].dsi_dsid);

        // rename
        await expect(filesSectionContent.locator(`[data-testid=${vars.editId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.resetId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.filenameText}]`)).toHaveText(
            vars.originalFilename,
        );

        // rename pass 1
        await filesSectionContent.locator(`[data-testid=${vars.editId}]`).click();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.saveId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.cancelId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).toHaveValue(vars.originalFilepart);
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).clear();
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).fill(newFilename);
        await filesSectionContent.locator(`[data-testid=${vars.saveId}]`).click();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.saveId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.cancelId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.resetId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editedId}]`)).toHaveText(vars.newFilenamefull);

        // rename pass 2
        await filesSectionContent.locator(`[data-testid=${vars.editId}]`).click();
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).fill(`${newFilename}d`); // Use fill to overwrite
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).toHaveValue(`${newFilename}d`);
        await filesSectionContent.locator(`[data-testid=${vars.saveId}]`).click();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editedId}]`)).toContainText(`${newFilename}d`);

        // cancel a rename
        await filesSectionContent.locator(`[data-testid=${vars.editId}]`).click();
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).fill(`${newFilename}d-again`); // Use fill
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).toHaveValue(
            `${newFilename}d-again`,
        );
        await filesSectionContent.locator(`[data-testid=${vars.cancelId}]`).click();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editedId}]`)).toContainText(`${newFilename}d`);

        // reset renamed file to original
        await filesSectionContent.locator(`[data-testid=${vars.resetId}]`).click();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.resetId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.filenameText}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editedId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.filenameText}]`)).toContainText(
            vars.originalFilename,
        );

        // invalid filename
        await expect(page.locator(`[data-testid=${alertId}]`)).not.toBeVisible(); // Alert is outside filesSectionContent scope
        await filesSectionContent.locator(`[data-testid=${vars.editId}]`).click();
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).fill(invalidFilename);
        await filesSectionContent.locator(`[data-testid=${vars.saveId}]`).click();
        // state of input should remain visible and not return to text-only
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.saveId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.cancelId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.filenameText}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editedId}]`)).not.toBeVisible();
        await expect(page.locator(`[data-testid=${alertId}]`)).toBeVisible(); // Alert is outside filesSectionContent scope
        await expect(page.locator(`[data-testid=${alertId}]`)).toContainText('invalid file name'); // Use toContainText for partial match
        await filesSectionContent.locator(`[data-testid=${vars.cancelId}]`).click();
        await expect(page.locator(`[data-testid=${alertId}]`)).not.toBeVisible(); // Alert is outside filesSectionContent scope

        // Other elements within filesSectionContent
        await expect(filesSectionContent.locator('h4', { hasText: 'Advisory statement' })).toBeVisible();
        await expect(filesSectionContent.locator('h4', { hasText: 'Copyright agreement' })).toBeVisible();

        const checkbox = filesSectionContent.getByTestId('rek-copyright-input');
        if (record.rek_copyright === 'on') {
            await expect(checkbox).toBeChecked();
        } else {
            await expect(checkbox).not.toBeChecked();
        }

        await page.getByTestId('rek-copyright-input').click(); // This click is likely on the main page, not scoped to filesSectionContent.
        await adminEditVerifyAlerts(page, 1, ['You are required to accept deposit agreement']);
    });

    test('should prevent renaming conflicts', async ({ page }) => {
        const record = recordList.data[2];
        const vars = getIds(record, 12);
        await loadRecordForAdminEdit(page, record.rek_pid);
        // rename
        const filesSectionContent = page.getByTestId('files-section-content');
        await expect(filesSectionContent.locator(`[data-testid=${vars.editId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.resetId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.filenameText}]`)).toHaveText(
            vars.originalFilename,
        );

        // rename pass 1 - cant rename a file to a filename that already exists in the DS
        const anotherExistingFilename = record.fez_datastream_info[13].dsi_dsid;
        const anotherExistingFilenamePart = getFilenamePart(anotherExistingFilename);
        await filesSectionContent.locator(`[data-testid=${vars.editId}]`).click();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.saveId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.cancelId}]`)).toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${vars.editingId}]`)).toHaveValue(vars.originalFilepart);
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).clear();
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).fill(anotherExistingFilenamePart);
        await filesSectionContent.locator(`[data-testid=${vars.saveId}]`).click();
        await expect(page.locator(`[data-testid=${alertId}]`)).toBeVisible(); // Alert is outside filesSectionContent scope
        await expect(page.locator(`[data-testid=${alertId}]`)).toContainText('name matches with an existing file.'); // Use toContainText
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).clear();
        await filesSectionContent.locator(`[data-testid=${vars.editingId}]`).fill(newFilename);
        await filesSectionContent.locator(`[data-testid=${vars.saveId}]`).click();
        await expect(page.locator(`[data-testid=${alertId}]`)).not.toBeVisible(); // Alert is outside filesSectionContent scope

        // pass 2 - can't rename another file using the original filename of a file we've renamed
        const vars2 = getIds(record, 13);
        await filesSectionContent.locator(`[data-testid=${vars2.editId}]`).click();
        await filesSectionContent.locator(`[data-testid=${vars2.editingId}]`).clear();
        await filesSectionContent.locator(`[data-testid=${vars2.editingId}]`).fill(vars.originalFilepart);
        await filesSectionContent.locator(`[data-testid=${vars2.saveId}]`).click();
        await expect(page.locator(`[data-testid=${alertId}]`)).toBeVisible(); // Alert is outside filesSectionContent scope
        await expect(page.locator(`[data-testid=${alertId}]`)).toContainText('name matches with an existing file.'); // Use toContainText
        await filesSectionContent.locator(`[data-testid=${vars2.cancelId}]`).click();
        await expect(page.locator(`[data-testid=${alertId}]`)).not.toBeVisible(); // Alert is outside filesSectionContent scope

        // pass 3 - can't rename another file using the new filename of a file we've renamed
        const vars3 = getIds(record, 14);
        await filesSectionContent.locator(`[data-testid=${vars3.editId}]`).click();
        await filesSectionContent.locator(`[data-testid=${vars3.editingId}]`).clear();
        await filesSectionContent.locator(`[data-testid=${vars3.editingId}]`).fill(newFilename);
        await filesSectionContent.locator(`[data-testid=${vars3.saveId}]`).click();
        await expect(page.locator(`[data-testid=${alertId}]`)).toBeVisible(); // Alert is outside filesSectionContent scope
        await expect(page.locator(`[data-testid=${alertId}]`)).toContainText('name matches with an existing file.'); // Use toContainText
    });

    test('should not present rename buttons on mobile', async ({ page }) => {
        const record = recordList.data[1];
        await loadRecordForAdminEdit(page, record.rek_pid);
        await page.setViewportSize({ width: 584, height: 1000 });

        const editId = `file-name-${record.fez_datastream_info[1].dsi_id}-edit`;
        const resetId = `file-name-${record.fez_datastream_info[1].dsi_id}-reset`;
        const filenameText = `file-name-${record.fez_datastream_info[1].dsi_id}`;
        const originalFilename = record.fez_datastream_info[1].dsi_dsid;
        const filesSectionContent = page.getByTestId('files-section-content');
        await expect(filesSectionContent.locator(`[data-testid=${editId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${resetId}]`)).not.toBeVisible();
        await expect(filesSectionContent.locator(`[data-testid=${filenameText}]`)).toHaveText(originalFilename);
    });
});
