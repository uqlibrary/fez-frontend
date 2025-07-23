import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListDigilibImage';
import { setFileInput, testIdStartsWith } from '../../../lib/helpers';
import { loadRecordForAdminEdit } from '../helpers';

const getFilenamePart = filename => filename.split('.').shift();

test.describe('File Upload Order', () => {
    const record = recordList.data[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should allow up and down ordering for newly attached files', async ({ page }) => {
        const file1 = 'test.jpg';
        const file2 = 'test_two.jpg';
        await setFileInput(page.getByTestId('fez-datastream-info-input'), file1);
        await setFileInput(page.getByTestId('fez-datastream-info-input'), file2);
        await expect(page.getByTestId('dsi-dsid-0')).toContainText(file1);
        await expect(page.getByTestId('dsi-dsid-1')).toContainText(file2);
        await page.getByTestId('new-file-upload-down-0').click();
        await expect(page.getByTestId('dsi-dsid-0')).toContainText(file2);
        await expect(page.getByTestId('dsi-dsid-1')).toContainText(file1);
        await page.getByTestId('new-file-upload-down-0').click();
        await expect(page.getByTestId('dsi-dsid-0')).toContainText(file1);
        await expect(page.getByTestId('dsi-dsid-1')).toContainText(file2);
    });

    test('should allow up and down ordering for existing attached files', async ({ page }) => {
        const file1 = 'BA_MM_147.tif';
        const file2 = 'BA_MM_147_2.tif';
        const scope = page.getByTestId('standard-card-attached-files-content');
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').nth(0)).toContainText(file1);
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').nth(1)).toContainText(file2);
        await scope.getByTestId('order-down-file-0').click();
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').nth(0)).toContainText(file2);
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').nth(1)).toContainText(file1);
        await scope.getByTestId('order-down-file-0').click();
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').nth(0)).toContainText(file1);
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').nth(1)).toContainText(file2);
    });

    test('should allow up and down ordering for existing attached files when renaming', async ({ page }) => {
        const file1 = 'BA_MM_147.tif';
        const file2 = 'BA_MM_147_2.tif';
        const file1name = getFilenamePart(file1);
        const file2name = getFilenamePart(file2);
        const scope = page.getByTestId('standard-card-attached-files-content');
        // show the edit inputs
        await scope.getByTestId('file-name-1-edit').click();
        await scope.getByTestId('file-name-2-edit').click();
        await expect(scope.getByTestId('file-name-1-editing-input')).toHaveValue(file1name);
        await expect(scope.getByTestId('file-name-2-editing-input')).toHaveValue(file2name);

        // reorder the rows down
        await scope.getByTestId('order-down-file-0').click();
        await expect(scope.getByTestId('file-name-2-editing-input')).toHaveValue(file2name);
        await expect(scope.getByTestId('file-name-1-editing-input')).toHaveValue(file1name);

        // reorder the rows up
        await scope.getByTestId('order-up-file-1').click();
        await expect(scope.getByTestId('file-name-1-editing-input')).toHaveValue(file1name);
        await expect(scope.getByTestId('file-name-2-editing-input')).toHaveValue(file2name);

        // reorder down again
        await scope.getByTestId('order-down-file-0').click();

        // save the filenames to set the filenames back to text in page rather than input
        await scope.getByTestId('file-name-1-save').click();
        await scope.getByTestId('file-name-2-save').click();

        // confirm the filenames are as expected in the new order
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').first()).toContainText(file2);
        await expect(testIdStartsWith(scope, 'fez-datastream-info-attached-list-row-').nth(1)).toContainText(file1);
    });
});
