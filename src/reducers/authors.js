import * as actions from 'actions/actionTypes';

export const initialState = {
    authorsListLoading: false,
    authorsListLoadingError: false,
    authorsList: [],
};

const handlers = {
    [actions.AUTHORS_LOAD_FAILED]: () => ({
        authorsList: [],
        authorsListLoading: false,
        authorsListLoadingError: true,
    }),

    [actions.AUTHORS_LOADED]: (state, action) => ({
        authorsList: action.payload,
        authorsListLoading: false,
        authorsListLoadingError: false,
    }),

    [actions.AUTHORS_LOADING]: () => ({
        authorsList: [],
        authorsListLoading: true,
        authorsListLoadingError: false,
    }),

    [actions.CLEAR_AUTHORS_LIST]: () => ({
        authorsList: [],
        authorsListLoading: false,
        authorsListLoadingError: false,
    }),
};

export default function authorsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
