import { test, expect } from '../test';

import { myRecordsList } from 'mock/data/records';
import { setFileInput } from '../lib/helpers';

const record = myRecordsList.data[0];
test.describe('forms', () => {
    /**
     * This test asserts that the data submitted by forms will not include corrupted files.
     * How does it work? We intercept PUT requests made to S3 pre-signed URLs using api mock
     * (axios-mock-adapter instance). In this middleware, we assert that the request's payload is an instance of
     * WebApi/File. If the data submitted by a form is malformed, the mocked endpoint will throw an exception making
     * the form submission and the test below to fail.
     *
     * Notes:
     * - in order for this to work, we have to assert that the form has been submitted correctly. e.g. check for a
     * submission confirmation message. For this, we need to make sure the form properly handles failed
     * uploads. e.g. displays an error message.
     * - we use FixRecords component here for the sake of simplicity. Should this form be removed in the future, please
     * refactor this test to use another form that has a field based on FileUploader component and uses
     * repositories/files::putUploadFile() for uploading files.
     */
    test('should not upload corrupted files', async ({ page }) => {
        // fill up form
        await page.goto(`/records/${record.rek_pid}/fix`);
        await page.getByTestId('fix-action-select').click();
        await page.getByText(/I am the author/).click();
        await setFileInput(page.getByTestId('fez-datastream-info-input'), 'test.jpg');
        await page.getByTestId('dsi-open-access-0-select').click();
        await page.getByText(/Closed Access/).click();

        // submit form and make sure dialog message is shown
        await page
            .locator('button', { hasText: /Submit/ })
            .first()
            .click();
        await expect(page.getByText(/Your request has been submitted/i).first()).toBeVisible();
    });
});
