import * as actions from 'actions/actionTypes';

export const initialState = {
    journalToView: null,
    loadingJournalToView: true,
    journalToViewError: null,
    journalLoadingError: false,
    isJournalLocked: false,
    error: null,
};

const handlers = {
    [actions.VIEW_JOURNAL_LOADING]: () => ({
        ...initialState,
    }),

    [actions.VIEW_JOURNAL_LOADED]: (state, action) => {
        const journalToView = action.payload;
        Array.isArray(journalToView?.fez_journal_issn || undefined) &&
            journalToView.fez_journal_issn.sort((a, b) => a.jnl_issn_order > b.jnl_issn_order);
        return {
            ...initialState,
            loadingJournalToView: false,
            journalToView,
            isJournalLocked: !!action.payload && !!action.payload.jnl_editing_user,
        };
    },

    [actions.VIEW_JOURNAL_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingJournalToView: false,
        journalLoadingError: true,
        journalToViewError: action.payload,
    }),

    [actions.ADMIN_UPDATE_JOURNAL_FAILED]: (state, action) => ({
        ...state,
        error: action.payload,
    }),

    [actions.ADMIN_JOURNAL_CLEAR]: () => ({
        ...initialState,
        isJournalLocked: false,
    }),

    [actions.ADMIN_JOURNAL_UNLOCK]: state => ({
        ...state,
        isJournalLocked: false,
    }),
};

export default function viewJournalReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
