import { test, expect, Page } from '../../test';

test.describe('Error handling', () => {
    const expectUserToBeLoggedIn = async (page: Page, loggedIn: boolean) => {
        if (loggedIn) {
            await expect(page.getByTestId('PersonIcon')).toBeVisible();
            await expect(page.getByTestId('PersonOutlineIcon')).not.toBeVisible();
        } else {
            await expect(page.getByTestId('PersonIcon')).not.toBeVisible();
            await expect(page.getByTestId('PersonOutlineIcon')).toBeVisible();
        }

        const allCookies = await page.context().cookies();
        const uqlidCookie = allCookies.find(cookie => cookie.name === 'UQLID');
        const uqlidUserGroupCookie = allCookies.find(cookie => cookie.name === 'UQLID_USER_GROUP');
        if (loggedIn) {
            expect(uqlidCookie).toBeDefined();
            expect(uqlidUserGroupCookie).toBeDefined();
        } else {
            expect(uqlidCookie).toBeUndefined();
            expect(uqlidUserGroupCookie).toBeUndefined();
        }
    };

    test.describe('401', () => {
        test('should display the login dialog upon receiving a 401', async ({ page }) => {
            await page.goto('/records/search?searchQueryParams%5Ball%5D=test');
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            await expect(page.getByTestId('alert')).not.toBeVisible();
            await expectUserToBeLoggedIn(page, true);

            // make a search that returns a 401
            await page.getByTestId('simple-search-input').focus();
            await page.getByTestId('simple-search-input').clear();
            await page.getByTestId('simple-search-input').fill('should return 401');
            await page.getByTestId('simple-search-button').click();
            // assert login dialog is displayed by - see App component
            await expect(page.getByTestId('alert')).toContainText('You are not logged in');
            await expectUserToBeLoggedIn(page, false);

            // subsequent searches should go through
            await page.getByTestId('simple-search-input').focus();
            await page.getByTestId('simple-search-input').clear();
            await page.getByTestId('simple-search-input').fill('test');
            await page.getByTestId('simple-search-button').click();
            await expect(page.getByTestId('search-records-results')).toHaveText(
                /Displaying works 1 to 7 of 7 total works\./,
            );
            await expectUserToBeLoggedIn(page, false);
        });
    });
});
