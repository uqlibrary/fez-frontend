export const findCurrentChild = (lists, parentId, currentPath = []) => {
    if (parentId === 0) return [lists, currentPath];
    if (lists && lists.length) {
        // current level
        if (lists[0].cvr_parent_cvo_id === parentId) {
            return [lists, currentPath];
        } else {
            // child level
            for (let i = 0; i < lists.length; i++) {
                const em = lists[i];
                if (em.cvr_child_cvo_id === parentId) {
                    const path = [
                        ...currentPath,
                        { id: em.controlled_vocab.cvo_id, title: em.controlled_vocab.cvo_title },
                    ];
                    return [em.controlled_vocab.controlled_vocab_children, path];
                }
            }
            // further level
            for (let i = 0; i < lists.length; i++) {
                const em = lists[i];
                const path = [...currentPath, { id: em.controlled_vocab.cvo_id, title: em.controlled_vocab.cvo_title }];
                const [currentList, newPath] = findCurrentChild(
                    em.controlled_vocab.controlled_vocab_children,
                    parentId,
                    path,
                );
                if (currentList) return [currentList, newPath];
            }
        }
    }
    return [[], [...currentPath]];
};
