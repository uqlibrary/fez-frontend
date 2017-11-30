import * as actions from 'actions/actionTypes';

export const initialState = {
    account: null,
    author: null,
    authorDetails: null,
    accountLoading: true,
    authorLoading: true,
    loadingAuthorDetails: true
};

const handlers = {
    [actions.ACCOUNT_LOADING]: () => ({
        ...initialState
    }),

    [actions.ACCOUNT_LOADED]: (state, action) => ({
        ...state,
        accountLoading: false,
        account: action.payload
    }),

    [actions.ACCOUNT_ANONYMOUS]: () => ({
        ...initialState,
        accountLoading: false,
        accountAuthorLoading: false,
        accountAuthorDetailsLoading: false
    }),

    [actions.ACCOUNT_AUTHOR_FAILED]: (state) => ({
        ...state,
        author: null,
        authorLoading: false
    }),

    [actions.ACCOUNT_AUTHOR_LOADED]: (state, action) => {
        return {
            ...state,
            author: action.payload,
            authorLoading: false
        };
    },

    [actions.ACCOUNT_AUTHOR_LOADING]: (state) => ({
        ...state,
        author: null,
        authorLoading: true
    }),

    [actions.ACCOUNT_AUTHOR_DETAILS_FAILED]: (state) => ({
        ...state,
        authorDetails: null,
        loadingAuthorDetails: false
    }),

    [actions.ACCOUNT_AUTHOR_DETAILS_LOADED]: (state, action) => ({
        ...state,
        authorDetails: action.payload,
        loadingAuthorDetails: false
    }),

    [actions.ACCOUNT_AUTHOR_DETAILS_LOADING]: (state) => ({
        ...state,
        authorDetails: null,
        loadingAuthorDetails: true
    }),

    [actions.AUTHOR_IDENTIFIER_ADDED]: (state, action) => ({
        ...state,
        author: action.payload
    })
};

export default function accountReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
