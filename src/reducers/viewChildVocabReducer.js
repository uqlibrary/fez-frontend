import * as actions from 'actions/actionTypes';

export const initialState = {
    childData: [],
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
    [actions.VIEW_CHILD_VOCAB_LOADING]: (state, action) => ({
        ...state,
        loadingChildVocab: true,
        openedVocabLists: [],
        childData: { ...state.childData, [action.payloadId]: [] },
    }),

    [actions.VIEW_CHILD_VOCAB_LOADED]: (state, action) => {
        console.log('VIEW_CHILD_VOCAB_LOADED=', action.payload.data);
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

        console.log('new child Data=', { ...state.childData, [action.payloadId]: filteredList[0].data });
        return {
            ...state,
            loadingChildVocab: false,
            openedVocabLists: [...filteredList],
            childData: { ...state.childData, [action.payloadId]: filteredList[0].data },
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
