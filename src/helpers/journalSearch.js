export const getDefaultOperand = type => {
    return type.toLowerCase() === 'keyword' ? 'AND' : 'OR';
};
