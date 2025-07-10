import { test, expect, Page } from '../lib/fixture';
import formsLocale from '../../src/locale/forms';
import {
    myRecordsList,
    publicationTypeListThesis,
    recordWithRDM,
    collectionRecord,
    recordThatFailsDeletion,
} from '../../src/mock/data/records';
import { baseURL } from '../support/constants';
import { assertTriggersDisabled, fillInput, navToHomeFromMenu } from '../support/commands';
import { typeCKEditor } from '../support/ckeditor';

const record = myRecordsList.data[0];
const recordWithCrossrefDoi = publicationTypeListThesis.data[0];
const recordWithDataCiteDoi = recordWithRDM;

const selectors = {
    reasonInput: '[data-testid=reason-input]',
    submitButton: '[data-testid=submit-delete-record]',
    cancelButton: '[data-testid=cancel-delete-record]',
};

const loadPage = async (page: Page, record: any) => {
    await page.goto(`/admin/delete/${record.rek_pid}?user=uqstaff`);
};

const assertNavigatedToViewPage = async (page: Page, record: any) => {
    await expect(page).toHaveURL(`${baseURL}/view/${record.rek_pid}`);
};

const triggerReasonFieldValidationError = async (page: Page) => {
    await fillInput(page, selectors.reasonInput, 'a', 256);
    await expect(page.getByTestId('reason-helper-text')).toContainText('Must be 255 characters or less');
};

test.describe('Delete work form', () => {
    const deleteFormLocale = formsLocale.forms.deleteRecordForm;

    test('should render as expected', async ({ page }) => {
        await loadPage(page, record);

        await expect(page.locator('h2')).toHaveText('Delete work');

        const cards = page.locator('.StandardCard');
        await expect(cards).toHaveCount(2);
        await expect(cards.nth(0).locator('h3')).toHaveText('Work to be deleted');

        await expect(cards.locator('.publicationCitation h6 a')).toContainText(record.rek_title);
        await expect(page.getByTestId('rek-content-indicator')).toContainText('Scholarship of Teaching and Learning');
        await expect(page.locator('text=Describe the reason to delete this work')).toBeVisible();

        await expect(page.getByRole('button', { name: 'Cancel' })).toBeEnabled();
        await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled();
    });

    test.describe('validation', () => {
        test.describe('form', () => {
            test('should validate reason field for a record without DOI', async ({ page }) => {
                await loadPage(page, record);
                await assertTriggersDisabled(
                    page,
                    selectors.submitButton,
                    async () => await triggerReasonFieldValidationError(page),
                );
            });

            test('should validate fields for a record with Crossref DOI', async ({ page }) => {
                await loadPage(page, recordWithCrossrefDoi);
                await assertTriggersDisabled(page, selectors.submitButton, async () => {
                    await triggerReasonFieldValidationError(page);
                    await fillInput(page, '[data-testid=rek-doi-resolution-url-input]', 'bad.url');
                    await expect(page.getByTestId('rek-doi-resolution-url-helper-text')).toContainText(
                        'URL is not valid',
                    );
                });
            });

            test('should validate fields for a record with DataCite DOI', async ({ page }) => {
                await loadPage(page, recordWithDataCiteDoi);
                await assertTriggersDisabled(page, selectors.submitButton, async () => {
                    await triggerReasonFieldValidationError(page);
                    await fillInput(page, '[data-testid=rek-new-doi-input]', '10.123.bad-doi');
                    await expect(page.getByTestId('rek-new-doi-helper-text')).toContainText('DOI is not valid');
                    await typeCKEditor(page, 'rek-deletion-notes', 'a'.repeat(2001));
                    const count = await page.locator('[data-testid=rek-deletion-notes] span').count();
                    await expect(page.locator('[data-testid=rek-deletion-notes] span').nth(count - 3)).toContainText(
                        'Must be 2000 characters or less',
                    );
                });
            });
        });

        test.describe('server', () => {
            test('should display "not found" message on 404', async ({ page }) => {
                await loadPage(page, { rek_pid: 'UQ:abc123' });
                await expect(page.getByTestId('page-title')).toContainText('Work not found');
            });

            test('should display error message on server error', async ({ page }) => {
                await loadPage(page, recordThatFailsDeletion);
                await expect(page.locator(selectors.submitButton)).toBeEnabled();
                await page.click(selectors.submitButton);
                await expect(page.getByTestId('ErrorOutlineIcon')).toBeVisible();
                await expect(page.locator(selectors.submitButton)).toBeEnabled();
                await expect(page.locator(selectors.cancelButton)).toBeEnabled();
            });

            test('should display error when trying to delete collection record with children', async ({ page }) => {
                await loadPage(page, collectionRecord);
                await expect(page.locator(selectors.submitButton)).toBeEnabled();
                await page.click(selectors.submitButton);
                await expect(page.getByTestId('ErrorOutlineIcon')).toBeVisible();
                await expect(page.locator(selectors.submitButton)).toBeEnabled();
                await expect(page.locator(selectors.cancelButton)).toBeEnabled();
            });
        });
    });

    test.describe('navigation', () => {
        test('should navigate to view record on cancel', async ({ page }) => {
            await loadPage(page, record);
            await expect(page.locator(selectors.cancelButton)).toBeEnabled();
            await page.click(selectors.cancelButton);
            await assertNavigatedToViewPage(page, record);
        });

        test('should allow navigating to search records after form submission', async ({ page }) => {
            await loadPage(page, record);
            await expect(page.locator(selectors.submitButton)).toBeEnabled();
            await page.click(selectors.submitButton);
            await page
                .getByRole('button', { name: deleteFormLocale.successWorkflowConfirmation.cancelButtonLabel })
                .click();
            await expect(page).toHaveURL(`${baseURL}/records/search`);
        });

        test('should show nav dialog when exit the form with reason entered', async ({ page }) => {
            await page.setViewportSize({ width: 1000, height: 660 });
            await loadPage(page, record);
            await fillInput(page, selectors.reasonInput, 'reason');
            await navToHomeFromMenu(page, deleteFormLocale);
        });
    });
});
