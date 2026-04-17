import { test, expect, Page } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListCreativeWork';

import {
    loadRecordForAdminEdit,
    adminEditCountCards,
    adminEditNoAlerts,
    adminEditTabbedView,
    adminEditCheckDefaultTab,
    assertChangeSelectFromTo,
} from '../helpers';
import { typeCKEditor } from '../../../lib/ckeditor';

test.describe('Creative Work admin edit, general', () => {
    const record = { ...recordList.data[0] };

    test.beforeEach(async ({ page }) => await loadRecordForAdminEdit(page, record.rek_pid));

    test('tabs for Creative entry should also include NTRO', async ({ page }) => {
        await adminEditCountCards(page, 9);
        await adminEditNoAlerts(page);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
    });

    test.describe('in the Bibliographic section', () => {
        test('should render as expected', async ({ page }) => {
            const bibliographicTab = page.getByTestId('bibliographic-section-content');
            await expect(bibliographicTab.locator('h4').getByText(/Related publications/)).toBeVisible();

            const pubList = record.fez_record_search_key_isderivationof.map(item => item.rek_isderivationof_lookup);
            for (const [index, pub] of pubList.entries()) {
                await expect(bibliographicTab.getByTestId(`rek-isderivationof-list-row-${index}`)).toHaveText(pub);
            }
        });
    });

    test.describe('in the Additional section', () => {
        test('should render as expected', async ({ page }) => {
            const adminTab = page.getByTestId('admin-section-content');
            await expect(adminTab.locator('h4').getByText(/Additional information/)).toBeVisible();

            await expect(adminTab.getByTestId('rek-license-input')).toHaveValue(
                record.fez_record_search_key_license.rek_license.toString(),
            );

            await expect(adminTab.getByTestId('rek-license-select')).toHaveText(
                record.fez_record_search_key_license.rek_license_lookup,
            );
            await expect(adminTab.getByTestId('rek-content-indicator-select')).toHaveText(
                'Scholarship of Teaching and Learning',
            );
        });
    });

    test.describe('in the NTRO section', () => {
        async function rowAuthorDisplaysAs(page: Page, rowId: number, authorName: string) {
            const ordinalLabelList = ['First', 'Second', 'Third', 'Fourth'];
            const ordinalLabel = ordinalLabelList[rowId];
            const authorLocator = page.getByTestId(`scalesignif-author-${rowId}`);
            await expect(authorLocator).toContainText(authorName);
            await expect(authorLocator).toContainText(ordinalLabel);
        }

        async function rowScaleDisplaysAs(page: Page, rowId: number, significanceLabel: string) {
            await expect(page.getByTestId(`scale-item-${rowId}`)).toHaveText(significanceLabel);
        }

        async function rowStatementDisplaysAs(page: Page, rowId: number, statement: string) {
            await expect(page.getByTestId(`statement-item-${rowId}`)).toContainText(statement);
        }

        async function clickFormSaveButton(page: Page, label: string) {
            const button = page.locator('button[data-testid="rek-significance-add"]');
            await expect(button).toContainText(label);
            await button.click();
        }

        async function clickRowEditButton(page: Page, rowId: number) {
            const editButton = page.getByTestId(`rek-significance-list-row-${rowId}-edit`);
            await editButton.click();
            const formLocator = page.getByTestId('rek-significance-form');
            await formLocator.scrollIntoViewIfNeeded();
        }

        const statementList = {
            0: {
                statementContains: 'This is an online lecture',
                significance: 'Major',
                newSignificance: 'Minor',
                newText: 'Changed content',
            },
            1: {
                statementContains: 'Missing',
                significance: '',
            },
            2: {
                statementContains: 'Missing',
                significance: 'Minor',
            },
        };

        test('should render the NTRO quality indicators section as expected', async ({ page }) => {
            const NTROSectionContent = page.getByTestId('ntro-section-content');

            const qualityIndicatorsCard = NTROSectionContent.locator('.AdminCard').nth(1);
            await expect(qualityIndicatorsCard.locator('h4')).toHaveText(/Quality indicators/);

            const qualityIndicators = record.fez_record_search_key_quality_indicator;
            await expect(qualityIndicatorsCard.getByTestId('rek-quality-indicator-input')).toHaveValue(
                qualityIndicators.map(item => item.rek_quality_indicator).join(','),
            );
            await expect(qualityIndicatorsCard.getByTestId('rek-quality-indicator-select')).toHaveText(
                qualityIndicators.map(item => item.rek_quality_indicator_lookup).join(', '),
            );
        });

        test('loads the correct content in the significance and statement list rows', async ({ page }) => {
            await adminEditTabbedView(page);
            await page.getByTestId('authors-tab').click();

            const NTROSectionContent = page.getByTestId('ntro-section-content');
            await expect(NTROSectionContent).toBeVisible();

            await expect(NTROSectionContent.locator('.AdminCard').first().locator('h4')).toHaveText(
                /Scale\/Significance of work & Creator research statement/,
            );

            for (const [index, author] of record.fez_record_search_key_author.map(item => item.rek_author).entries()) {
                await rowAuthorDisplaysAs(page, index, author);
            }

            for (const [index, significance] of record.fez_record_search_key_significance
                .map(item => item.rek_significance_lookup)
                .entries()) {
                await rowScaleDisplaysAs(page, index, significance || 'Missing');
            }

            for (const [index, contribution] of record.fez_record_search_key_creator_contribution_statement
                .map(item => item.rek_creator_contribution_statement)
                .entries()) {
                const reducedContributionStatement = [/<p>/g, /<\/p>/g].reduce(
                    (statement, regex) => statement.replace(regex, ''),
                    contribution,
                );
                await rowStatementDisplaysAs(page, index, reducedContributionStatement);
            }
        });

        test('can edit an existing significance and statement row', async ({ page }) => {
            await adminEditTabbedView(page);
            await page.getByTestId('authors-tab').click();

            const NTROSectionContent = page.getByTestId('ntro-section-content');
            await expect(NTROSectionContent).toBeVisible();

            await clickRowEditButton(page, 0);
            await typeCKEditor(page, 'rek-creator-contribution-statement', statementList[0].newText);
            await assertChangeSelectFromTo(
                page,
                'rek-significance',
                statementList[0].significance,
                statementList[0].newSignificance,
            );
            await clickFormSaveButton(page, 'UPDATE');
            await rowScaleDisplaysAs(page, 0, statementList[0].newSignificance);
            await rowStatementDisplaysAs(page, 0, statementList[0].newText);
            await rowAuthorDisplaysAs(page, 0, 'Ashkanasy');
            await rowAuthorDisplaysAs(page, 1, 'Belanger');

            await page.getByTestId('submit-admin-top').click();
            const dialog = page.getByRole('dialog');
            await expect(dialog.locator('h2')).toContainText('Work has been updated');
        });

        test('can edit a significance and statement row where that was previously "Missing"', async ({ page }) => {
            await adminEditTabbedView(page);
            await page.getByTestId('authors-tab').click();

            await expect(page.getByTestId('ntro-section-content')).toBeVisible();

            await clickRowEditButton(page, 1);
            await typeCKEditor(page, 'rek-creator-contribution-statement', statementList[0].newText);
            await assertChangeSelectFromTo(page, 'rek-significance', '', statementList[0].newSignificance);
            await clickFormSaveButton(page, 'UPDATE');
            await rowScaleDisplaysAs(page, 1, statementList[0].newSignificance);
            await rowStatementDisplaysAs(page, 1, statementList[0].newText);
            await rowAuthorDisplaysAs(page, 1, 'Belanger');

            await page.getByTestId('submit-admin-top').click();
            const dialog = page.getByRole('dialog');
            await expect(dialog.locator('h2')).toContainText('Work has been updated');
        });

        test('can reorder the scale-statement row set', async ({ page }) => {
            await adminEditTabbedView(page);
            await page.getByTestId('authors-tab').click();

            const NTROSectionContent = page.getByTestId('ntro-section-content');
            const significanceStatementCard = NTROSectionContent.locator('.AdminCard').first(); // <--- KEPT: This one is used for `moveDownButton` and `moveUpButton` below
            await expect(significanceStatementCard.locator('h4')).toHaveText(
                /Scale\/Significance of work & Creator research statement/,
            );

            await rowAuthorDisplaysAs(page, 0, 'Ashkanasy');
            await rowAuthorDisplaysAs(page, 1, 'Belanger');
            await rowAuthorDisplaysAs(page, 2, 'Bernal');

            const moveDownButton = significanceStatementCard.getByTestId('rek-significance-list-row-1-move-down');
            await moveDownButton.click();

            // note order change of the STATEMENT only
            await rowAuthorDisplaysAs(page, 0, 'Ashkanasy');
            await rowAuthorDisplaysAs(page, 1, 'Belanger');
            await rowAuthorDisplaysAs(page, 2, 'Bernal');

            const moveUpButton = significanceStatementCard.getByTestId('rek-significance-list-row-1-move-up');
            await moveUpButton.click();

            await rowAuthorDisplaysAs(page, 0, 'Ashkanasy');
            await rowAuthorDisplaysAs(page, 1, 'Belanger');
            await rowAuthorDisplaysAs(page, 2, 'Bernal');
        });

        test('can edit the scale-statement row set then be reordered and the record is still updated', async ({
            page,
        }) => {
            await adminEditTabbedView(page);
            await page.getByTestId('authors-tab').click();

            const NTROSectionContent = page.getByTestId('ntro-section-content');
            await expect(NTROSectionContent).toBeVisible();

            await clickRowEditButton(page, 1);
            await typeCKEditor(page, 'rek-creator-contribution-statement', statementList[0].newText);
            // popup appears at foot of page, outside Admin section
            await assertChangeSelectFromTo(page, 'rek-significance', '', statementList[0].newSignificance);

            const updatedNTROSectionContentAfterEdit = page.getByTestId('ntro-section-content');
            const updatedSignificanceStatementCardAfterEdit = updatedNTROSectionContentAfterEdit
                .locator('.AdminCard')
                .first();

            await clickFormSaveButton(page, 'UPDATE');
            await rowScaleDisplaysAs(page, 1, statementList[0].newSignificance);
            await rowStatementDisplaysAs(page, 1, statementList[0].newText);
            await rowAuthorDisplaysAs(page, 1, 'Belanger');

            await rowAuthorDisplaysAs(page, 0, 'Ashkanasy');
            await rowAuthorDisplaysAs(page, 1, 'Belanger');
            await rowAuthorDisplaysAs(page, 2, 'Bernal');

            const moveDownButton = updatedSignificanceStatementCardAfterEdit.getByTestId(
                'rek-significance-list-row-1-move-down',
            );
            await moveDownButton.click();

            await rowAuthorDisplaysAs(page, 0, 'Ashkanasy');
            await rowAuthorDisplaysAs(page, 1, 'Belanger');
            await rowAuthorDisplaysAs(page, 2, 'Bernal');

            await rowScaleDisplaysAs(page, 2, statementList[0].newSignificance);
            await rowStatementDisplaysAs(page, 2, statementList[0].newText);

            // save does not cause crash
            await page.getByTestId('submit-admin-top').click();
            // Confirmation message
            const dialog = page.getByRole('dialog');
            await expect(dialog).toBeVisible();
            await expect(dialog.locator('h2')).toContainText('Work has been updated');
        });
    });
});
