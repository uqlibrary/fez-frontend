import { test, expect, Page } from '../lib/fixture';

test.describe('Controlled vocabularies', () => {
    const dismissPopover = async (page: Page) => await page.locator('body').click({ position: { x: 0, y: 0 } });

    test.beforeEach(async ({ page }) => {
        await page.goto('/admin/controlled-vocabularies?user=uqstaff');
    });

    test('Renders the top level controlled vocabulary screen', async ({ page }) => {
        await expect(page.getByTestId('page-title')).toHaveText(/Controlled Vocabulary/);
        await expect(page.getByTestId('total-vocab')).toHaveText(/Displaying 42 total controlled vocabularies/);
        await expect(page.getByTestId('row-em-451780')).toHaveText(/Fields of Research/);
        // half of all rows should be editable
        await expect(page.locator('[data-testid^=admin-edit-button-]')).toHaveCount(21);
        // half of all rows should be readonly
        await expect(page.locator('[data-testid^=row-locked-icon-]')).toHaveCount(21);
        await dismissPopover(page);

        // test tooltips
        await page.getByTestId('row-hidden-icon-453226').hover();
        await expect(page.locator('[role=tooltip]')).toHaveText(/This vocabulary is hidden/);
        await page.getByTestId('row-locked-icon-456849').hover();
        await expect(page.locator('[role=tooltip]').last()).toHaveText(/This vocabulary and children are read-only/);
    });

    test('Renders the editable child level controlled vocabulary screen', async ({ page }) => {
        await page.getByTestId('expand-row-453669').click();
        await expect(page.getByTestId('child-row-em-453670')).toHaveText(/Yukulta \/ Ganggalidda language G34/);
        await expect(page.getByTestId('admin-add-vocabulary-button-453669')).toBeVisible();
        const scope = page.getByTestId('vocab-child-body');
        await expect(scope.locator('[data-testid^=child-row-em-]')).toHaveCount(10);
        await expect(scope.locator('[data-testid^=admin-edit-button-]')).toHaveCount(10);

        await dismissPopover(page);
    });
    test('Renders the readonly child level controlled vocabulary screen', async ({ page }) => {
        await page.getByTestId('expand-row-454139').click();
        await expect(page.getByTestId('child-row-em-454140')).toHaveText(/Associate Editor/);
        await expect(page.getByTestId('admin-add-vocabulary-button-454139')).not.toBeVisible();
        const scope = page.getByTestId('vocab-child-body');
        await expect(scope.locator('[data-testid^=child-row-em-]')).toHaveCount(9);
        await expect(scope.locator('[data-testid^=admin-edit-button-]')).toHaveCount(0);

        await dismissPopover(page);
    });

    test('Navigate field of research', async ({ page }) => {
        await page.getByTestId('expand-row-451780').click();
        await expect(page.getByTestId('child-row-em-451799')).toHaveText(/01 Mathematical Sciences/);
        await page.getByTestId('child-row-title-link-451799').click();
        await expect(page.getByTestId('child-row-em-451800')).toHaveText(/0101 Pure Mathematics/);
        await page.getByTestId('child-row-title-link-451800').click();
        await expect(page.getByTestId('child-row-em-451801')).toHaveText(/010101 Algebra and Number Theory/);
        await page.getByTestId('child-row-title-link-451801').click();
        await expect(page.getByTestId('nav-451801')).toHaveText(/010101 Algebra and Number Theory/);
        await page.getByTestId('nav-451800').click();
        await expect(page.getByTestId('child-row-title-451801')).toHaveText(/010101 Algebra and Number Theory/);
        await page.getByTestId('nav-451780').click();
        await expect(page.getByTestId('child-row-title-451799')).toHaveText(/01 Mathematical Sciences/);

        await dismissPopover(page);
    });

    test('Expand two rows', async ({ page }) => {
        await page.getByTestId('expand-row-451780').click();
        await expect(page.getByTestId('child-row-em-451799')).toHaveText(/01 Mathematical Sciences/);
        await page.getByTestId('expand-row-453669').click();
        await expect(page.getByTestId('nav-451780')).toHaveCount(1);

        await dismissPopover(page);
    });

    test.describe('admin', () => {
        test.describe('adding vocabs', () => {
            test('should show an Add panel when the top-level Add button is clicked', async ({ page }) => {
                await page.getByTestId('admin-add-vocabulary-button').click();
                await expect(page.getByTestId('portal-root')).toHaveText(/Add vocabulary/);
                await expect(page.getByTestId('admin-add-vocabulary-button')).toBeDisabled();
                await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
                await page.getByTestId('cvo-title-input').type('Test title', { delay: 10 });
                await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
                await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
                await page.getByTestId('update_dialog-action-button').click();
                await expect(page.getByTestId('portal-root')).not.toHaveText(/Add vocabulary/);
                await expect(page.getByTestId('admin-add-vocabulary-button')).not.toBeDisabled();
            });

            test('should show an Add panel when a child Add button is clicked', async ({ page }) => {
                await page.getByTestId('expand-row-453669').click();
                await expect(page.getByTestId('child-row-em-453670')).toHaveText(/Yukulta \/ Ganggalidda language G34/);
                await page.getByTestId('admin-add-vocabulary-button-453669').click();
                await expect(page.getByTestId('portal-add-453669')).toHaveText(/Add vocabulary/);
                await expect(page.getByTestId('admin-add-vocabulary-button-453669')).toBeDisabled();
                await expect(page.getByTestId('update_dialog-action-button')).toBeDisabled();
                await page.getByTestId('cvo-title-input').type('Test title', { delay: 10 });
                await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
                await expect(page.getByTestId('update_dialog-action-button')).not.toBeDisabled();
                await page.getByTestId('update_dialog-action-button').click();
                await expect(page.getByTestId('portal-add-453669')).not.toHaveText(/Add vocabulary/);
                await expect(page.getByTestId('admin-add-vocabulary-button-453669')).not.toBeDisabled();
            });

            test('should close the admin panel and re-enable admin functionality after collapsing a row while the admin panel is visible', async ({
                page,
            }) => {
                // expand
                await page.getByTestId('expand-row-453669').click();
                await expect(page.locator('[data-testid=total-vocab-453669]')).toHaveText(/165/);
                await page.locator('[data-testid=admin-add-vocabulary-button-453669]').click();
                await expect(page.locator('[data-testid=update_dialog-controlledVocabulary]')).toBeVisible();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button-453669]')).toBeDisabled();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button]')).toBeDisabled();
                await expect(page.locator('[data-testid=admin-edit-button-453669]')).toBeDisabled();
                // collapse
                await page.locator('[data-testid=expand-row-453669]').click();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button]')).not.toBeDisabled();
                await expect(page.locator('[data-testid=admin-edit-button-453669]')).not.toBeDisabled();
                // expand again
                await page.locator('[data-testid=expand-row-453669]').click();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button-453669]')).not.toBeDisabled();
                await expect(page.locator('[data-testid=update_dialog-controlledVocabulary]')).not.toBeVisible();
            });

            test('should close the admin panel and re-enable admin functionality when clicking breadcrumbs with the admin panel visible', async ({
                page,
            }) => {
                // expand
                await page.locator('[data-testid=expand-row-453669]').click();
                await expect(page.locator('[data-testid=total-vocab-453669]')).toHaveText(/165/);
                await page.locator('[data-testid=child-row-title-link-453670]').click();
                await expect(page.locator('[data-testid=childControlledVocab-page-loading]')).not.toBeVisible();
                await page.locator('[data-testid=admin-add-vocabulary-button-453669]').click();
                await expect(page.locator('[data-testid=update_dialog-controlledVocabulary]')).toBeVisible();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button-453669]')).toBeDisabled();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button]')).toBeDisabled();
                await expect(page.locator('[data-testid=admin-edit-button-453669]')).toBeDisabled();
                await page.locator('[data-testid=nav-453669]').click(); // navigate via breadcrumbs
                await expect(page.locator('[data-testid=update_dialog-controlledVocabulary]')).not.toBeVisible();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button]')).not.toBeDisabled();
                await expect(page.locator('[data-testid=admin-add-vocabulary-button-453669]')).not.toBeDisabled();
            });
        });
        test.describe('editing vocabs', () => {
            test('should show a populated Edit panel when a top-level Edit button is clicked', async ({ page }) => {
                await page.locator('[data-testid=expand-row-453669]').click();
                await expect(page.locator('[data-testid=vocab-table-453669]')).toBeVisible();
                await page.locator('[data-testid=admin-edit-button-453669]').click();
                await expect(page.locator('[data-testid=vocab-table-453669]')).not.toBeVisible();
                await expect(page.locator('[data-testid=portal-edit-453669]')).toHaveText(/Update vocabulary/);
                await expect(page.locator('[data-testid=admin-edit-button-453669]')).not.toBeVisible();
                await expect(page.locator('[data-testid=update_dialog-action-button]')).toBeDisabled();
                await expect(page.locator('[data-testid=cvo-title-input]')).toHaveValue('AIATSIS codes');
                await expect(page.locator('[data-testid=cvo-desc-input]')).toHaveValue('This is my edited version');
                await expect(page.locator('[data-testid=portal-edit-453669]')).not.toHaveText(/Required/);
                await page.locator('[data-testid=cvo-title-input]').clear();
                await expect(page.locator('[data-testid=portal-edit-453669]')).toHaveText(/Required/);
                await page.locator('[data-testid=cvo-title-input]').type('New title', { delay: 10 });
                await expect(page.locator('[data-testid=update_dialog-action-button]')).not.toBeDisabled();
                await expect(page.locator('[data-testid=update_dialog-action-button]')).not.toBeDisabled();
                await page.locator('[data-testid=update_dialog-action-button]').click();
                await expect(page.locator('[data-testid=portal-root]')).not.toHaveText(/Update vocabulary/);
                await expect(page.locator('[data-testid=admin-edit-button-453669]')).toBeVisible();
            });

            test('should show a populated Edit panel when a child-level Edit button is clicked', async ({ page }) => {
                await page.locator('[data-testid=expand-row-453669]').click();
                await expect(page.locator('[data-testid=vocab-table-453669]')).toBeVisible();
                await page.locator('[data-testid=admin-edit-button-453670]').click();
                await expect(page.locator('[data-testid=vocab-table-453669]')).toBeVisible();
                await expect(page.locator('[data-testid=portal-edit-453670]')).toHaveText(/Update vocabulary/);
                await expect(page.locator('[data-testid=admin-edit-button-453670]')).not.toBeVisible();
                await expect(page.locator('[data-testid=update_dialog-action-button]')).toBeDisabled();
                await expect(page.locator('[data-testid=cvo-title-input]')).toHaveValue(
                    'Yukulta / Ganggalidda language G34',
                );
                await expect(page.locator('[data-testid=cvo-external-id-input]')).toHaveValue('G34');
                await expect(page.locator('[data-testid=portal-edit-453670]')).not.toHaveText(/Required/);
                await page.locator('[data-testid=cvo-title-input]').clear();
                await expect(page.locator('[data-testid=portal-edit-453670]')).toHaveText(/Required/);
                await page.locator('[data-testid=cvo-title-input]').type('New title', { delay: 10 });
                await expect(page.locator('[data-testid=update_dialog-action-button]')).not.toBeDisabled();
                await expect(page.locator('[data-testid=portal-edit-453670]')).not.toHaveText(/Must be a number/);
                await expect(page.locator('[data-testid=update_dialog-action-button]')).not.toBeDisabled();
                await page.locator('[data-testid=update_dialog-action-button]').click();
                await expect(page.locator('[data-testid=portal-root]')).not.toHaveText(/Update vocabulary/);
                await expect(page.locator('[data-testid=admin-edit-button-453670]')).toBeVisible();
            });
        });
    });
});
