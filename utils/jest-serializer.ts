const attributeValueToReplacementMap: { [key: string]: Array<[RegExp, string]> } = {
    'aria-controls': [[/^.*$/, '<dynamic>']],
    // conditional replacement example
    // 'data-test-id': [
    //     [/prod-.+/, 'test-id'],
    //     [/dev-.+/, 'dev-test-id'],
    // ],
};

let lastCleanedNode: Element | null = null;
module.exports = {
    print: (val: Element, serialize: (v: Element) => string) => {
        const clone = val.cloneNode(true) as Element;

        for (let i = 0; i < clone.attributes.length; i++) {
            const attr = clone.attributes[i];
            const replacementRules = attributeValueToReplacementMap[attr.name];
            if (!replacementRules) continue;

            const modifiedValue = attr.value
                .split(' ')
                .map(part => {
                    for (const [regex, replacement] of replacementRules) {
                        if (regex.test(part)) return replacement;
                    }
                    return part;
                })
                .join(' ');
            attr.value = modifiedValue;
        }

        lastCleanedNode = clone;
        return serialize(clone);
    },
    test: (val: Element) => {
        if (val === lastCleanedNode || !val?.attributes) return false;
        for (let i = 0; i < val.attributes.length; i++) {
            if (attributeValueToReplacementMap.hasOwnProperty(val.attributes[i].name)) {
                return true;
            }
        }
        return false;
    },
};
