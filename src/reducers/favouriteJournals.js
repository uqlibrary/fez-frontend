import * as actions from 'actions/actionTypes';

export const initialState = {
    response: null,
    loading: false,
    error: null,
    add: {
        loading: false,
        error: null,
    },
    remove: {
        loading: false,
        error: null,
    },
};

const handlers = {
    [actions.FAVOURITE_JOURNALS_LOADING]: state => ({
        ...state,
        loading: true,
    }),
    [actions.FAVOURITE_JOURNALS_LOADED]: (state, action) => ({
        ...state,
        loading: false,
        response: action.payload,
    }),
    [actions.FAVOURITE_JOURNALS_FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload?.message,
        response: null,
    }),
    [actions.FAVOURITE_JOURNALS_ADD_REQUESTING]: state => ({
        ...state,
        add: {
            ...state.add,
            loading: true,
        },
    }),
    [actions.FAVOURITE_JOURNALS_ADD_SUCCESS]: state => ({
        ...state,
        add: {
            ...state.add,
            loading: false,
        },
    }),
    [actions.FAVOURITE_JOURNALS_ADD_FAILED]: (state, action) => ({
        ...state,
        add: {
            ...state.add,
            loading: false,
            error: action.payload?.message,
        },
    }),
    [actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING]: state => ({
        ...state,
        remove: {
            ...state.remove,
            loading: true,
        },
    }),
    [actions.FAVOURITE_JOURNALS_REMOVE_SUCCESS]: state => ({
        ...state,
        remove: {
            ...state.remove,
            loading: false,
        },
    }),
    [actions.FAVOURITE_JOURNALS_REMOVE_FAILED]: (state, action) => ({
        ...state,
        remove: {
            ...state.remove,
            loading: false,
            error: action.payload?.message,
        },
    }),
};

export default function favouriteJournalsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
