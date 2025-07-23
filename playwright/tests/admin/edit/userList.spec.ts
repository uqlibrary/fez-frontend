import { test, expect } from '../../../test';

test.describe('Manage User List', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 1000 });
        await page.goto('/admin/users?user=uqstaff');
    });

    test('Allows number of records per page to be changed', async ({ page }) => {
        await page.locator('.MuiTablePagination-select').click();
        await page.locator('[data-value="100"]').click();
        await expect(page.locator('#usr-id-0')).toBeVisible();
        await expect(page.locator('#usr-id-1')).toBeVisible();
    });

    test('Handles bulk delete', async ({ page }) => {
        await page.getByTestId('select-user-1').click();
        await page.getByTestId('users-delete-selected-users').click();
        await page.getByTestId('confirm-bulk-delete-users-confirmation').click();
        await expect(page.locator('#usr-id-0')).not.toBeVisible();
        await expect(page.locator('#usr-id-1')).toBeVisible();
    });

    test('Handles new user', async ({ page }) => {
        await page.getByTestId('users-add-new-user').click();
        await page.getByTestId('usr-full-name-input').fill('MOCK USER');
        await page.getByTestId('usr-email-input').fill('mock@user.com');
        await page.getByTestId('usr-username-input').fill('mock_user');
        await page.getByTestId('users-add-this-user-save').click();
        await expect(page.getByTestId('usr-full-name-0')).toBeVisible();
        await expect(page.locator('#usr-full-name-0')).toHaveValue('MOCK USER');
        await expect(page.getByTestId('usr-full-name-1')).toBeVisible();
        await expect(page.getByTestId('usr-full-name-2')).toBeVisible();
    });

    test('Handles update user', async ({ page }) => {
        await page.getByTestId('users-list-row-0-edit-this-user').click();
        await page.locator('#usr-full-name-input').clear();
        await page.locator('#usr-full-name-input').fill('Test User UPDATE');
        await page.getByTestId('users-update-this-user-save').click();
        await expect(page.locator('#usr-full-name-0')).toHaveValue('Test User UPDATE');
    });

    test('Handles delete user', async ({ page }) => {
        await page.getByTestId('users-list-row-0-delete-this-user').click();
        await page.getByTestId('confirm-users-delete-this-user-confirmation').click();
        await expect(page.getByTestId('alert-done-user-delete')).toBeVisible();
        await expect(page.locator('#usr-id-0')).not.toBeVisible();
    });
});
