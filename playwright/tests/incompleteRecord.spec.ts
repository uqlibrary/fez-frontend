import { test, expect, Page } from '../test';
import { readCKEditor, typeCKEditor } from '../lib/ckeditor'; // Assuming this is a custom helper

test.describe('Incomplete record form', () => {
    const checkSignificance = async (page: Page, significance: string) => {
        await page.getByTestId('rek-significance-select').click();
        await page
            .getByTestId('rek-significance-options')
            .getByText(significance, { exact: true }) // Use exact: true for precise text matching
            .click();
        await expect(page.getByTestId('rek-significance-select')).toHaveText(significance);
    };

    const checkResearchStatement = async (page: Page, statement: string) => {
        await typeCKEditor(page, 'rek-creator-contribution-statement', statement);
        expect(await readCKEditor(page, 'rek-creator-contribution-statement')).toContain(statement);
    };

    const checkAudienceSize = async (page: Page, sizeText: string) => {
        await page.getByTestId('rek-audience-size-select').click();
        await page
            .getByTestId('rek-audience-size-options')
            .getByText(sizeText, { exact: true })
            .click();
        await expect(page.getByTestId('rek-audience-size-select')).toHaveText(sizeText);
    };

    const checkQualityIndicators = async (page: Page, indicator: string) => {
        await page.getByTestId('rek-quality-indicator-select').click();
        await page
            .getByTestId('rek-quality-indicator-options')
            .locator('li')
            .filter({ hasText: indicator }) // Filter for the li that contains the text
            .click();
        await page.getByTestId('rek-quality-indicator-options').click({ position: { x: 10, y: 10 } });
        await expect(page.getByTestId('rek-quality-indicator-select')).toHaveText(indicator);
    };

    const checkNonDeletableAuthors = async (page: Page, authorCount: number) => {
        for (let i = 0; i < authorCount; i++) {
            await expect(page.locator(`#rek-author-list-row-delete-${i}`)).toBeDisabled();
        }
    };

    const authorEditInstruction = 'Step 2 of 2 - Update the affiliation information.';
    const grantMessage = 'You must click ADD GRANT to enter the value to the grants list';
    const validationErrorsSelector = '[data-testid=alert] li';

    const editNonUQAuthor = async (page: Page, authorNumber: number, orgName: string, orgType: string) => {
        await page.locator(`#rek-author-list-row-edit-${authorNumber}`).click();
        // We can find the parent of the clicked element and then find its sibling 'div' that contains the text.
        await expect(
            page
                .locator(`#rek-author-list-row-edit-${authorNumber}`)
                .locator('xpath=./ancestor::ul/following-sibling::div')
                .getByText(authorEditInstruction),
        ).toBeVisible();

        await expect(page.getByTestId('rek-author-add')).toBeDisabled(); // Use toBeDisabled for disabled attributes
        await expect(page.getByTestId('rek-author-input')).toBeDisabled(); // Use toBeDisabled

        await page.locator('#org-affiliation-name').fill(orgName);

        // Select affiliation type
        await page.locator('#org-affiliation-type').click();
        await page
            .locator('#menu-org-affiliation-type')
            .locator('li')
            .getByText(orgType, { exact: true })
            .click();

        // Apply changes
        await expect(page.getByTestId('rek-author-add')).toHaveAttribute('tabindex', '0');
        await expect(page.getByTestId('rek-author-add')).toBeEnabled(); // Use toBeEnabled for not.toHaveAttribute('disabled')
        await page.getByTestId('rek-author-add').click();

        // When checking for multiple contains, use toContainText with an array or multiple expect statements
        await expect(page.locator(`#rek-author-list-row-${authorNumber}`)).toContainText(orgName);
        await expect(page.locator(`#rek-author-list-row-${authorNumber}`)).toContainText(
            `Organisation type: ${orgType}`,
        );

        // Check that the instruction is no longer present within the parent .StandardCard
        await expect(
            page
                .locator('.StandardCard')
                .filter({ has: page.locator(`#rek-author-list-row-edit-${authorNumber}`) })
                .first(), // Use .first() if there are multiple StandardCard elements matching the filter
        ).not.toContainText(authorEditInstruction);
    };

    const editUQAuthor = async (page: Page, authorNumber: number) => {
        await page.locator(`#rek-author-list-row-edit-${authorNumber}`).click();
        await expect(
            page
                .locator(`#rek-author-list-row-edit-${authorNumber}`)
                .locator('xpath=./ancestor::ul/following-sibling::div')
                .getByText(authorEditInstruction),
        ).toBeVisible();

        await expect(page.getByTestId('rek-author-input')).toBeDisabled();

        // Mark as UQ author
        await page.locator('#org-affiliation-select').click();
        await expect(
            page
                .locator('#org-affiliation-options')
                .locator('li')
                .nth(1),
        ).not.toContainText('Not'); // Use toContainText for text checks

        await page
            .locator('#org-affiliation-options')
            .locator('li')
            .nth(1)
            .click();

        await expect(page.getByTestId('rek-author-input')).toBeDisabled();

        // Apply changes
        await expect(page.getByTestId('rek-author-add')).toHaveAttribute('tabindex', '0');
        await expect(page.getByTestId('rek-author-add')).toBeEnabled();
        await page.getByTestId('rek-author-add').click();

        await expect(page.locator(`#rek-author-list-row-${authorNumber}`)).toContainText(
            'The University of Queensland',
        );
        await expect(page.locator(`#rek-author-list-row-${authorNumber}`)).toContainText(
            'Organisation type: University',
        );

        await expect(
            page
                .locator('.StandardCard')
                .filter({ has: page.locator(`#rek-author-list-row-edit-${authorNumber}`) })
                .first(),
        ).not.toContainText(authorEditInstruction);
    };

    test('should allow completion of creative work', async ({ page }) => {
        const pid = 'UQ:352045';
        const authorUsername = 'uqrdav10';
        await page.goto(`/records/${pid}/incomplete?user=${authorUsername}`);
        await expect(page.locator('#update-my-work')).toBeDisabled();
        await checkSignificance(page, 'Major');
        await checkResearchStatement(page, 'Creator research statement');
        await checkAudienceSize(page, 'Less than 100');
        await checkQualityIndicators(page, 'Commissioned by external body');
        await checkNonDeletableAuthors(page, 4);
        await editNonUQAuthor(page, 0, 'Test org type', 'Government');
        await editUQAuthor(page, 1);
        await editUQAuthor(page, 3);
    });

    test('should allow completion of work with total pages field, a disabled author', async ({ page }) => {
        const pid = 'UQ:716942';
        const authorUsername = 'uqagrinb';
        await page.goto(`/records/${pid}/incomplete?user=${authorUsername}`);
        await expect(page.locator('#update-my-work')).toBeVisible();
        await expect(page.locator('#update-my-work')).toBeDisabled();
        await checkSignificance(page, 'Major');
        await checkResearchStatement(page, 'Creator research statement');
        await page.locator('#rek-total-pages-input').fill('10');
        await checkAudienceSize(page, 'Less than 100');
        await checkQualityIndicators(page, 'Commissioned by external body');
        await checkNonDeletableAuthors(page, 4);
        await expect(page.locator('#rek-author-list-row-edit-0')).toBeDisabled();
        await editUQAuthor(page, 1);
        await editNonUQAuthor(page, 2, 'Test org type', 'Government');
        await editUQAuthor(page, 3);

        await expect(page.locator(validationErrorsSelector)).toHaveCount(1);
        await expect(page.locator(validationErrorsSelector)).toContainText('File submission to be completed'); // Use toContainText
        await expect(page.locator('#update-my-work')).toBeDisabled();

        // 'should have working tests for Grants editor'
        await page.getByTestId('rek-grant-agency-input').fill('Grant name');
        await expect(page.getByTestId('rek-grant-add')).toBeDisabled();

        // To assert multiple texts within the same selector, you can get all and then check
        await expect(page.locator(validationErrorsSelector)).toHaveCount(2);
        await expect(page.locator(validationErrorsSelector).getByText(grantMessage)).toBeVisible();

        await page.getByTestId('rek-grant-id-input').fill('0001');
        await page.getByTestId('rek-grant-type-select').click();
        await page
            .locator('body > [role=presentation]')
            .locator('li')
            .getByText('Commercial Gallery', { exact: true }) // Use exact: true for specific text
            .click();
        await expect(page.getByTestId('rek-grant-type-input')).toHaveValue('453984');
        await expect(page.getByTestId('rek-grant-add')).toBeEnabled();
        await page.getByTestId('rek-grant-add').click();

        await expect(page.locator(validationErrorsSelector)).toHaveCount(1);
        await expect(page.locator(validationErrorsSelector)).not.toContainText(grantMessage);
    });

    test("should allow going back to list using browser's back button", async ({ page }) => {
        await page.goto('/records/incomplete');
        // navigate to the first incomplete work form
        await page
            .locator('button')
            .getByText(/complete work/i)
            .first()
            .click();

        // verify that the work form is loaded
        await expect(page.locator('h2').getByText(/complete my work/i)).toBeVisible();
        await page.waitForTimeout(500);

        // navigate back to the list
        await page.goBack();

        await page
            .locator('button')
            .getByText(/yes/i)
            .click();

        // ensure the list page is loaded
        await expect(page).toHaveURL('/records/incomplete');
        await expect(
            page
                .locator('button')
                .getByText(/complete work/i)
                .first(),
        ).toBeVisible();
    });

    test.describe('author list', () => {
        test.beforeEach(async ({ page }) => {
            const pid = 'UQ:352045';
            const authorUsername = 'uqrdav10';
            await page.goto(`/records/${pid}/incomplete?user=${authorUsername}`);
        });

        test.describe('big screens', () => {
            test.beforeEach(async ({ page }) => {
                await page.setViewportSize({ width: 900, height: 800 });
            });

            test('should display without overlaying elements', async ({ page }) => {
                // assert author list scrolling
                await expect(page.getByTestId('rek-author-list')).toHaveCSS('overflow-y', 'scroll'); // Use 'overflow-y' for CSS property
                // assert action table styling
                // For checking multiple CSS properties, chain them or use multiple expects.
                await expect(page.getByTestId('rek-author-list-row-0-actions')).not.toHaveCSS(
                    'border-top-color',
                    'rgb(221, 221, 221)',
                );
                await expect(page.getByTestId('rek-author-list-row-0-actions')).not.toHaveCSS(
                    'border-top-width',
                    '1px',
                );
                await expect(page.getByTestId('rek-author-list-row-0-actions')).not.toHaveCSS('margin-top', '10px');
                await expect(page.getByTestId('rek-author-list-row-0-actions')).not.toHaveCSS('margin-bottom', '-8px');
            });
        });

        test.describe('small screens', () => {
            test.beforeEach(async ({ page }) => {
                await page.setViewportSize({ width: 899, height: 600 });
            });

            test('should display without overlaying elements', async ({ page }) => {
                // assert author list scrolling
                await expect(page.getByTestId('rek-author-list')).toHaveCSS('overflow-y', 'scroll');
                // assert action table styling
                await expect(page.getByTestId('rek-author-list-row-0-actions')).toHaveCSS(
                    'border-top-color',
                    'rgb(221, 221, 221)',
                );
                await expect(page.getByTestId('rek-author-list-row-0-actions')).toHaveCSS('margin-top', '10px');
                await expect(page.getByTestId('rek-author-list-row-0-actions')).toHaveCSS('margin-bottom', '-8px');
                const borderTopWidthValue = await page
                    .getByTestId('rek-author-list-row-0-actions')
                    .evaluate(element => getComputedStyle(element).getPropertyValue('border-top-width'));
                expect(parseFloat(borderTopWidthValue)).toBeCloseTo(1, 0.1);
            });
        });
    });
});
