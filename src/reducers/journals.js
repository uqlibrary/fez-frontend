import * as actions from 'actions/actionTypes';

export const initialJournalSearchKeywords = {
    exactMatch: [],
    titleMatch: [],
    keywordMatch: [],
    subjectMatch: [],
};

export const initialState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
    journalDetails: {},
    journalLoading: false,
    journalLoadingError: false,
    journalSearchKeywordsLoading: false,
    journalSearchKeywords: { ...initialJournalSearchKeywords },
    journalSearchKeywordsError: null,
    isInitialValues: true,
    isJournalLocked: false, // TODO
    journalToViewError: null,
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
        journalDetails: {},
        journalLoading: true,
        journalLoadingError: false,
        journalToViewError: null,
    }),
    [actions.JOURNAL_LOADED]: (state, action) => ({
        ...state,
        journalDetails: action.payload,
        journalLoading: false,
        journalToViewError: null,
        isJournalLocked: !!action.payload.jnl_editing_user,
    }),
    [actions.JOURNAL_LOAD_FAILED]: (state, action) => ({
        ...state,
        journalDetails: {},
        journalLoading: false,
        journalLoadingError: true,
        journalToViewError: action.payload,
    }),
    [actions.JOURNAL_SEARCH_KEYWORDS_LOADING]: state => ({
        ...state,
        journalSearchKeywordsLoading: true,
        journalSearchKeywordsError: null,
    }),
    [actions.JOURNAL_SEARCH_KEYWORDS_LOADED]: (state, action) => ({
        journalSearchKeywordsLoading: false,
        journalSearchKeywords: action.payload,
        journalSearchKeywordsError: null,
        isInitialValues: false,
    }),
    [actions.JOURNAL_SEARCH_KEYWORDS_FAILED]: (state, action) => ({
        journalSearchKeywordsLoading: false,
        journalSearchKeywords: { ...initialJournalSearchKeywords },
        journalSearchKeywordsError: action.payload,
    }),
    [actions.CLEAR_JOURNAL_SEARCH_KEYWORDS]: state => ({
        ...state,
        journalSearchKeywords: { ...initialJournalSearchKeywords },
        isInitialValues: true,
    }),
    [actions.ADMIN_JOURNAL_CLEAR]: /* istanbul ignore next */ () => /* istanbul ignore next */ ({
        ...initialState,
        isJournalLocked: false,
    }),

    [actions.ADMIN_JOURNAL_UNLOCK]: /* istanbul ignore next */ state => /* istanbul ignore next */ ({
        ...state,
        isJournalLocked: false,
    }),
};

export default function journalReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
