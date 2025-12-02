import * as actions from 'actions/actionTypes';
import { AnyAction } from 'redux';

export const keywordOnlySuffix = '@keywordsOnly';

export const initialJournalSearchKeywords = {
    exactMatch: [],
    titleMatch: [],
    keywordMatch: [],
    subjectMatch: [],
};

export const keywordsInitialState = {
    journalSearchKeywordsLoading: false,
    journalSearchKeywords: { ...initialJournalSearchKeywords },
    journalSearchKeywordsError: null,
    isInitialValues: true,
};

export const initialState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
    ...keywordsInitialState,
    [`${keywordOnlySuffix}`]: {
        ...keywordsInitialState,
    },
};

const handlers: Record<string, (state: typeof initialState, action: any) => typeof initialState> = {
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
    [actions.JOURNAL_SEARCH_KEYWORDS_LOADING]: state => ({
        ...state,
        journalSearchKeywordsLoading: true,
        journalSearchKeywordsError: null,
    }),
    [actions.JOURNAL_SEARCH_KEYWORDS_LOADED]: (state, action) => ({
        ...state,
        journalSearchKeywordsLoading: false,
        journalSearchKeywords: action.payload,
        journalSearchKeywordsError: null,
        isInitialValues: false,
    }),
    [actions.JOURNAL_SEARCH_KEYWORDS_FAILED]: (state, action) => ({
        ...state,
        journalSearchKeywordsLoading: false,
        journalSearchKeywords: { ...initialJournalSearchKeywords },
        journalSearchKeywordsError: action.payload,
    }),
    [actions.CLEAR_JOURNAL_SEARCH_KEYWORDS]: state => ({
        ...state,
        journalSearchKeywords: { ...initialJournalSearchKeywords },
        isInitialValues: true,
    }),
    // keywordsOnly branch
    [`${actions.JOURNAL_SEARCH_KEYWORDS_LOADING}${keywordOnlySuffix}`]: state => ({
        ...state,
        [`${keywordOnlySuffix}`]: {
            ...state[`${keywordOnlySuffix}`],
            journalSearchKeywordsLoading: true,
            journalSearchKeywordsError: null,
        },
    }),
    [`${actions.JOURNAL_SEARCH_KEYWORDS_LOADED}${keywordOnlySuffix}`]: (state, action) => ({
        ...state,
        [`${keywordOnlySuffix}`]: {
            ...state[`${keywordOnlySuffix}`],
            journalSearchKeywordsLoading: false,
            journalSearchKeywords: action.payload,
            journalSearchKeywordsError: null,
            isInitialValues: false,
        },
    }),
    [`${actions.JOURNAL_SEARCH_KEYWORDS_FAILED}${keywordOnlySuffix}`]: (state, action) => ({
        ...state,
        [`${keywordOnlySuffix}`]: {
            ...state[`${keywordOnlySuffix}`],
            journalSearchKeywordsLoading: false,
            journalSearchKeywords: { ...initialJournalSearchKeywords },
            journalSearchKeywordsError: action.payload,
        },
    }),
};

export default function journalReducer(state = initialState, action: AnyAction) {
    const handler = handlers[action.type];
    if (!handler) return state;
    return handler(state, action);
}
