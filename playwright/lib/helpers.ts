import { Page, expect, Locator } from '../test';
import { baseURL } from './constants';
import { BrowserContext } from '@playwright/test';
import moment from 'moment/moment';
import path from 'path';

/**
 * PW Clock management doesn't work with Axios Mock Adapter, so we have to rely on global vars.
 * See where window.__PW__TEST_API_MOCK_IS_PAUSED is used in /mock/index.js
 */
export const apiMockIsPaused = async (page: Page, value = true) =>
    await page.evaluate(value => (window.__PW__TEST_API_MOCK_IS_PAUSED = value), value);

// See where window.__PW__TEST_API_MOCK_RESPONSE_SHOULD_FAIL is used in /mock/index.js
export const apiMockResponseShouldFail = async (page: Page, value = true) =>
    await page.evaluate(value => (window.__PW__TEST_API_MOCK_RESPONSE_SHOULD_FAIL = value), value);

export const assertEnabled = async (page: Page, selector: string) => expect(page.locator(selector)).toBeEnabled();

export const assertDisabled = async (page: Page, selector: string) => expect(page.locator(selector)).toBeDisabled();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assertTriggersDisabled = async (page: Page, selector: string, callback: any) => {
    await assertEnabled(page, selector);
    await callback();
    await assertDisabled(page, selector);
};

export const navToHomeFromMenu = async (
    page: Page,
    locale?: { confirmationTitle: string; confirmButtonLabel: string },
) => {
    await page.locator('button#main-menu-button').click();
    await page.locator('#menu-item-0').click();

    if (locale && page.url() !== `${baseURL}/`) {
        await page
            .getByRole('dialog')
            .filter({ hasText: locale.confirmationTitle })
            .getByRole('button', { name: locale.confirmButtonLabel })
            .click();
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fillInput = async (page: Page, selector: string, value: any, times: number = 1) => {
    await page.fill(selector, String(value).repeat(times));
};

export async function assertIsVisible(element: Locator): Promise<void> {
    await expect(element).toBeVisible();
}

export async function assertIsNotVisible(element: Locator): Promise<void> {
    await expect(element).not.toBeInViewport();
}

export async function clickAutoSuggestion(page: Page, fieldName: string, ordinal: string | number): Promise<void> {
    await page.locator(`#${fieldName}-option-${ordinal}`).click();
}

export async function loadAdminDashboard(page: Page, user: string = 'uqstaff') {
    await page.setViewportSize({ width: 1200, height: 1000 });
    await page.goto(`/admin/dashboard?user=${user}`);
    await expect(page.locator('h2').getByText('Admin dashboard')).toBeVisible();
}

export const testIdStartsWith = (page: Page | Locator, id: string) => page.locator(`[data-testid^=${id}]`);

export const getOpenedLink = async (context: BrowserContext, locator: Locator) => {
    const [newPage] = await Promise.all([context.waitForEvent('page'), locator.click()]);
    return newPage;
};

export async function setPartialDate(
    page: Page,
    id: string,
    { day, month, year }: { day?: string | number; month?: number; year?: string | number },
) {
    if (day !== undefined) {
        const dayInput = page.getByTestId(`${id}-day-input`);
        await dayInput.fill(String(day));
    }

    if (month !== undefined) {
        // Click to open the month dropdown
        await page.getByTestId(`${id}-month-select`).click();

        // Click on the desired month option
        await page.locator(`[data-testid=${id}-month-options] li[role=option][data-value="${month - 1}"]`).click();
    }

    if (year !== undefined) {
        const yearInput = page.getByTestId(`${id}-year-input`);
        await yearInput.fill(String(year));
    }
}

export async function checkPartialDate(
    page: Page,
    id: string,
    { day, monthName, year }: { day?: string; monthName?: string; year?: string },
) {
    if (day !== undefined) {
        const dayInput = page.getByTestId(`${id}-day-input`);
        await expect(dayInput).toHaveValue(day);
    }

    if (monthName !== undefined) {
        const monthSelect = page.getByTestId(`${id}-month-select`);
        await expect(monthSelect).toHaveText(monthName);
    }

    if (year !== undefined) {
        const yearInput = page.getByTestId(`${id}-year-input`);
        await expect(yearInput).toHaveValue(year);
    }
}

export async function checkPartialDateFromRecordValue(page: Page, id: string, dateString: string) {
    const date = moment(dateString);
    await checkPartialDate(page, id, {
        day: date.format('D'),
        monthName: date.format('MMMM'),
        year: date.format('YYYY'),
    });
}

export const setFileInput = async (container: Page | Locator, fileName: string) =>
    await container.setInputFiles(path.join(__dirname, `../tests/fixtures/${fileName}`));
