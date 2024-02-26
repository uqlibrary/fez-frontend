import * as actions from 'actions/actionTypes';
import { findCurrentChild } from './fnVocab';

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
        const rootId = action.rootId || action.parentId;
        return {
            ...state,
            loadingChildVocab: { rootId: true },
            childData: { ...state.childData, [rootId]: { path: [], data: [] } },
        };
    },

    [actions.VIEW_CHILD_VOCAB_LOADED]: (state, action) => {
        const rootId = action.rootId || action.parentId;
        if (!action.payload.data) {
            return {
                ...state,
                loadingChildVocab: { rootId: false },
            };
        }

        const [currentChildData, path] = findCurrentChild(action.payload.data, action.parentId);

        return {
            ...state,
            loadingChildVocab: { rootId: false },
            childData: { ...state.childData, [rootId]: { path: path, data: currentChildData } },
        };
    },

    [actions.VIEW_CHILD_VOCAB_LOAD_FAILED]: (state, action) => ({
        ...state,
        loadingChildVocab: { rootId: false },
        loadingChildVocabError: action.payload,
    }),
};

export default function viewChildVocabReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
