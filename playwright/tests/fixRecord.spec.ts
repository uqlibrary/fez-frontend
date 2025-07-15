import { test, expect } from '../lib/fixture';

import formsLocale from '../../src/locale/forms';
import { myRecordsList } from '../../src/mock/data/records';
import { navToHomeFromMenu } from '../support/commands';

const record = myRecordsList.data[0];

test.describe('Request correction form', () => {
    const fixFormLocale = formsLocale.forms.fixPublicationForm;
    const unfixFormLocale = formsLocale.forms.unclaimPublicationForm;

    test.beforeEach(async ({ page }) => {
        await page.goto(`/records/${record.rek_pid}/fix`);
    });

    test.afterEach(async ({ page }) => {
        await navToHomeFromMenu(page, fixFormLocale.cancelWorkflowConfirmation);
    });

    test('should render as expected', async ({ page }) => {
        await expect(
            page.locator('h2', { hasText: /Request a correction, add more information or upload files/ }).first(),
        ).toBeVisible();
        await expect(page.locator('.StandardCard')).toHaveCount(1);
        await expect(
            page
                .locator('.StandardCard')
                .locator('h3', { hasText: /Work to be amended/ })
                .first(),
        ).toBeVisible();
        await expect(
            page.locator('.StandardCard .publicationCitation h6 a', { hasText: record.rek_title }).first(),
        ).toBeVisible();
        await expect(
            page
                .getByTestId('rek-content-indicator')
                .getByText(/Scholarship of Teaching and Learning/)
                .first(),
        ).toBeVisible();
        await expect(page.getByText(/Select an action/).first()).toBeVisible();
        await expect(page.locator('[data-testid=alert]', { hasText: /Validation/ }).first()).toBeVisible();
        await expect(page.locator('button', { hasText: /Cancel/ }).first()).toBeVisible();
    });

    test('should show expected fields on confirming authorship', async ({ page }) => {
        await page.getByTestId('fix-action-select').click();
        await page
            .getByTestId('fix-action-options')
            .getByText(/I am the author/)
            .first()
            .click();
        await expect(page.locator('.StandardCard h3').getByText(fixFormLocale.contentIndicators.title)).toBeVisible();
        await expect(page.locator('.StandardCard h3').getByText(fixFormLocale.comments.title)).toBeVisible();
        await expect(page.locator('.StandardCard h3').getByText(fixFormLocale.fileUpload.title)).toBeVisible();
        await expect(page.locator('button', { hasText: /Submit/ }).first()).toBeDisabled();
    });

    test('should show expected message on denying authorship', async ({ page }) => {
        await page.getByTestId('fix-action-select').click();
        await page
            .getByTestId('fix-action-options')
            .getByText(/I am not the author/)
            .first()
            .click();
        await expect(page.locator('.StandardCard h3').getByText(unfixFormLocale.title)).toBeVisible();
        await expect(page.locator('.StandardCard').getByText(unfixFormLocale.alert.title)).toBeVisible();
        await expect(page.locator('.StandardCard').getByText(unfixFormLocale.alert.message)).toBeVisible();
        await expect(page.locator('button', { hasText: /Submit/ }).first()).not.toBeDisabled();
    });

    test('allows selection of unselected content indicators, but does not allow deselection of existing', async ({
        page,
    }) => {
        await page.getByTestId('fix-action-select').click();
        await page
            .getByTestId('fix-action-options')
            .getByText(/I am the author/)
            .first()
            .click();
        await page
            .getByText(fixFormLocale.contentIndicators.title)
            .first()
            .scrollIntoViewIfNeeded();
        await page.getByTestId('rek-content-indicator-select').click();
        // Click new item in multiselect modal
        await page
            .getByTestId('rek-content-indicator-options')
            .getByText(/Protocol/)
            .first()
            .click();

        // Click outside the multiselect
        await page.getByTestId('rek-content-indicator-options').click({ position: { x: 10, y: 10 } });
        await page
            .getByTestId('rek-content-indicator-select')
            .getByText(/Scholarship of Teaching and Learning, Protocol/)
            .first()
            .click();

        // Preselected item in multiselect modal should be unclickable
        await expect(
            page
                .getByTestId('rek-content-indicator-options')
                .getByText(/Scholarship of Teaching and Learning/)
                .first(),
        ).toHaveCSS('pointer-events', 'none');
        // Click outside the multiselect
        await page.getByTestId('rek-content-indicator-options').click({ position: { x: 10, y: 10 } });
        // Selection has not changed
        await expect(
            page
                .getByTestId('rek-content-indicator-select')
                .getByText(/Scholarship of Teaching and Learning, Protocol/)
                .first(),
        ).toBeVisible();
    });

    test('will detect and prevent submission of invalid URLs', async ({ page }) => {
        await page.getByTestId('fix-action-select').click();
        await page
            .getByTestId('fix-action-options')
            .getByText(/I am the author/)
            .first()
            .click();

        // Enter invalid data triggers validation errors
        await page
            .locator('.StandardCard', { hasText: fixFormLocale.comments.title })
            .first()
            .locator('input')
            .fill('invalid');
        await expect(page.locator('.StandardCard', { hasText: fixFormLocale.comments.title }).first()).toBeVisible();
        await expect(page.getByText(/URL is not valid/)).toBeVisible();

        // Confirm form submission is disabled until URL is fixed
        await expect(page.locator('button', { hasText: /Submit/ }).first()).toBeDisabled();
        await page
            .locator('.StandardCard', { hasText: fixFormLocale.comments.title })
            .first()
            .locator('input')
            .fill('.com');
        await expect(page.locator('button', { hasText: /Submit/ }).first()).toBeDisabled();
        await page
            .locator('.StandardCard', { hasText: fixFormLocale.comments.title })
            .first()
            .locator('input')
            .press('Home');
        await page
            .locator('.StandardCard', { hasText: fixFormLocale.comments.title })
            .first()
            .locator('input')
            .press('Delete');
        await page
            .locator('.StandardCard', { hasText: fixFormLocale.comments.title })
            .first()
            .locator('input')
            .press('Delete');
        await page
            .locator('.StandardCard', { hasText: fixFormLocale.comments.title })
            .first()
            .locator('input')
            .fill('https://');
        await expect(page.locator('button', { hasText: /Submit/ }).first()).not.toBeDisabled();
    });

    test('Can choose a content indicator, then submit the form', async ({ page }) => {
        await page.getByTestId('fix-action-select').click();
        await page
            .getByTestId('fix-action-options')
            .getByText(/I am the author/)
            .first()
            .click();
        await page.getByTestId('rek-content-indicator-select').click();
        // Click new item in multiselect modal
        await page
            .getByTestId('rek-content-indicator-options')
            .getByText(/Protocol/)
            .first()
            .click();
        await page.getByTestId('rek-content-indicator-options').click({ position: { x: 10, y: 10 } });
        await expect(page.locator('button', { hasText: /Submit/ }).first()).not.toBeDisabled();
        await page
            .locator('button', { hasText: /Submit/ })
            .first()
            .click();
        await expect(page.locator('[data-testid=alert] .alert-text')).toContainText(fixFormLocale.progressAlert.title);
        await expect(page.locator('[data-testid=alert] .alert-text')).toContainText(
            fixFormLocale.progressAlert.message,
        );
        await expect(page.locator('[data-testid=alert] .alert-text')).toContainText(fixFormLocale.successAlert.title);
        await expect(page.locator('[data-testid=alert] .alert-text')).toContainText(fixFormLocale.successAlert.message);
        await expect(
            page.locator('h2', { hasText: fixFormLocale.successWorkflowConfirmation.confirmationTitle }).first(),
        ).toHaveCount(1);
        await page
            .locator('button', { hasText: fixFormLocale.successWorkflowConfirmation.cancelButtonLabel })
            .first()
            .click();
        await expect(page).toHaveURL('/dashboard');
    });
});
