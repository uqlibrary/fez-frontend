import * as actions from 'actions/actionTypes';

export const initialState = {
    openedVocabLists: {},
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
        console.log('action=', action);
        // code to extract data
        const existingList = state.openedVocabLists;
        if (action.payload.data && action.payload.data.length > 0) {
            const parentId = action.payload.data[0].cvr_parent_cvo_id;
            existingList[parentId] = {
                data: action.payload.data,
                total: action.payload.total,
            };
        }
        return {
            ...initialState,
            loadingChildVocab: false,
            openedVocabLists: existingList,
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
