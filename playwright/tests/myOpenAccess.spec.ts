import { expect, test, Page } from '../test';

import formsLocale from 'locale/forms';
import pagesLocale from 'locale/pages';
import fileUploaderLocale from 'modules/SharedComponents/Toolbox/FileUploader/locale';
import { navToHomeFromMenu, setFileInput } from '../lib/helpers';

test.describe('My Open Access', () => {
    const oaFormLocale = formsLocale.forms.openAccessComplianceForm;
    const oaPagesLocale = pagesLocale.pages.openAccessComplianceRecord;

    const navToFirstWork = async (page: Page) => {
        await page.goto('/records/my-open-access');
        await expect(page.locator('[data-testid*="publication-action"]')).toHaveCount(3);
        await page.getByTestId('publication-action-UQ678728-secondary').click();
        await expect(page).toHaveURL('/records/UQ:678728/make-open-access');
        await expect(page.getByTestId('page-title')).toBeVisible();
    };
    test.describe('My Open Access Form', () => {
        test.afterEach(async ({ page }) => {
            await navToHomeFromMenu(page, oaFormLocale.cancelWorkflowConfirmation);
        });

        test('renders a list of possible works with filters', async ({ page }) => {
            await page.goto('/records/my-open-access');
            await expect(page.locator('h2')).toHaveText(/My open access/);
            await expect(page.locator('.StandardCard h6[class*="PublicationCitation-citationTitle"] > a')).toHaveCount(
                3,
            );
            await expect(page.locator('[class*="StandardRighthandCard-title"]')).toHaveText(/Refine results/);
            await expect(page.locator('.facetsFilter [class*="MuiListItem-root"]')).toHaveCount(8);
        });

        test('can navigate to a works page with specific elements', async ({ page }) => {
            await navToFirstWork(page);
            await expect(page.locator('h2')).toHaveCount(1);
            await expect(page.locator('h2')).toHaveText(oaPagesLocale.title);
            await expect(page.getByText(oaFormLocale.comments.title)).toBeEnabled();
            await expect(page.getByText(oaFormLocale.fileUpload.title)).toBeEnabled();
            await expect(page.getByTestId('alert').getByText(oaFormLocale.validationAlert.title)).toBeVisible();
            await expect(page.getByRole('button', { name: oaPagesLocale.cancel })).not.toBeDisabled();
            await expect(page.getByRole('button', { name: oaPagesLocale.submit })).toBeDisabled();
        });

        test('can cancel a claim after filling the form', async ({ page }) => {
            await navToFirstWork(page);
            await expect(page.locator('.StandardCard', { hasText: oaFormLocale.comments.title })).toBeVisible();
            await page.getByTestId('comments-input').fill('Test comment');
            await page.locator('button', { hasText: oaPagesLocale.cancel }).click();
            await expect(
                page.locator('[role="dialog"]', {
                    hasText: oaFormLocale.cancelWorkflowConfirmation.confirmationTitle,
                }),
            ).toBeVisible();
            await page.getByText(oaFormLocale.cancelWorkflowConfirmation.confirmButtonLabel).click();
            await expect(page).toHaveURL('/records/my-open-access');
        });

        test('will detect and prevent submission of invalid URLs', async ({ page }) => {
            await navToFirstWork(page);

            // Confirm form submission is disabled
            await expect(page.locator('button', { hasText: oaPagesLocale.submit })).toBeDisabled();
            // Enter invalid data triggers validation errors
            await page
                .locator('.StandardCard', { hasText: oaFormLocale.comments.title })
                .locator('input')
                .fill('invalid');
            await expect(
                page
                    .locator('.StandardCard', { hasText: oaFormLocale.comments.title })
                    .getByTestId('rek_link-helper-text')
                    .getByText(/URL is not valid/),
            ).toBeVisible();

            // Confirm form submission is disabled until URL is fixed
            await expect(page.locator('button', { hasText: oaPagesLocale.submit })).toBeDisabled();
            await page.locator('.StandardCard', { hasText: oaFormLocale.comments.title }).locator('input').fill('.com');
            await expect(page.locator('button', { hasText: oaPagesLocale.submit })).toBeDisabled();
            await page
                .locator('.StandardCard', { hasText: oaFormLocale.comments.title })
                .locator('input')
                .press('Home');
            await page
                .locator('.StandardCard', { hasText: oaFormLocale.comments.title })
                .locator('input')
                .press('Delete');
            await page
                .locator('.StandardCard', { hasText: oaFormLocale.comments.title })
                .locator('input')
                .press('Delete');
            await page
                .locator('.StandardCard', { hasText: oaFormLocale.comments.title })
                .locator('input')
                .fill('https://');
            await expect(page.locator('button', { hasText: oaPagesLocale.submit })).not.toBeDisabled();
        });

        test('will allow upload of files', async ({ page }) => {
            await navToFirstWork(page);
            await setFileInput(page.getByTestId('fez-datastream-info-input'), 'test.jpg');
            await expect(page.locator('.StandardCard', { hasText: oaFormLocale.fileUpload.title })).toBeVisible();
            await expect(
                page.getByText(fileUploaderLocale.successMessage.replace('[numberOfFiles]', '1')),
            ).toBeVisible();
            await page.getByTestId('dsi-open-access-0-select').click();
            await page
                .getByTestId('dsi-open-access-0-options')
                .getByText(/Open Access/)
                .click();
            await page.locator('[class*="FileUploadTermsAndConditions-root"]').click();
        });

        test.describe('Navigation Prompt', () => {
            test('should show prompt when navigate away white the form is dirty', async ({ page }) => {
                await navToFirstWork(page);
                await page.setViewportSize({ width: 1000, height: 600 });

                await page.getByTestId('comments-input').fill('Test comment');

                await page.locator('button[aria-label="Click to open the main navigation"]').click();
                await page.locator('.menu-item-container').getByText('My works').click();

                await expect(
                    page
                        .locator('div[role="dialog"]')
                        .getByText(oaFormLocale.cancelWorkflowConfirmation.confirmationTitle),
                ).toBeVisible();

                // cancel
                await page.getByTestId('cancel-dialog-box').click();
                // should remain on the same page
                await expect(page).toHaveURL('/records/UQ:678728/make-open-access');
                await page.locator('button[aria-label="Click to open the main navigation"]').click();
                await page.locator('.menu-item-container').getByText('My works').click();

                // confirm
                await page.getByTestId('confirm-dialog-box').click();
                // navigate away
                await expect(page).toHaveURL('/records/mine');
            });

            test('should not show prompt when navigate away white the form is untouched', async ({ page }) => {
                await navToFirstWork(page);
                await page.locator('button[aria-label="Click to open the main navigation"]').click();
                await page
                    .locator('.menu-item-container')
                    .getByText(/My works/)
                    .click();
                await expect(page.locator('div[role="dialog"]')).not.toBeVisible();
                // navigate away
                await expect(page).toHaveURL('/records/mine');
            });
        });
    });
});
