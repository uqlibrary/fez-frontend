import {
    POSSIBLY_YOURS_PUBLICATIONS_LOADING,
    POSSIBLY_YOURS_PUBLICATIONS_COMPLETED,
    POSSIBLY_YOURS_PUBLICATIONS_FAILED,
    // HIDE_PUBLICATIONS_LOADING,
    HIDE_PUBLICATIONS_COMPLETED
} from 'actions';

export const initialState = {
    totalCount: 0, // TODO: get total count
    publicationsList: [],
    loadingSearch: false,
    hidingPublications: false
};

const handlers = {

    [POSSIBLY_YOURS_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            loadingSearch: true,
            publicationsList: []
        };
    },

    [POSSIBLY_YOURS_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: action.payload
        };
    },

    [POSSIBLY_YOURS_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingSearch: true,
            publicationsList: []
        };
    },

    [HIDE_PUBLICATIONS_COMPLETED]: (state) => {
        return {
            ...state
        };
    },
};

export default function claimPublicationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(action.type);
    return handler(state, action);
}
