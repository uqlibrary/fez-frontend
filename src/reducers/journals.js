import * as actions from 'actions/actionTypes';

export const initState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
    journalDetails: false,
    journalLoading: false,
    journalLoadingError: false,
};

const handlers = {
    [actions.JOURNAL_LOOKUP_LOADING]: state => ({
        ...state,
        itemsList: [],
        itemsLoading: true,
        itemsLoadingError: false,
    }),
    [actions.JOURNAL_LOOKUP_LOADED]: (state, action) => ({
        ...state,
        itemsList: action.payload,
        itemsLoading: false,
    }),
    [actions.JOURNAL_LOOKUP_FAILED]: state => ({
        ...state,
        itemsList: [],
        itemsLoading: false,
        itemsLoadingError: true,
    }),
    [actions.JOURNAL_LOADING]: state => ({
        ...state,
        journalDetails: false,
        journalLoading: true,
        journalLoadingError: false,
    }),
    [actions.JOURNAL_LOADED]: (state, action) => ({
        ...state,
        journalDetails: action.payload,
        journalLoading: false,
    }),
    [actions.JOURNAL_LOAD_FAILED]: state => ({
        ...state,
        journalDetails: false,
        journalLoading: false,
        journalLoadingError: true,
    }),
};

export default function journalReducer(state = {}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
