import { test, expect, Page } from '../test';

import formsLocale from 'locale/forms';
import fileUploaderLocale from 'modules/SharedComponents/Toolbox/FileUploader/locale';
import { navToHomeFromMenu, setFileInput } from '../lib/helpers';

test.describe('Claim possible work', () => {
    const claimFormLocale = formsLocale.forms.claimPublicationForm;

    const navToFirstClaim = async (page: Page) => {
        await page.goto('/records/possible');
        await expect(page.locator('[data-testid*="publication-action"]')).toHaveCount(16);
        await page.getByTestId('publication-action-UQ641272-primary').click();
        await expect(page).toHaveURL('/records/claim');
        await expect(page.getByTestId('page-title')).toBeVisible();
    };

    test.describe('Claim Possible Form', () => {
        test.afterEach(async ({ page }) => {
            await navToHomeFromMenu(page, claimFormLocale.cancelWorkflowConfirmation);
        });

        test('renders a list of possible works with filters', async ({ page }) => {
            await page.goto('/records/possible');
            await expect(page.locator('h2')).toHaveText(/Claim possible works/);
            await expect(page.locator('.StandardCard h6[class*="PublicationCitation-citationTitle"] > a')).toHaveCount(
                8,
            );
            await expect(page.locator('[class*="StandardRighthandCard-title"]')).toHaveText(/Refine results/);
            await expect(
                page.locator('[class*="MuiGrid-grid-sm-3"] .facetsFilter [class*="MuiListItem-root"]'),
            ).toHaveCount(6);
        });

        test('can navigate to a claim page with specific elements', async ({ page }) => {
            await navToFirstClaim(page);
            await expect(page.locator('h2')).toHaveCount(1);
            await expect(page.locator('h2')).toHaveText(claimFormLocale.title);
            await expect(page.getByText(claimFormLocale.claimingInformation.title)).toBeEnabled();
            await expect(page.getByText(claimFormLocale.authorLinking.title)).toBeEnabled();
            await expect(page.getByText(claimFormLocale.contributorLinking.title)).toBeEnabled();
            await expect(page.getByText(claimFormLocale.contentIndicators.title)).toBeEnabled();
            await expect(page.getByText(claimFormLocale.comments.title)).toBeEnabled();
            await expect(page.getByText(claimFormLocale.fileUpload.title)).toBeEnabled();
            await expect(page.getByTestId('alert').getByText(claimFormLocale.validationAlert.title)).toBeVisible();
            await expect(page.locator('button', { hasText: claimFormLocale.cancel })).not.toBeDisabled();
            await expect(page.locator('button', { hasText: claimFormLocale.submit })).toBeDisabled();
        });

        test('can cancel a claim after filling the form', async ({ page }) => {
            await navToFirstClaim(page);
            await expect(page.locator('.StandardCard', { hasText: claimFormLocale.comments.title })).toBeVisible();
            await page.getByTestId('claim-comments-input').fill('Test comment');
            await page.locator('button', { hasText: claimFormLocale.cancel }).click();
            await expect(
                page.locator('[role="dialog"]', {
                    hasText: claimFormLocale.cancelWorkflowConfirmation.confirmationTitle,
                }),
            ).toBeVisible();
            await page.getByText(claimFormLocale.cancelWorkflowConfirmation.confirmButtonLabel).click();
            await expect(page).toHaveURL('/records/possible');
        });

        test('allows selection of unselected content indicators, but does not allow deselection of existing', async ({
            page,
        }) => {
            await navToFirstClaim(page);
            await page.getByText(claimFormLocale.contentIndicators.title).scrollIntoViewIfNeeded();
            await page.getByTestId('rek-content-indicator-select').click();
            // Click new item in multiselect modal
            await page
                .getByTestId('rek-content-indicator-options')
                .getByText(/Protocol/)
                .click();

            // Click outside the multiselect
            await page.getByTestId('rek-content-indicator-options').click({ position: { x: 10, y: 10 } });
            await page
                .getByTestId('rek-content-indicator-select')
                .getByText(/Scholarship of Teaching and Learning, Protocol/)
                .click();

            // Preselected item in multiselect modal should be unclickable
            await expect(
                page
                    .getByTestId('rek-content-indicator-options')
                    .locator('li', { hasText: /Scholarship of Teaching and Learning/ }),
            ).toHaveCSS('pointer-events', 'none');
            // Click outside the multiselect
            await page.getByTestId('rek-content-indicator-options').click({ position: { x: 10, y: 10 } });
            // Selection has not changed
            await expect(
                page
                    .getByTestId('rek-content-indicator-select')
                    .getByText(/Scholarship of Teaching and Learning, Protocol/),
            ).toBeVisible();
        });

        test('will detect and prevent submission of invalid URLs', async ({ page }) => {
            await navToFirstClaim(page);
            // Make form valid otherwise
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.authorLinking.title })
                .locator('button')
                .click();
            await page.getByText(/I confirm and understand/).click();

            // Confirm form submission is enabled
            await expect(page.locator('button', { hasText: claimFormLocale.submit })).not.toBeDisabled();
            // Enter invalid data triggers validation errors
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.comments.title })
                .locator('input')
                .fill('invalid');
            await expect(
                page
                    .locator('.StandardCard', { hasText: claimFormLocale.comments.title })
                    .getByTestId('claim-link-helper-text')
                    .getByText(/URL is not valid/),
            ).toBeVisible();

            // Confirm form submission is disabled until URL is fixed
            await expect(page.locator('button', { hasText: claimFormLocale.submit })).toBeDisabled();
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.comments.title })
                .locator('input')
                .fill('.com');
            await expect(page.locator('button', { hasText: claimFormLocale.submit })).toBeDisabled();
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.comments.title })
                .locator('input')
                .press('Home');
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.comments.title })
                .locator('input')
                .press('Delete');
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.comments.title })
                .locator('input')
                .press('Delete');
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.comments.title })
                .locator('input')
                .fill('https://');
            await expect(page.locator('button', { hasText: claimFormLocale.submit })).not.toBeDisabled();
        });

        test('will allow upload of files', async ({ page }) => {
            await navToFirstClaim(page);
            await setFileInput(page.getByTestId('fez-datastream-info-input'), 'test.jpg');
            await expect(page.locator('.StandardCard', { hasText: claimFormLocale.fileUpload.title })).toBeVisible();
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

        test('can choose author, then submit the claim.', async ({ page }) => {
            await navToFirstClaim(page);
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.authorLinking.title })
                .locator('button')
                .click();
            await page.getByText(/I confirm and understand/).click();
            await expect(page.locator('button', { hasText: claimFormLocale.submit })).not.toBeDisabled();
            await page.locator('button', { hasText: claimFormLocale.submit }).click();
            await expect(
                page
                    .locator('div[role="dialog"]')
                    .getByText(claimFormLocale.successWorkflowConfirmation.confirmationTitle),
            ).toHaveCount(1);
            await page
                .locator('div[role="dialog"]')
                .locator('button', { hasText: claimFormLocale.successWorkflowConfirmation.cancelButtonLabel })
                .click();

            await expect(page).toHaveURL('/records/possible');
        });

        test('can choose editor, then submit the claim.', async ({ page }) => {
            await page.goto('/records/possible');
            await page
                .locator('.publicationCitation', { hasText: /Book with editors/ })
                .locator('button.publicationAction')
                .first()
                .click();

            await expect(page).toHaveURL('/records/claim');
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.contributorLinking.title })
                .locator('button')
                .first()
                .click();
            await page.getByText(/I confirm and understand/).click();
            await expect(page.locator('button', { hasText: claimFormLocale.submit })).not.toBeDisabled();
            await page.locator('button', { hasText: claimFormLocale.submit }).click();
            await expect(
                page
                    .locator('div[role="dialog"]')
                    .getByText(claimFormLocale.successWorkflowConfirmation.confirmationTitle),
            ).toHaveCount(1);
            await page
                .locator('div[role="dialog"]')
                .locator('button', { hasText: claimFormLocale.successWorkflowConfirmation.cancelButtonLabel })
                .click();

            await expect(page).toHaveURL('/records/possible');
        });
    });

    test.describe('Navigation Prompt', () => {
        test('should show prompt when navigate away white the form is dirty', async ({ page }) => {
            await navToFirstClaim(page);
            await page.setViewportSize({ width: 1000, height: 600 });
            await page
                .locator('.StandardCard', { hasText: claimFormLocale.authorLinking.title })
                .locator('button')
                .click();
            await page.getByText(/I confirm and understand/).click();

            await page.locator('button[aria-label="Click to open the main navigation"]').click();
            await page
                .locator('.menu-item-container')
                .getByText('My works')
                .click();

            await expect(
                page
                    .locator('div[role="dialog"]')
                    .getByText(claimFormLocale.cancelWorkflowConfirmation.confirmationTitle),
            ).toBeVisible();

            // cancel
            await page.getByTestId('cancel-dialog-box').click();
            // should remain on the same page
            await expect(page).toHaveURL('/records/claim');
            await page.locator('button[aria-label="Click to open the main navigation"]').click();
            await page
                .locator('.menu-item-container')
                .getByText('My works')
                .click();

            // confirm
            await page.getByTestId('confirm-dialog-box').click();
            // navigate away
            await expect(page).toHaveURL('/records/mine');
        });

        test('should not show prompt when navigate away white the form is untouched', async ({ page }) => {
            await navToFirstClaim(page);
            await page.locator('button[aria-label="Click to open the main navigation"]').click();
            await page
                .locator('.menu-item-container')
                .getByText(/My works/)
                .click();
            await expect(page.locator('div[role="dialog"]')).not.toBeVisible();
            // navigate away
            await expect(page).toHaveURL('/records/mine');
        });

        test('should handle clicking the Back button', async ({ page }) => {
            await page.goto('/records/possible');
            await expect(page.locator('h2')).toHaveText(/Claim possible works/);
            await page.getByTestId('expand-more-facet-category-display-type').click();
            await page.getByTestId('facet-filter-nested-item-display-type-journal-article').click();
            await expect(page.getByText('Journal Article (2)')).toBeVisible();
            await expect(page.getByTestId('clear-facet-filter-nested-item-display-type-journal-article')).toBeVisible();

            await page.goBack();
            await page.waitForTimeout(2000);

            await expect(page.getByText('Journal Article (2)')).toBeVisible(); // facet should still be visible
            await expect(
                page.getByTestId('clear-facet-filter-nested-item-display-type-journal-article'),
            ).not.toBeVisible();
        });
        test('should handle range changes', async ({ page }) => {
            await page.goto('/records/possible');
            await expect(page.locator('h2')).toHaveText(/Claim possible works/);
            await page.getByTestId('expand-more-facet-category-date-range').click();
            await page.getByTestId('from').fill('2020');
            await page.getByTestId('to').fill('2031');
            await page.getByText('Go').click();
            await page.waitForTimeout(500);
            await expect(page.getByText('2020 - 2031')).toBeVisible();
        });
    });
});
