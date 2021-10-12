import * as actions from 'actions/actionTypes';

export const initialState = {
    response: null,
    loading: false,
    error: null,
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
        response: action.payload,
    }),
    [actions.FAVOURITE_JOURNALS_FAILED]: (state, action) => ({
        ...state,
        loading: false,
        error: action.payload,
        response: null,
    }),
    [actions.FAVOURITE_JOURNALS_TOGGLE_LOADING]: (state, action) => ({
        ...state,
        favourites: {
            ...state.favourites,
            ...{
                [action.payload.id]: {
                    loading: true,
                },
            },
        },
    }),
    [actions.FAVOURITE_JOURNALS_TOGGLE_LOADED]: (state, action) => ({
        ...state,
        favourites: {
            ...state.favourites,
            ...{
                [action.payload.id]: {
                    isFavourite: action.payload.isFavourite,
                    loading: false,
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
                    loading: false,
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
    const newstate = handler(state, action);
    console.log(newstate);
    return newstate;
}
