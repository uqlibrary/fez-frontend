import { test, expect, Page } from '../../../test';
import { adminEditTabbedView, assertAffiliationsAllowed } from '../helpers';
import { clickAutoSuggestion } from '../../../lib/helpers';
import { typeCKEditor } from '../../../lib/ckeditor';

test.describe('As an admin, I can', () => {
    const loadNtroTabAdminAdd = async (page: Page, collectionRowId: number, subtypeName: string) => {
        await page.getByTestId('rek-ismemberof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-ismemberof', collectionRowId);

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page
            .getByTestId('rek-display-type-options')
            .locator('li', { hasText: /Creative Work/ })
            .first()
            .click();

        // Choose subtype
        await page.getByTestId('rek-subtype-select').click();
        await page
            .getByTestId('rek-subtype-options')
            .locator('li', { hasText: subtypeName })
            .first()
            .click();

        // Apply selections
        await page
            .locator('button')
            .getByText(/Create work/)
            .first()
            .click();
        await adminEditTabbedView(page);

        // NTRO now in Authors tab - change to Authors:
        await page.getByTestId('authors-tab').click();
    };

    const assertCreateAuthor = async (page: Page, nameAsPublished: string) => {
        await page.getByTestId('rek-author-add').click();
        await page.getByTestId('rek-author-input').fill(nameAsPublished);
        await page.getByTestId('rek-author-add-save').click();
    };
    const assertUpdateAuthor = async (page: Page, index: number, nameAsPublished: string) => {
        await page.getByTestId(`rek-author-list-row-${index}-edit`).click();
        await page.getByTestId('rek-author-input').clear();
        await page.getByTestId('rek-author-input').fill(nameAsPublished);
        await page.getByTestId('rek-author-update-save').click();
    };

    const assertCanSetScaleStatement = async (page: Page, index: number, typeIndex: number, statement: string) => {
        await page.getByTestId(`rek-significance-list-row-${index}-edit`).click();
        await page.getByTestId('rek-significance-select').click();
        await page.getByTestId(`rek-significance-option-${typeIndex}`).click();
        await typeCKEditor(page, 'rek-creator-contribution-statement', statement);
        await page.getByTestId('rek-significance-add').click();
    };

    const assertCanClearScaleStatement = async (page: Page, index: number) => {
        await page.getByTestId(`rek-significance-list-row-${index}-delete`).click();
        await page.getByTestId(`confirm-rek-significance-list-row-${index}-delete`).click();
    };

    const assertHasAuthor = async (page: Page, index: number, value: string) => {
        await expect(page.getByTestId(`rek-author-list-row-${index}-name-as-published`)).toHaveText(value);
    };

    test('add a creative work', async ({ page }) => {
        await page.goto('/admin/add?user=uqstaff');

        await loadNtroTabAdminAdd(page, 0, 'Creative Work - Textual');

        await assertCreateAuthor(page, 'Test Author');
        await assertCreateAuthor(page, 'Second Author');
        const statement1 = 'Test Author Statement';
        const statement2 = 'Second Author Statement';
        await assertCanSetScaleStatement(page, 0, 1, 'Test Author Statement');
        await assertCanSetScaleStatement(page, 1, 2, 'Second Author Statement');
        await assertHasAuthor(page, 0, 'Test Author');
        await assertHasAuthor(page, 1, 'Second Author');
        await expect(page.getByTestId('statement-item-0')).toHaveText(statement1);
        await expect(page.getByTestId('statement-item-1')).toHaveText(statement2);
        // Change the author order
        await page.getByTestId('rek-author-list-row-0-move-down').click();
        await assertHasAuthor(page, 0, 'Second Author');
        await assertHasAuthor(page, 1, 'Test Author');
        await expect(page.getByTestId('statement-item-0')).toHaveText(statement2);
        await expect(page.getByTestId('statement-item-1')).toHaveText(statement1);
        // Clear one of the statements
        await assertCanClearScaleStatement(page, 0);
        await expect(page.getByTestId('statement-item-0')).toHaveText(/Missing/);
        // Change the name of one of the authors
        await assertUpdateAuthor(page, 0, 'Updated Author');
        await assertHasAuthor(page, 0, 'Updated Author');
        // Delete the first author.
        await page.getByTestId('rek-author-list-row-0-delete').click();
        await page.getByTestId('confirm-rek-author-delete-author-confirmation').click();
        await assertHasAuthor(page, 0, 'Test Author');
        // Clear the statement via edit
        await page.getByTestId('rek-significance-list-row-0-edit').click();
        // set true
        await page.getByTestId('empty-significance-statement-input').click();
        // set false (to toggle)
        await page.getByTestId('empty-significance-statement-input').click();
        // set true (to check toggle)
        await page.getByTestId('empty-significance-statement-input').click();
        await page.getByTestId('rek-significance-add').click();
        await expect(page.getByTestId('statement-item-0')).toHaveText(/Missing/);
    });

    test('delete all added creative work scale of significance and creative statements', async ({ page }) => {
        await page.goto('/admin/add?user=uqstaff');

        await loadNtroTabAdminAdd(page, 0, 'Creative Work - Textual');

        await page.getByTestId('delete-all-rek-significance').click();
        await expect(page.getByTestId('confirm-rek-significance-delete-all')).toHaveText(/Yes/);
        await page.getByTestId('confirm-rek-significance-delete-all').click();
        await expect(page.getByTestId('rek-significance-list')).toHaveText(/No records to display/);
    });

    test('not see Author affiliations for creative work type', async ({ page }) => {
        await page.goto('/admin/add?user=uqstaff');

        // Choose a collection
        await page.getByTestId('rek-ismemberof-input').fill('a');
        await clickAutoSuggestion(page, 'rek-ismemberof', 0);

        // Choose display type
        await page.getByTestId('rek-display-type-select').click();
        await page
            .getByTestId('rek-display-type-options')
            .locator('li', { hasText: /Creative Work/ })
            .first()
            .click();

        // Choose sub type
        await page.getByTestId('rek-subtype-select').click();
        await page
            .getByTestId('rek-subtype-options')
            .locator('li', { hasText: /Creative Work - Textual/ })
            .first()
            .click();

        // Apply selections
        await page
            .locator('button')
            .getByText(/Create work/)
            .first()
            .click();
        await assertAffiliationsAllowed(page, {
            authorName: 'Steve Su (uqysu4)',
            orgName: 'The University of Queensland',
            rowId: 0,
            ntro: true,
        });
    });
});
