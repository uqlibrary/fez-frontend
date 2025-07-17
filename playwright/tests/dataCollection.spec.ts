import { test, expect, Page } from '../lib/fixture';
import { clickAutoSuggestion } from '../support/commands';

test.describe('Data Collection form', () => {
    let errorCount = 13;

    test.beforeEach(async ({ page }) => await page.goto('/data-collections/add'));

    async function submitButtonCorrect(page: Page, incrementErrorCountBy = 0) {
        errorCount = errorCount + incrementErrorCountBy;
        await expect(page.getByTestId('submit-data-collection')).toBeVisible();
        if (errorCount === 0) {
            await expect(page.getByTestId('submit-data-collection')).toBeEnabled();
            await expect(page.locator('[data-testid=alert] li')).toHaveCount(0);
            return;
        } else {
            await expect(page.getByTestId('submit-data-collection')).toBeDisabled();
            await expect(page.locator('[data-testid=alert] li')).toHaveCount(errorCount);
        }
    }

    test('correctly validates', async ({ page }) => {
        // 'validates deposit agreement'
        await submitButtonCorrect(page);

        // Accept the agreement
        await page.getByTestId('rek-copyright-input').click();
        await submitButtonCorrect(page, -1);

        // 'validates Dataset information'

        // Dataset name
        await page.getByTestId('rek-title-input').fill('Name of Dataset');
        await submitButtonCorrect(page, -1);

        // Dataset description
        await page.getByTestId('rek-description-input').fill('Description of Dataset');
        await submitButtonCorrect(page, -1);

        // Contact name
        await page.getByTestId('rek-contributor-input').fill('Ky Lane');
        await submitButtonCorrect(page, -1);

        // Contact name ID
        await page.getByTestId('rek-contributor-id-input').fill('David');
        await page
            .getByTestId('rek-contributor-id-options')
            .getByText(/David Stevens/)
            .first()
            .click();

        await submitButtonCorrect(page, -1);

        // Contact email
        await page.getByTestId('rek-contact-details-email-input').fill('k.lane@');
        await expect(
            page
                .locator('#rek-contact-details-email-helper-text')
                .getByText(/Email address is not valid/)
                .first(),
        ).toHaveCount(1);
        await submitButtonCorrect(page);
        await page.getByTestId('rek-contact-details-email-input').pressSequentially('uq.edu.au');
        await submitButtonCorrect(page, -1);

        // DOI
        await page.getByTestId('rek-doi-input').fill('test');
        await expect(
            page
                .locator('#rek-doi-helper-text')
                .getByText(/DOI is not valid/)
                .first(),
        ).toHaveCount(1);
        await page.getByTestId('rek-doi-input').pressSequentially('Backspace');
        await page.getByTestId('rek-doi-input').fill('10.1037/a0028240');

        await submitButtonCorrect(page, 1);

        // Publisher
        await page.getByTestId('rek-publisher-input').fill('A publisher');
        await submitButtonCorrect(page);

        // Publication date
        await page.getByTestId('rek-date-day-input').fill('16');
        await submitButtonCorrect(page);
        await page.getByTestId('rek-date-month-select').click();
        await page.locator('li[data-value="11"]').click();
        await submitButtonCorrect(page);
        await page.getByTestId('rek-date-year-input').fill('1976');
        await submitButtonCorrect(page, -1);

        // 'validates FoR codes'
        // Field of research
        await page.getByTestId('rek-subject-input').fill('a');
        await page
            .getByTestId('rek-subject-options')
            .getByText(/010101/)
            .first()
            .click();

        await submitButtonCorrect(page, -1);
        await page.locator('button#field-of-research-list-row-0-delete').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();

        await submitButtonCorrect(page, 1);
        await page.getByTestId('rek-subject-input').fill('b');
        await page
            .getByTestId('rek-subject-options')
            .getByText(/010101/)
            .first()
            .click();

        await submitButtonCorrect(page, -1);
        await page.getByTestId('rek-subject-input').fill('a');
        await page
            .getByTestId('rek-subject-options')
            .getByText(/010102/)
            .first()
            .click();
        await page.locator('button#delete-all-field-of-research').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();

        await submitButtonCorrect(page, 1);
        await page.getByTestId('rek-subject-input').fill('b');
        await page
            .getByTestId('rek-subject-options')
            .getByText(/010102/)
            .first()
            .click();

        await submitButtonCorrect(page, -1);

        // 'validates creators

        // Creators
        await page.getByTestId('rek-author-input').fill('Ky Lane');
        await submitButtonCorrect(page);
        await page
            .locator('div#contributorForm')
            .getByTestId('rek-author-role-input')
            .fill('Custom role');
        await page.locator('button[data-testid=rek-author-add]').click();
        await submitButtonCorrect(page, -1);
        await page.getByTestId('rek-author-input').fill('Vishal Asai');
        await page
            .locator('div#contributorForm')
            .getByTestId('rek-author-role-input')
            .click();
        await page
            .locator('li[role="option"]')
            .getByText(/Technician/)
            .first()
            .click();
        await page.locator('button#rek-author-list-row-delete-1').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();

        await submitButtonCorrect(page);
        await page.locator('button[aria-label="Remove all items"]').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();

        await submitButtonCorrect(page, 1);
        await page.getByTestId('rek-author-input').fill('Ky Lane');
        await page.getByTestId('rek-author-role-input').fill('UX Developer');
        await page.locator('button[data-testid=rek-author-add]').click();
        await submitButtonCorrect(page, -1);

        // 'validates access and licensing info'

        // Access conditions
        await page.getByTestId('rek-access-conditions-select').click();
        await page.locator('li[data-value="453618"]').click();
        await submitButtonCorrect(page, -1);
        await page.getByTestId('rek-access-conditions-select').click();
        await page.locator('li[data-value="453619"]').click();
        await submitButtonCorrect(page);

        // Licensing and terms of access
        await page.getByTestId('rek-license-select').click();
        await page.locator('li[data-value="454104"]').click();
        await submitButtonCorrect(page, -1);

        // Copyright notice
        await page.getByTestId('rek-rights-input').fill('This is a copyright notice');
        await submitButtonCorrect(page);

        // 'validates project information'
        await submitButtonCorrect(page);

        // Project name
        await page.getByTestId('rek-project-name-input').fill('This is the project name');
        await submitButtonCorrect(page, -1);

        // Project description
        await page
            .getByTestId('rek-project-description-input')
            .fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum non purus id aliquet. ');

        await submitButtonCorrect(page, -1);

        // Funding body
        await page.getByTestId('rek-grant-agency-input').fill('Funding body 1');
        await page.getByTestId('rek-grant-agency-add').click();
        await page.getByTestId('rek-grant-agency-input').fill('Funding body 2');
        await page.getByTestId('rek-grant-agency-add').click();
        await page.getByTestId('rek-grant-agency-list-row-1-move-up').click();
        await page.getByTestId('rek-grant-agency-list-row-0-delete').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        await page.locator('#delete-all-rek-grant-agency').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('rek-grant-agency-input').fill('Funding body 3');
        await page.getByTestId('rek-grant-agency-add').click();
        await submitButtonCorrect(page);

        // Grant ID
        await page.getByTestId('rek-grant-id-input').fill('Grant ID 1');
        await page.getByTestId('rek-grant-id-add').click();
        await page.getByTestId('rek-grant-id-input').fill('Grant ID 2');
        await page.getByTestId('rek-grant-id-add').click();
        await page.getByTestId('rek-grant-id-list-row-1-move-up').click();
        await page.getByTestId('rek-grant-id-list-row-0-delete').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('delete-all-rek-grant-id').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('rek-grant-id-input').fill('Grant ID 3');
        await page.getByTestId('rek-grant-id-add').click();
        await submitButtonCorrect(page);

        // 'validates dataset details'

        // Type of data
        await page.getByTestId('rek-type-of-data-input').fill('Type of data 1');
        await page.getByTestId('rek-type-of-data-add').click();
        await page.getByTestId('rek-type-of-data-input').fill('Type of data 2');
        await page.getByTestId('rek-type-of-data-add').click();
        await page.getByTestId('rek-type-of-data-list-row-1-move-up').click();
        await page.getByTestId('rek-type-of-data-list-row-0-delete').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('delete-all-rek-type-of-data').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('rek-type-of-data-input').fill('Type of data 3');
        await page.getByTestId('rek-type-of-data-add').click();
        await submitButtonCorrect(page);

        // Software required
        await page.getByTestId('rek-software-required-input').fill('Software required 1');
        await page.getByTestId('rek-software-required-add').click();
        await page.getByTestId('rek-software-required-input').fill('Software required 2');
        await page.getByTestId('rek-software-required-add').click();
        await page.getByTestId('rek-software-required-list-row-1-move-up').click();
        await page.getByTestId('rek-software-required-list-row-0-delete').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('delete-all-rek-software-required').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('rek-software-required-input').fill('Software required 3');
        await page.getByTestId('rek-software-required-add').click();
        await submitButtonCorrect(page);

        // Keywords
        await page.getByTestId('rek-keywords-input').fill('Keywords 1');
        await page.getByTestId('rek-keywords-add').click();
        await page.getByTestId('rek-keywords-input').fill('Keywords 2');
        await page.getByTestId('rek-keywords-add').click();
        await page.getByTestId('rek-keywords-list-row-1-move-up').click();
        await page.getByTestId('rek-keywords-list-row-0-delete').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('delete-all-rek-keywords').click();
        await page
            .locator('[role="dialog"] button')
            .getByText(/Yes/)
            .first()
            .click();
        await page.getByTestId('rek-keywords-input').fill('Keywords 3');
        await page.getByTestId('rek-keywords-add').click();
        await submitButtonCorrect(page);

        // Collection Start date
        // the field is not required - if we focus on it, type something in, clear and click on a different field,
        // we do not get an error
        await page.getByTestId('rek-start-date-day-input').fill('16');
        await page.getByTestId('rek-start-date-day-input').clear();
        await page.getByTestId('rek-keywords-input').fill('Keywords 1');
        await expect(page.locator('p', { hasText: /Invalid day/ }).first()).not.toBeVisible();

        // an 31st of april is an invalid date
        await page.getByTestId('rek-start-date-day-input').fill('31');
        await page.getByTestId('rek-start-date-month-select').click();
        await page.locator('li[data-value="3"]').click();
        await page.getByTestId('rek-start-date-year-input').fill('2000');
        await expect(page.locator('p', { hasText: /Invalid date/ }).first()).toBeVisible();

        // now check valid dates
        await page.getByTestId('rek-start-date-day-input').clear();
        await page.getByTestId('rek-start-date-day-input').fill('16');

        // enter future date and see error
        await page.getByTestId('rek-start-date-year-input').clear();
        await page.getByTestId('rek-start-date-year-input').fill('2100');
        await expect(page.locator('p', { hasText: /Date must be before now/ }).first()).toBeVisible();

        // enter valid year
        await page.getByTestId('rek-start-date-year-input').clear();
        await page.getByTestId('rek-start-date-year-input').fill('1976');
        await expect(page.locator('p', { hasText: /Date must be before now/ }).first()).not.toBeVisible();
        await submitButtonCorrect(page);

        // End Collection date
        await page.getByTestId('rek-end-date-day-input').fill('16');
        await page
            .getByTestId('rek-end-date-month-select')
            .locator('..')
            .click();
        await page.locator('li[data-value="11"]').click();

        // enter future date and see error
        await page.getByTestId('rek-end-date-year-input').fill('2100');
        await expect(page.locator('p', { hasText: /Date must be before now/ }).first()).toBeVisible();

        // enter end date before start date and see error
        await page.getByTestId('rek-end-date-year-input').clear();
        await page.getByTestId('rek-end-date-year-input').fill('1974');
        await expect(page.locator('p', { hasText: /Date range is not valid/ }).first()).toBeVisible();

        // finally, enter valid date
        await page.getByTestId('rek-end-date-year-input').clear();
        await page.getByTestId('rek-end-date-year-input').fill('1976');
        await expect(page.locator('p', { hasText: /Date range is not valid/ }).first()).not.toBeVisible();

        await submitButtonCorrect(page);

        // 'validates related datasets/work'
        await submitButtonCorrect(page);

        // Related datasets
        await page.getByTestId('rek-isdatasetof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-isdatasetof', 0);
        await submitButtonCorrect(page);
        await page.getByTestId('rek-isdatasetof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-isdatasetof', 1);
        await submitButtonCorrect(page);
        await expect(page.locator('#related-datasets-list-row-0')).toHaveText(/A state-based vaccination register/);
        await expect(page.locator('#related-datasets-list-row-1')).toHaveText(
            /Bacterial plaques staining composition <sup>for<\/sup> evaluating dental <sub>caries<\/sub> activity/,
        );
        await page.locator('#related-datasets-list-row-1-move-up').click();
        await expect(page.locator('#related-datasets-list-row-0')).toHaveText(
            /Bacterial plaques staining composition <sup>for<\/sup> evaluating dental <sub>caries<\/sub> activity/,
        );
        await expect(page.locator('#related-datasets-list-row-1')).toHaveText(/A state-based vaccination register/);
        await submitButtonCorrect(page);
    });
});
