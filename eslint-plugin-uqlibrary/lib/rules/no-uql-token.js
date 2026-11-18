const MOCK_UQL_TOKEN = 'abc123';

const isProperty = (node, name) =>
    node?.type === 'MemberExpression' && node.property.type === 'Identifier' && node.property.name === name;

const isLeftNodeApiToken = node =>
    isProperty(node, 'TOKEN_NAME') &&
    isProperty(node.object, 'common') &&
    isProperty(node.object.object, 'headers') &&
    isProperty(node.object.object.object, 'defaults');

const isMockToken = node => node.type === 'Literal' && node.value === MOCK_UQL_TOKEN;

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Prevent direct UQL token assignments',
        },
        schema: [],
        messages: {
            conditional: 'Please remove UQL token from conditional statement',
            directAssignment: 'Please get UQL token from Cookies',
        },
    },
    create(context) {
        return {
            AssignmentExpression: node => {
                if (isLeftNodeApiToken(node.left)) {
                    if (
                        node.right.type === 'LogicalExpression' &&
                        (node.right.left.type === 'Literal' || node.right.right.type === 'Literal')
                    ) {
                        context.report({ node, messageId: 'conditional' });
                    } else if (node.right.type === 'Literal' && !isMockToken(node.right)) {
                        context.report({ node, messageId: 'directAssignment' });
                    }
                }
            },
        };
    },
};
