import * as actions from 'actions/actionTypes';

export const initialState = {
    account: null,
    author: null,
    authorDetails: null,
    orcidDetails: null,
    accountLoading: true,
    authorLoading: true,
    loadingAuthorDetails: true,
    loadingOrcidDetails: false
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

    [actions.AUTHOR_ORCID_DETAILS_FAILED]: (state) => ({
        ...state,
        orcidDetails: null,
        loadingOrcidDetails: false
    }),

    [actions.AUTHOR_ORCID_DETAILS_LOADED]: (state, action) => ({
        ...state,
        orcidDetails: action.payload,
        loadingOrcidDetails: false
    }),

    [actions.AUTHOR_ORCID_DETAILS_LOADING]: (state) => ({
        ...state,
        orcidDetails: null,
        loadingOrcidDetails: true
    })
};

export default function accountReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
