import { expect, Page } from '../../test';

// Common selectors
const tabHeadingSelector = '.StandardPage form > div > div div.StandardCard > div > div > h3';

// Helper functions
export async function loadRecordForAdminEdit(page: Page, pid: string) {
    await page.goto(`/admin/edit/${pid}?user=uqstaff`);
    await page.locator('h2').waitFor({ state: 'visible', timeout: 60_0000 });
    await expect(page.locator('h2')).toContainText(pid);
}

export async function adminEditCountCards(page: Page, count: number) {
    await expect(page.locator(tabHeadingSelector)).toHaveCount(count);
}

export async function adminEditNoAlerts(page: Page) {
    const form = page.locator('.StandardPage form > div:first-child');
    await expect(form.getByTestId('alert')).not.toBeVisible();
    await expect(page.locator('#admin-work-submit')).toBeEnabled();
}

export async function adminEditVerifyAlerts(page: Page, count: number, messages: string[]) {
    const alert = page.getByTestId('alert-warning');
    await expect(alert.locator('.alert-text')).toContainText('Validation -');
    const alertMessages = alert.getByTestId('alert-message').locator('li');
    await expect(alertMessages).toHaveCount(count);

    for (const message of messages) {
        await expect(alertMessages.filter({ hasText: message })).toBeVisible();
    }

    await expect(page.locator('#admin-work-submit')).toBeDisabled();
}

export async function adminEditTabbedView(page: Page, showTabs = true) {
    const tabViewButton = page.locator('input[value=tabbed]');

    if (showTabs) {
        await expect(tabViewButton).not.toBeChecked();
    } else {
        await expect(tabViewButton).toBeChecked();
    }

    await tabViewButton.click();
    await page.waitForFunction(
        ({ selector, showTabs }) => {
            const elements = document.querySelectorAll(selector);
            return showTabs ? elements.length === 1 : elements.length > 1;
        },
        { selector: tabHeadingSelector, showTabs },
    );

    if (showTabs) {
        await expect(tabViewButton).toBeChecked();
    } else {
        await expect(tabViewButton).not.toBeChecked();
    }
}

export async function adminEditCheckDefaultTab(page: Page, tabTitle: string) {
    const tabs = page.locator(tabHeadingSelector);
    await expect(tabs).toHaveCount(1);
    await expect(tabs).toHaveText(tabTitle);
}

export async function adminEditCheckTabErrorBadge(page: Page, tab: string, value: string | number = '1') {
    await expect(page.getByTestId(`${tab}-tab`).locator('[class*="MuiBadge-colorError"]')).toHaveText(String(value));
}

export async function assertChangeSelectFromTo(page: Page, item: string, changeFrom: string, changeTo: string) {
    const select = page.getByTestId(`${item}-select`);
    await select.waitFor({ state: 'visible' });

    if (changeFrom === '') {
        await select.click();
    } else {
        await expect(select).toContainText(changeFrom);
        await select.click();
    }

    const options = page.getByTestId(`${item}-options`);
    await options.waitFor({ state: 'visible' });
    await options.locator(`:text("${changeTo}")`).click();
    await expect(select).toContainText(changeTo);
}

export async function addAuthorAndAssert(
    page: Page,
    authorUqname: string,
    authorId: string,
    expand = true,
    edit = true,
) {
    await page.getByTestId('rek-author-add').click();
    await page.getByTestId('rek-author-id-input').fill('uq');
    await page
        .getByTestId('rek-author-id-options')
        .locator(`li:has-text("${authorUqname}")`)
        .click();
    await page.getByTestId('rek-author-add-save').click();
    await expect(page.locator('[data-testid^=contributor-errorIcon-]')).toBeVisible();

    if (expand) {
        const expandIcon = page.getByTestId(`expandPanelIcon-${authorId}`);
        await expandIcon.click();

        const detailPanel = page.getByTestId(`detailPanel-${authorId}`);
        await expect(detailPanel.getByTestId('orgChip-error')).toContainText('0%');
        await expect(detailPanel).toContainText('No affiliations have been added');
        await expect(page.getByTestId('alert').first()).toContainText(
            'Author affiliation information is incomplete - Author requires at least one affiliation to be added',
        );

        if (edit) {
            const editBtn = page.locator('[data-testid^=affiliationEditBtn-]').first();
            await editBtn.click();
            await expect(page.getByTestId('affiliationCancelBtn')).toBeEnabled();
            await expect(page.getByTestId('affiliationSaveBtn')).toBeDisabled();
        }
    }
}

export async function assertAffiliation(page: Page, orgName: string, orgId: string, expectedPercent: string) {
    const orgInput = page.getByTestId(`orgSelect-${orgId}-input`);
    await expect(orgInput).toHaveValue(orgName);

    const orgChip = page.getByTestId(`orgChip-${orgId}`);
    await expect(orgChip).toContainText(expectedPercent);
}

export async function addAffiliationAndAssert(
    page: Page,
    orgName: string,
    orgId: string,
    expectedPercent: string,
    suggested = false,
) {
    const addInput = page.getByTestId('orgSelect-add-input');
    await addInput.click();
    await page
        .getByTestId('orgSelect-add-options')
        .getByText(orgName, { exact: true })
        .click();

    const actualOrgName = suggested ? orgName.replace('Suggested: ', '') : orgName;
    await assertAffiliation(page, actualOrgName, orgId, expectedPercent);
}

export async function editAffiliationAndAssert(
    page: Page,
    currentOrgId: string,
    nextOrgId: string,
    nextOrgName: string,
    expectedPercent: string,
) {
    const currentInput = page.getByTestId(`orgSelect-${currentOrgId}-input`);
    await currentInput.click();
    await page
        .getByTestId(`orgSelect-${currentOrgId}-options`)
        .getByText(nextOrgName, { exact: true })
        .click();
    await assertAffiliation(page, nextOrgName, nextOrgId, expectedPercent);
}

interface AssertAffiliationsOptions {
    authorName: string;
    orgName: string;
    rowId: string;
    allowed?: boolean;
    tabbed?: boolean;
    ntro?: boolean;
}

export async function assertAffiliationsAllowed(page: Page, options: AssertAffiliationsOptions) {
    const { authorName, orgName, rowId, allowed = false, tabbed = true, ntro = false } = options;

    if (tabbed) {
        await adminEditTabbedView(page);
    }

    await page.getByTestId('authors-tab').click();
    await page.getByTestId('rek-author-add').click();
    await page.getByTestId('rek-author-id-input').fill('uq');

    const authorOption = page.getByTestId('rek-author-id-options').locator(`li:has-text("${authorName}")`);
    await authorOption.click();
    await page.getByTestId('rek-author-add-save').click();

    if (allowed) {
        await expect(page.locator('[data-testid^=contributor-errorIcon]')).toBeVisible();
    } else {
        await expect(page.locator('[data-testid^=contributor-errorIcon]')).not.toBeVisible();
    }

    if (!ntro) {
        const iconSelector = allowed ? '[data-testid^=expandPanelIcon-]' : '[data-testid=ChevronRightIcon]';
        await page
            .locator(`[id=rek-author-list-row-${rowId}]`)
            .locator(iconSelector)
            .click();
    }

    const authorList = page.getByTestId('rek-author-list');
    if (allowed) {
        await expect(authorList).toContainText('No affiliations have been added');
    } else {
        await expect(authorList).toContainText(orgName);
    }

    if (allowed) {
        await expect(authorList.getByTestId('alert')).toBeVisible();
    } else {
        await expect(authorList.getByTestId('alert')).not.toBeVisible();
    }
}
