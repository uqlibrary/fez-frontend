import {AUTHOR_DETAILS_LOADING, AUTHOR_DETAILS_FAILED, AUTHOR_DETAILS_LOADED} from '../actions';

export const initialState = {
    authorDetailsLoading: true,
    authorDetails: null
};

const handlers = {
    [AUTHOR_DETAILS_LOADING]: () => ({
        authorDetailsLoading: true,
        authorDetails: null
    }),

    [AUTHOR_DETAILS_LOADED]: (state, action) => ({
        authorDetailsLoading: false,
        authorDetails: action.payload
    }),

    [AUTHOR_DETAILS_FAILED]: () => ({
        authorDetailsLoading: false,
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
