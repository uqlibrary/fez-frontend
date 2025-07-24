import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListDesign';
import {
    adminEditCheckDefaultTab,
    adminEditCheckTabErrorBadge,
    adminEditCountCards,
    adminEditTabbedView,
    loadRecordForAdminEdit,
} from '../helpers';

test.describe('Design admin edit', () => {
    const record = { ...recordList.data[0] };
    const nonNtroRecord = recordList.data[2];

    test('should load expected tabs', async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
        await adminEditCountCards(page, 9);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
        await adminEditCheckTabErrorBadge(page, 'bibliographic', '2');
    });

    test('should render the different sections as expected', async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
        await expect(page.getByTestId('rek-license-select')).toBeVisible();

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        // Bibliographic tab
        await expect(page.getByTestId('bibliographic-section-header')).toContainText('Bibliographic');

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        // Author Details tab
        await expect(page.getByTestId('authors-section-header')).toContainText('Authors');
        const authorsSectionContent = page.getByTestId('authors-section-content');
        await expect(authorsSectionContent.locator('h4').first()).toHaveText(/Designers/);

        const designers = record.fez_record_search_key_author.map(item => item.rek_author);
        for (const [index, designer] of designers.entries()) {
            await expect(
                authorsSectionContent.locator(`[id=rek-author-list-row-${index}-name-as-published]`),
            ).toHaveText(designer);
        }

        await expect(authorsSectionContent.locator('h4').nth(1)).toHaveText(/Consultants/);

        const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
        for (const [index, consultant] of consultants.entries()) {
            await expect(
                authorsSectionContent.locator(`[id=rek-contributor-list-row-${index}-name-as-published]`),
            ).toHaveText(consultant);
        }

        // ----------------------------------------- GRANT INFORMATION TAB ---------------------------------------------
        // Grant information tab
        await expect(page.getByTestId('grants-section-header')).toContainText('Grants');
    });

    test('should render different sections as expected for non-NTRO subtype', async ({ page }) => {
        await loadRecordForAdminEdit(page, nonNtroRecord.rek_pid);
        await expect(page.getByTestId('rek-license-select')).toBeVisible();

        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        // Bibliographic tab
        await expect(page.getByTestId('bibliographic-section-header')).toContainText('Bibliographic');
        await expect(page.getByTestId('rek-job-number-input')).toHaveValue(
            record.fez_record_search_key_job_number.rek_job_number,
        );

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        // Author Details tab
        await expect(page.getByTestId('authors-section-header')).toContainText('Authors');
        const authorsSectionContent = page.getByTestId('authors-section-content');
        await expect(authorsSectionContent.locator('h4').first()).toHaveText(/Designers/);

        const designers = record.fez_record_search_key_author.map(item => item.rek_author);
        for (const [index, designer] of designers.entries()) {
            await expect(
                authorsSectionContent.locator(`[id=rek-author-list-row-${index}-name-as-published]`),
            ).toHaveText(designer);
        }

        await expect(authorsSectionContent.locator('h4').nth(1)).toHaveText(/Contributors/);

        const consultants = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
        for (const [index, consultant] of consultants.entries()) {
            await expect(
                authorsSectionContent.locator(`[id=rek-contributor-list-row-${index}-name-as-published]`),
            ).toHaveText(consultant);
        }
    });
});
