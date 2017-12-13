import * as actions from 'actions/actionTypes';

export const initialState = {
    account: null,
    author: null,
    authorDetails: null,
    accountLoading: true,
    accountAuthorLoading: true,
    accountAuthorSaving: false,
    accountAuthorDetailsLoading: true
};

const handlers = {
    [actions.CURRENT_ACCOUNT_LOADING]: () => ({
        ...initialState
    }),

    [actions.CURRENT_ACCOUNT_LOADED]: (state, action) => ({
        ...state,
        accountLoading: false,
        account: action.payload
    }),

    [actions.CURRENT_ACCOUNT_ANONYMOUS]: () => ({
        ...initialState,
        accountLoading: false,
        accountAuthorLoading: false,
        accountAuthorDetailsLoading: false
    }),

    [actions.CURRENT_AUTHOR_FAILED]: (state) => ({
        ...state,
        author: null,
        accountAuthorLoading: false
    }),

    [actions.CURRENT_AUTHOR_LOADED]: (state, action) => ({
        ...state,
        author: action.payload,
        accountAuthorLoading: false
    }),

    [actions.CURRENT_AUTHOR_LOADING]: (state) => ({
        ...state,
        author: null,
        accountAuthorLoading: true
    }),

    [actions.CURRENT_AUTHOR_SAVING]: (state) => ({
        ...state,
        accountAuthorSaving: true
    }),

    [actions.CURRENT_AUTHOR_SAVE_FAILED]: (state) => ({
        ...state,
        accountAuthorSaving: false
    }),

    [actions.CURRENT_AUTHOR_SAVED]: (state, action) => ({
        ...state,
        author: action.payload,
        accountAuthorSaving: false
    }),

    [actions.CURRENT_AUTHOR_DETAILS_FAILED]: (state) => ({
        ...state,
        authorDetails: null,
        accountAuthorDetailsLoading: false
    }),

    [actions.CURRENT_AUTHOR_DETAILS_LOADED]: (state, action) => ({
        ...state,
        authorDetails: action.payload,
        accountAuthorDetailsLoading: false
    }),

    [actions.CURRENT_AUTHOR_DETAILS_LOADING]: (state) => ({
        ...state,
        authorDetails: null,
        accountAuthorDetailsLoading: true
    })
};

export default function accountReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
