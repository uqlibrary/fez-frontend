import * as actions from 'actions/actionTypes';

export const initialState = {
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
    [actions.VIEW_CHILD_VOCAB_LOADING]: state => ({
        ...state,
        loadingChildVocab: true,
    }),

    [actions.VIEW_CHILD_VOCAB_LOADED]: (state, action) => {
        if (!action.payload.data || action.payload.data.length <= 0) {
            return {
                // ...state,
                openedVocabLists: state.openedVocabLists,
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

        return {
            ...initialState,
            loadingChildVocab: false,
            openedVocabLists: [...filteredList],
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
