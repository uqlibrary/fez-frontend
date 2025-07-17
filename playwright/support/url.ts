import { expect, Page } from '../lib/fixture';

export const assertSearchParamsCount = async (page: Page, count: number) =>
    await expect(() => expect(new URL(page.url()).searchParams.keys.length).toEqual(count)).toPass();

export const assertNotSearchParams = async (page: Page) => await assertSearchParamsCount(page, 0);
