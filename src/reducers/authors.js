import {AUTHORS_LOADING, AUTHORS_LOAD_FAILED, AUTHORS_LOADED} from '../actions';

export const initialState = {
    authorsListLoading: false,
    authorsListLoadingError: false,
    authorsList: []
};

const handlers = {
    [AUTHORS_LOAD_FAILED]: () => ({
        authorsList: [],
        authorsListLoading: false,
        authorsListLoadingError: true
    }),

    [AUTHORS_LOADED]: (state, action) => ({
        authorsList: action.payload,
        authorsListLoading: false,
        authorsListLoadingError: false
    }),

    [AUTHORS_LOADING]: () => ({
        authorsListLoading: true,
        authorsListLoadingError: false
    })
};

export default function authorsReducer2(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
