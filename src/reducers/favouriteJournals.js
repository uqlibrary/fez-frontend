import * as actions from 'actions/actionTypes';

export const initialState = {
    items: null,
    loading: false,
    loaded: false,
    error: false,
    favourites: {},
};

const handlers = {
    [actions.FAVOURITE_JOURNALS_LOADING]: state => ({
        ...state,
        loading: true,
    }),
    [actions.FAVOURITE_JOURNALS_LOADED]: (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        items: action.payload,
    }),
    [actions.FAVOURITE_JOURNALS_FAILED]: (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        error: action.payload,
        items: null,
    }),
    [actions.FAVOURITE_JOURNALS_TOGGLE_REQUESTING]: (state, action) => ({
        ...state,
        favourites: {
            ...state.favourites,
            ...{
                [action.payload.id]: {
                    isFavourite: action.payload.isFavourite,
                    requesting: true,
                },
            },
        },
    }),
    [actions.FAVOURITE_JOURNALS_TOGGLE_SUCCESS]: (state, action) => ({
        ...state,
        favourites: {
            ...state.favourites,
            ...{
                [action.payload.id]: {
                    isFavourite: action.payload.isFavourite,
                    requesting: false,
                    success: true,
                },
            },
        },
    }),
    [actions.FAVOURITE_JOURNALS_TOGGLE_FAILED]: (state, action) => ({
        ...state,
        favourites: {
            ...state.favourites,
            ...{
                [action.payload.id]: {
                    isFavourite: action.payload.isFavourite,
                    requesting: false,
                    success: false,
                },
            },
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
