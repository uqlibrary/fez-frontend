module.exports = {
    meta: {
        type: 'layout',
        fixable: 'code',
        schema: [],
        messages: {
            useShorthand: 'Boolean JSX attributes should use shorthand notation.',
        },
    },
    create(context) {
        return {
            JSXAttribute(node) {
                if (
                    node.value?.type === 'JSXExpressionContainer' &&
                    node.value.expression.type === 'Literal' &&
                    node.value.expression.value === true
                ) {
                    context.report({
                        node,
                        messageId: 'useShorthand',
                        fix(fixer) {
                            return fixer.replaceText(node, node.name.name);
                        },
                    });
                }
            },
        };
    },
};
