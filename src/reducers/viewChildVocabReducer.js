import * as actions from 'actions/actionTypes';
import { findCurrentChild } from './fnVocab';

export const initialState = {
    childData: {},
    openedVocabLists: [],
    loadingChildVocab: false,
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
            loadingChildVocab: true,
            openedVocabLists: [],
            childData: { ...state.childData, [rootId]: [] },
        };
    },

    [actions.VIEW_CHILD_VOCAB_LOADED]: (state, action) => {
        console.log('VIEW_CHILD_VOCAB_LOADED action=', action);
        console.log('state.childData=', state.childData);
        if (!action.payload.data || action.payload.data.length <= 0) {
            return {
                ...state,
                loadingChildVocab: false,
            };
        }

        const uniqueValues = new Set();
        const list = [
            {
                data: action.payload.data,
                total: action.payload.total,
            },
            ...state.openedVocabLists,
        ];
        const filteredList = list.filter(obj => {
            const isPresent = uniqueValues.has(obj.data[0].cvr_parent_cvo_id);
            uniqueValues.add(obj.data[0].cvr_parent_cvo_id);
            return !isPresent;
        });

        const rootId = action.rootId || action.parentId;
        const path = 'Todo: Set Path';
        // ztodo: find it, ref vocabs-field-research.js for the data structure
        // const currentChildData = filteredList[0].data;
        // const lists = filteredList[0].data;

        const currentChildData = findCurrentChild(action.payload.data, action.parentId);
        console.log('currentChildData=', currentChildData);
        console.log('new child Data=', { ...state.childData, [rootId]: currentChildData });

        return {
            ...state,
            loadingChildVocab: false,
            openedVocabLists: [...filteredList],
            childData: { ...state.childData, [rootId]: { path: path, data: currentChildData } },
        };
    },

    [actions.VIEW_CHILD_VOCAB_LOAD_FAILED]: (state, action) => ({
        ...state,
        loadingChildVocab: false,
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
