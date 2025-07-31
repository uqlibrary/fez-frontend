import { expect, Page } from '../../test';

export const setupInitialSearchAndAssert = async (page: Page) => {
    await page.getByTestId('journal-search-keywords-input').fill('bio');
    await page.getByTestId('journal-search-item-addable-title-glycobiology-3').click();
    await page.getByTestId('journal-search-item-addable-title-biological-4').click();
    await page.getByTestId('journal-search-button').click();
    await expect(page.getByTestId('journal-list')).toBeVisible();

    await expect(page.getByTestId('journal-search-chip-title-glycobiology')).toBeVisible();
    await expect(page.getByTestId('journal-search-chip-title-biological')).toBeVisible();

    await expect(page).toHaveURL(/keywords%5BTitle-glycobiology/);
    await expect(page).toHaveURL(/keywords%5BTitle-biological/);
};

export const assertInitialViewVisible = async (page: Page) => {
    await expect(page.getByTestId('journal-search-button')).toBeDisabled();
    await expect(page.getByTestId('journal-search-browse-all-button')).toBeEnabled();
    await expect(page.getByTestId('journal-search-favourite-journals-button')).toBeEnabled();
    await expect(page.getByTestId('journal-search-keywords-input')).toHaveValue('');
};
