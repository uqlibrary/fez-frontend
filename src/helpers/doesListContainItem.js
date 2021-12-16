export const doesListContainItem = (list, term) => {
    return list.some(sort => (typeof sort === 'object' ? sort.value === term : sort === term));
};
