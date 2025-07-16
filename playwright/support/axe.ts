import AxeBuilder from '@axe-core/playwright';
import { expect, Page } from '../lib/fixture';

export const assertAccessibility = async (
    page: Page,
    context: string,
    severity: string[] = ['minor', 'moderate', 'serious', 'critical'],
) => {
    const results = await new AxeBuilder({ page }).include(context).analyze();
    const filtered = results.violations.filter(violation => severity.includes(violation.impact));
    if (filtered.length > 0) {
        console.warn('Accessibility Violations Found (filtered by impact):');
        console.table(
            filtered.map(violation => ({
                id: violation.id,
                description: violation.description,
                impact: violation.impact,
                nodes: violation.nodes.length,
                helpUrl: violation.helpUrl,
            })),
        );
    }
    expect(filtered).toEqual([]);
};
