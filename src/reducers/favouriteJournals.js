import * as actions from 'actions/actionTypes';

export const initialState = {
    favouritesResponse: null,
    favouritesLoading: false,
    favouritesError: null,
    addFavouritesLoading: false,
    removeFavouritesLoading: false,
};

const handlers = {
    [actions.FAVOURITE_JOURNALS_LOADING]: state => ({
        ...state,
        favouritesLoading: true,
    }),
    [actions.FAVOURITE_JOURNALS_LOADED]: (state, action) => ({
        ...state,
        favouritesLoading: false,
        favouritesResponse: action.payload,
    }),
    [actions.FAVOURITE_JOURNALS_FAILED]: (state, action) => ({
        ...state,
        favouritesLoading: false,
        favouritesError: action.payload,
    }),
    [actions.FAVOURITE_JOURNALS_ADD_REQUESTING]: state => ({
        ...state,
        addFavouritesLoading: true,
    }),
    [actions.FAVOURITE_JOURNALS_ADD_SUCCESS]: state => ({
        ...state,
        addFavouritesLoading: false,
    }),
    [actions.FAVOURITE_JOURNALS_ADD_FAILED]: (state, action) => ({
        ...state,
        addFavouritesLoading: false,
        addFavouritesError: action.payload,
    }),
    [actions.FAVOURITE_JOURNALS_REMOVE_REQUESTING]: state => ({
        ...state,
        removeFavouritesLoading: true,
    }),
    [actions.FAVOURITE_JOURNALS_REMOVE_SUCCESS]: state => ({
        ...state,
        removeFavouritesLoading: false,
    }),
    [actions.FAVOURITE_JOURNALS_REMOVE_FAILED]: (state, action) => ({
        ...state,
        removeFavouritesLoading: false,
        removeFavouritesError: action.payload,
    }),
};

export default function favouriteJournalsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
