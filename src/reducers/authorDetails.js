import * as actions from 'actions/actionTypes';

export const initialState = {
    accountAuthorDetailsLoading: true,
    authorDetails: null
};

const handlers = {
    [actions.AUTHOR_DETAILS_LOADING]: () => ({
        accountAuthorDetailsLoading: true,
        authorDetails: null
    }),

    [actions.AUTHOR_DETAILS_LOADED]: (state, action) => ({
        accountAuthorDetailsLoading: false,
        authorDetails: action.payload
    }),

    [actions.AUTHOR_DETAILS_FAILED]: () => ({
        accountAuthorDetailsLoading: false,
        authorDetails: null
    })
};

export default function authorDetailsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
