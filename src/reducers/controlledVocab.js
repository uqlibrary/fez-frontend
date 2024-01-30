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
    vocabOpened: [],
};

const handlers = {
    [actions.VIEW_VOCAB_LOADING]: state => ({
        ...initialState,
        loadingVocab: true,
        vocabOpened: state.vocabOpened,
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
        vocabOpened: state.vocabOpened,
    }),

    [actions.VIEW_VOCAB_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingVocab: false,
        loadingVocabError: action.payload,
        vocabOpened: state.vocabOpened,
    }),

    [actions.SET_OPENED_VOCAB]: (state, action) => {
        const collectionArray = [...state.vocabOpened];
        !!action.payload.open
            ? collectionArray.push(action.payload.id)
            : (collectionArray = collectionArray.filter(item => item !== action.payload.id));
        return {
            ...state,
            vocabOpened: collectionArray,
        };
    },
};

export default function viewVocabReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
