import {CURRENT_AUTHOR_LOADED, CURRENT_AUTHOR_FAILED, CURRENT_AUTHOR_LOADING} from '../actions';

export const initialState = {
    currentAuthor: null,
    currentAuthorLoading: false,
    currentAuthorLoadingError: false
};

const handlers = {
    [CURRENT_AUTHOR_FAILED]: () => ({
        currentAuthor: null,
        currentAuthorLoading: false,
        currentAuthorLoadingError: true
    }),

    [CURRENT_AUTHOR_LOADED]: (state, action) => ({
        currentAuthor: action.payload,
        currentAuthorLoading: false,
        currentAuthorLoadingError: false
    }),

    [CURRENT_AUTHOR_LOADING]: () => ({
        currentAuthor: null,
        currentAuthorLoading: true,
        currentAuthorLoadingError: false
    })
};

export default function currentAuthorReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
