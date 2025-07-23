import { test, expect } from '../../../test';

import { default as recordList } from 'mock/data/records/publicationTypeListDigilibImage';
import {
    adminEditCheckDefaultTab,
    adminEditCheckTabErrorBadge,
    adminEditCountCards,
    adminEditTabbedView,
    adminEditVerifyAlerts,
    assertAffiliationsAllowed,
    loadRecordForAdminEdit,
} from '../helpers';
import { checkPartialDateFromRecordValue } from '../../../lib/helpers';

test.describe('Digilib Image admin edit', () => {
    const record = recordList.data[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should load with specified elements', async ({ page }) => {
        await adminEditCountCards(page, 8);
        await adminEditVerifyAlerts(page, 2, [
            'You are required to accept deposit agreement',
            'Publication date is required',
        ]);
        await adminEditTabbedView(page);
        await adminEditCheckDefaultTab(page, 'Bibliographic');
        await adminEditCheckTabErrorBadge(page, 'bibliographic');
        await adminEditCheckTabErrorBadge(page, 'files');
    });

    test('should render the different sections as expected', async ({ page }) => {
        // ------------------------------------------ BIBLIOGRAPHIC TAB ----------------------------------------------
        console.log('Bibliographic tab');
        const bibliographicTab = page.getByTestId('bibliographic-section-content');
        await expect(page.getByTestId('bibliographic-section-header')).toHaveText('Bibliographic');
        await expect(bibliographicTab.locator('h4').getByText(/Bibliographic/)).toBeVisible();

        await expect(bibliographicTab.getByTestId('rek-rights-input')).toHaveValue(
            record.fez_record_search_key_rights.rek_rights,
        );

        await expect(bibliographicTab.getByTestId('rek-construction-date-input')).toHaveValue(
            record.fez_record_search_key_construction_date.rek_construction_date,
        );

        await checkPartialDateFromRecordValue(
            page,
            'rek-date-photo-taken',
            record.fez_record_search_key_date_photo_taken.rek_date_photo_taken,
        );

        await checkPartialDateFromRecordValue(
            page,
            'rek-date-scanned',
            record.fez_record_search_key_date_scanned.rek_date_scanned,
        );

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(2)
                .locator('h4'),
        ).toHaveText(/Geographic co-ordinates/);
        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(2)
                .getByTestId('rek-geographic-area'),
        ).toBeVisible();

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(3)
                .locator('h4'),
        ).toHaveText(/Related publications/);
        const relatedPubs = record.fez_record_search_key_isderivationof.map(item => item.rek_isderivationof_lookup);
        for (const [index, pub] of relatedPubs.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(3)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(4)
                .locator('h4'),
        ).toHaveText(/Period\(s\)/);
        const periods = record.fez_record_search_key_period.map(pub => pub.rek_period);
        for (const [index, pub] of periods.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(4)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(5)
                .locator('h4'),
        ).toHaveText(/Structural system\(s\)/);
        const structuralSystems = record.fez_record_search_key_structural_systems.map(
            pub => pub.rek_structural_systems,
        );
        for (const [index, pub] of structuralSystems.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(5)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(6)
                .locator('h4'),
        ).toHaveText(/Style/);
        const styles = record.fez_record_search_key_style.map(pub => pub.rek_style);
        for (const [index, pub] of styles.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(6)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(7)
                .locator('h4'),
        ).toHaveText(/Subcategory\(ies\)/);
        const subcategories = record.fez_record_search_key_subcategory.map(pub => pub.rek_subcategory);
        for (const [index, pub] of subcategories.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(7)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(8)
                .locator('h4'),
        ).toHaveText(/Surrounding feature\(s\)/);
        const surroundingFeatures = record.fez_record_search_key_surrounding_features.map(
            pub => pub.rek_surrounding_features,
        );
        for (const [index, pub] of surroundingFeatures.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(8)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(9)
                .locator('h4'),
        ).toHaveText(/Interior feature\(s\)/);
        const interiorFeatures = record.fez_record_search_key_interior_features.map(pub => pub.rek_interior_features);
        for (const [index, pub] of interiorFeatures.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(9)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(10)
                .locator('h4'),
        ).toHaveText(/Building material\(s\)/);
        const buildingMaterials = record.fez_record_search_key_building_materials.map(
            pub => pub.rek_building_materials,
        );
        for (const [index, pub] of buildingMaterials.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(10)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(11)
                .locator('h4'),
        ).toHaveText(/Category\(ies\)/);
        const categories = record.fez_record_search_key_category.map(pub => pub.rek_category);
        for (const [index, pub] of categories.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(11)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(12)
                .locator('h4'),
        ).toHaveText(/Condition\(s\)/);
        const conditions = record.fez_record_search_key_condition.map(pub => pub.rek_condition);
        for (const [index, pub] of conditions.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(12)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(13)
                .locator('h4'),
        ).toHaveText(/Alternative title\(s\)/);
        const alternativeTitles = record.fez_record_search_key_alternative_title.map(pub => pub.rek_alternative_title);
        for (const [index, pub] of alternativeTitles.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(13)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        await expect(
            bibliographicTab
                .locator('.AdminCard')
                .nth(14)
                .locator('h4'),
        ).toHaveText(/Architectural feature\(s\)/);
        const architecturalFeatures = record.fez_record_search_key_architectural_features.map(
            pub => pub.rek_architectural_features,
        );
        for (const [index, pub] of architecturalFeatures.entries()) {
            await expect(
                bibliographicTab
                    .locator('.AdminCard')
                    .nth(14)
                    .locator('p')
                    .nth(index),
            ).toHaveText(pub);
        }

        // ------------------------------------------ AUTHOR DETAILS TAB ---------------------------------------------
        console.log('Author Details tab');
        await expect(page.getByTestId('authors-section-header')).toHaveText('Authors');
        const authorDetailsTab = page.getByTestId('authors-section-content');

        await expect(
            authorDetailsTab
                .locator('.AdminCard')
                .nth(0)
                .locator('h4'),
        ).toHaveText(/Architects/);
        const architects = record.fez_record_search_key_architect_name.map(item => item.rek_architect_name);
        for (const [index, author] of architects.entries()) {
            await expect(
                authorDetailsTab
                    .locator('.AdminCard')
                    .nth(0)
                    .getByTestId(`rek-architect-name-list-row-${index}-name-as-published`),
            ).toHaveText(author);
        }

        await expect(
            authorDetailsTab
                .locator('.AdminCard')
                .nth(1)
                .locator('h4'),
        ).toHaveText(/Photographers/);
        const authors = record.fez_record_search_key_author.map(item => item.rek_author);
        for (const [index, author] of authors.entries()) {
            await expect(
                authorDetailsTab
                    .locator('.AdminCard')
                    .nth(1)
                    .getByTestId(`rek-author-list-row-${index}-name-as-published`),
            ).toHaveText(author);
        }

        await expect(
            authorDetailsTab
                .locator('.AdminCard')
                .nth(2)
                .locator('h4'),
        ).toHaveText(/Other contributors/);
        const contributors = record.fez_record_search_key_contributor.map(item => item.rek_contributor);
        for (const [index, contributor] of contributors.entries()) {
            await expect(
                authorDetailsTab
                    .locator('.AdminCard')
                    .nth(2)
                    .getByTestId(`rek-contributor-list-row-${index}-name-as-published`),
            ).toHaveText(contributor);
        }

        // ------------------------------------------- IDENTIFIERS TAB -----------------------------------------------
        console.log('Identifiers tab');
        const identifiersTab = page.getByTestId('identifiers-section-content');
        await expect(identifiersTab.locator('h4').getByText(/Location/)).toBeVisible();
        const locations = record.fez_record_search_key_location.map(item => item.rek_location);
        for (const [index, location] of locations.entries()) {
            await expect(identifiersTab.getByTestId(`rek-location-list-row-${index}`)).toHaveText(location);
        }
    });
});

test.describe('Author affiliations', () => {
    const record = recordList.data[0];

    test.beforeEach(async ({ page }) => {
        await loadRecordForAdminEdit(page, record.rek_pid);
    });

    test('should not be available for this work type', async ({ page }) => {
        await assertAffiliationsAllowed(page, {
            // Ensure 'page' is passed as the first argument
            authorName: 'Steve Su (uqysu4)', // Corrected from (page, uqysu4)
            orgName: 'The University of Queensland',
            rowId: 1,
            allowed: false, // Explicitly state allowed: false
        });
    });
});
