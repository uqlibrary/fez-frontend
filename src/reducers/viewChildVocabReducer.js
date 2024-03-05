import * as actions from 'actions/actionTypes';

/**
 * Find the current expanded list and their path based on the parentId and the root list
 *
 * @param {array} lists the root list
 * @param {integer} parentId the clicked ID
 * @param {array} currentPath the current list's path
 *
 * @returns {array} two elements, the first is the list to show, the second is the path to it
 */
export function findCurrentChild(lists, parentId, currentPath = []) {
    if (parentId === 0) return [lists, currentPath];
    if (lists && lists.length) {
        // current level
        if (+lists[0].cvr_parent_cvo_id === Number(parentId)) {
            return [lists, currentPath];
        } else {
            // child level
            for (let i = 0; i < lists.length; i++) {
                const em = lists[i];
                if (+em.cvr_child_cvo_id === Number(parentId)) {
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
                if (currentList && newPath.length) {
                    return [currentList, newPath];
                }
            }
        }
    }
    return [[], []];
}

export const initialState = {
    childData: {},
    loadingChildVocab: {},
    loadingChildVocabError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

const handlers = {
    [actions.VIEW_CHILD_VOCAB_LOADING]: (state, action) => {
        const rootId = action.rootId;
        state.loadingChildVocab[rootId] = true;
        return {
            ...state,
            childData: { ...state.childData, [rootId]: { path: [], data: [] } },
        };
    },

    [actions.VIEW_CHILD_VOCAB_LOADED]: (state, action) => {
        const rootId = action.rootId;
        if (!action.payload.data) {
            state.loadingChildVocab[rootId] = false;
            return {
                ...state,
            };
        }

        const [currentChildData, path] = findCurrentChild(action.payload.data, action.parentId);

        state.loadingChildVocab[rootId] = false;
        return {
            ...state,
            childData: { ...state.childData, [rootId]: { path: path, data: currentChildData } },
        };
    },

    [actions.VIEW_CHILD_VOCAB_LOAD_FAILED]: (state, action) => {
        Object.keys(state.loadingChildVocab).forEach(key => {
            state.loadingChildVocab[key] = false;
        });
        return {
            ...state,
            loadingChildVocabError: action.payload,
        };
    },
};

export default function viewChildVocabReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
