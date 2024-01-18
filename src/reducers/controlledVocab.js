import * as actions from 'actions/actionTypes';

export const initialState = {
    vocabList: [],
    loadingVocab: false,
    loadingVocabError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

const handlers = {
    [actions.VIEW_VOCAB_LOADING]: () => ({
        ...initialState,
        loadingVocab: true,
    }),

    [actions.VIEW_VOCAB_LOADED]: (state, action) => ({
        ...initialState,
        loadingVocab: false,
        vocabList: action.payload.data,
        totalRecords: action.payload.total,
        startRecord: action.payload.from,
        endRecord: action.payload.to,
        currentPage: action.payload.current_page,
        perPage: action.payload.per_page,
    }),

    [actions.VIEW_VOCAB_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingVocab: false,
        loadingVocabError: action.payload,
    }),
};

export default function viewVocabReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
