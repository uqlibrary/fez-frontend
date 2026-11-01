// Jest snapshot serializer for DOM elements.
//
// 1. Emotion/MUI class hashes. MUI (emotion) generates class names like `css-d64g0g-MuiGrid-root`
//    (and bare `css-1oqhn84`). The `css-<hash>` part changes whenever a style or theme value changes,
//    so committed snapshots churn on every styling tweak and produce frequent merge conflicts between
//    developers. We strip the volatile hash and keep the meaningful structural suffix:
//        css-d64g0g-MuiGrid-root  ->  css-MuiGrid-root
//        css-1oqhn84              ->  css
//    Snapshots then stay stable across style/theme changes. Style regressions are caught by the
//    Playwright e2e + axe + visual checks, not by these class hashes (which were never reviewable).
//
// 2. Dynamic attribute values (e.g. aria-controls) are replaced with a stable placeholder via the map
//    below. Add an entry per attribute; each rule is [match, replacement] applied per space-separated token.

const attributeValueToReplacementMap: { [key: string]: Array<[RegExp, string]> } = {
    'aria-controls': [[/^.*$/, '<dynamic>']],
    // conditional replacement example
    // 'data-test-id': [
    //     [/prod-.+/, 'test-id'],
    //     [/dev-.+/, 'dev-test-id'],
    // ],
};

// `css-<hash>` optionally followed by a structural suffix like `-MuiGrid-root`. The hash is base36
// (lowercase letters + digits); the suffix starts with a non-digit so we don't eat another hash.
const emotionClassPattern = /\bcss-[a-z0-9]+(-[A-Za-z][\w-]*)?/g;

const normalizeAttributeValue = (name: string, value: string): string => {
    if (name === 'class') {
        return value.replace(emotionClassPattern, (_match, suffix) => 'css' + (suffix || ''));
    }
    const rules = attributeValueToReplacementMap[name];
    if (!rules) return value;
    return value
        .split(' ')
        .map(part => {
            for (const [regex, replacement] of rules) {
                if (regex.test(part)) return replacement;
            }
            return part;
        })
        .join(' ');
};

// True if any of the element's own attributes would change under normalization. Checking "would change"
// (rather than just "is a known attribute name") means an already-normalized clone reports false, so the
// re-serialization of the clone below does not re-trigger this serializer.
const needsNormalizing = (el: Element): boolean => {
    for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        if (normalizeAttributeValue(attr.name, attr.value) !== attr.value) return true;
    }
    return false;
};

const normalizeTree = (el: Element): void => {
    for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        const next = normalizeAttributeValue(attr.name, attr.value);
        if (next !== attr.value) attr.value = next;
    }
    for (let i = 0; i < el.children.length; i++) normalizeTree(el.children[i]);
};

let lastCleanedNode: Element | null = null;
module.exports = {
    print: (val: Element, serialize: (v: Element) => string) => {
        const clone = val.cloneNode(true) as Element;
        normalizeTree(clone);
        lastCleanedNode = clone;
        return serialize(clone);
    },
    test: (val: Element) => {
        if (val === lastCleanedNode || !val?.attributes) return false;
        return needsNormalizing(val);
    },
};
