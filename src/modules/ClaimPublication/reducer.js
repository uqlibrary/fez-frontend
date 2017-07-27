import {
    POSSIBLY_YOUR_PUBLICATIONS_LOADING,
    POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
    POSSIBLY_YOUR_PUBLICATIONS_FAILED,
    COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
} from 'actions';

export const initialState = {
    possibleCounts: 0,
    publicationsList: [],
    loadingSearch: true,
    hidingPublications: false
};

const handlers = {

    [POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            loadingSearch: true,
            publicationsList: []
        };
    },

    [POSSIBLY_YOUR_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: action.payload
        };
    },

    [POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingSearch: false,
            publicationsList: []
        };
    },

    [COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            possibleCounts: action.payload
        };
    }
};

export default function claimPublicationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
