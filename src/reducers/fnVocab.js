export const findCurrentChild = (lists, parentId) => {
    console.log('parentId=', parentId);
    console.log('lists.len=', lists);
    if (parentId === 0) return lists;
    if (lists && lists.length) {
        // current level
        if (lists[0].cvr_parent_cvo_id === parentId) {
            return lists;
        } else {
            // child level
            for (let i = 0; i < lists.length; i++) {
                const em = lists[i];
                if (em.cvr_child_cvo_id === parentId) {
                    return em.controlled_vocab.controlled_vocab_children;
                }
            }
            // further level
            for (let i = 0; i < lists.length; i++) {
                const em = lists[i];
                const currentList = findCurrentChild(em.controlled_vocab.controlled_vocab_children, parentId);
                if (currentList) return currentList;
            }
        }
    }
    return [];
};
