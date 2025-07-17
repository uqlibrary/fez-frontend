import AxeBuilder from '@axe-core/playwright';
import { expect, Page } from '../lib/fixture';

export const defaultIncludedImpacts = ['minor', 'moderate', 'serious', 'critical'];
export const assertAccessibility = async (
    page: Page,
    selector?: string,
    options?: {
        rules?: string[];
        disabledRules?: string[];
        includedImpacts?: string[];
    },
) => {
    const builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']);
    if (selector) {
        builder.include(selector);
    }
    if (options?.rules?.length) {
        builder.withRules(options.rules);
    }
    if (options?.disabledRules?.length) {
        builder.disableRules(options.disabledRules);
    }
    const results = await builder.analyze();

    const impacts = options?.includedImpacts || defaultIncludedImpacts;
    const filtered = results.violations.filter(violation => impacts.includes(violation.impact));
    if (filtered.length > 0) {
        console.error('Accessibility Violations Found (filtered by impact):');
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
