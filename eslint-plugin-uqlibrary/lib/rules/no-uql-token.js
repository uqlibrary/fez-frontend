const MOCK_UQL_TOKEN = 'abc123';
const ERROR_MESSAGE_CONDITIONAL = 'Please remove UQL token from conditional statement';
const ERROR_MESSAGE_DIRECT_ASSIGNMENT = 'Please get UQL token from Cookies';

const isLeftNodeApiToken = node => {
    if (
        node.left.hasOwnProperty('object') &&
        node.left.object.hasOwnProperty('object') &&
        node.left.object.object.hasOwnProperty('object') &&
        node.left.object.object.object.hasOwnProperty('property')
    ) {
        return (
            node.left.object.object.object.property.name === 'defaults' &&
            node.left.object.object.property.name === 'headers' &&
            node.left.object.property.name === 'common' &&
            node.left.property.name === 'TOKEN_NAME'
        );
    }
    return false;
};

const isMockToken = node => {
    return node.right.type === 'Literal' && node.right.value === MOCK_UQL_TOKEN;
};

module.exports = context => ({
    AssignmentExpression: node => {
        if (isLeftNodeApiToken(node)) {
            if (
                node.right.type === 'LogicalExpression' &&
                (node.right.left.type === 'Literal' || node.right.right.type === 'Literal')
            ) {
                context.report(node, ERROR_MESSAGE_CONDITIONAL);
            } else if (node.right.type === 'Literal' && !isMockToken(node)) {
                context.report(node, ERROR_MESSAGE_DIRECT_ASSIGNMENT);
            }
        }
    },
});
