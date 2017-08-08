import * as actions from 'actions/account';

export const initialState = {
    account: null,
    author: null,
    authorDetails: null,
    accountLoading: true,
    authorLoading: true,
    authorDetailsLoading: true
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

    [actions.ACCOUNT_AUTHOR_LOADED]: (state, action) => ({
        ...state,
        author: action.payload,
        authorLoading: false
    }),

    [actions.ACCOUNT_AUTHOR_LOADING]: (state) => ({
        ...state,
        author: null,
        authorLoading: true
    }),

    [actions.ACCOUNT_AUTHOR_DETAILS_FAILED]: (state) => ({
        ...state,
        authorDetails: null,
        authorDetailsLoading: false
    }),

    [actions.ACCOUNT_AUTHOR_DETAILS_LOADED]: (state, action) => ({
        ...state,
        authorDetails: action.payload,
        authorDetailsLoading: false
    }),

    [actions.ACCOUNT_AUTHOR_DETAILS_LOADING]: (state) => ({
        ...state,
        authorDetails: null,
        authorDetailsLoading: true
    })
};

export default function accountReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
