import * as actions from 'actions/actionTypes';

export const initialState = {
    vocabList: [],
    loadingChildVocab: false,
    loadingChildVocabError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

const handlers = {
    [actions.VIEW_CHILD_VOCAB_LOADING]: () => ({
        ...initialState,
        loadingChildVocab: true,
    }),

    [actions.VIEW_CHILD_VOCAB_LOADED]: (state, action) => {
        // code to extract data

        return {
            ...initialState,
            loadingChildVocab: false,
            vocabList: action.payload.data,
            totalRecords: action.payload.total,
            // startRecord: action.payload.from,
            // endRecord: action.payload.to,
            // currentPage: action.payload.current_page,
            // perPage: action.payload.per_page,
        };
    },

    [actions.VIEW_CHILD_VOCAB_LOAD_FAILED]: (state, action) => ({
        ...initialState,
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
