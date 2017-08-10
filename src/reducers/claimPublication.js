import {
    POSSIBLY_YOUR_PUBLICATIONS_LOADING,
    POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
    POSSIBLY_YOUR_PUBLICATIONS_FAILED,
    COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED,
    PUBLICATION_TO_CLAIM_SET,
    PUBLICATION_TO_CLAIM_CLEAR
} from 'actions';

export const initialState = {
    publicationToClaim: null,
    possibleCounts: null,
    publicationsList: [],
    loadingPublications: true
};

const handlers = {

    [POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            loadingPublications: true,
            publicationsList: []
        };
    },

    [PUBLICATION_TO_CLAIM_SET]: (state, action) => {
        return {
            ...state,
            publicationToClaim: action.payload
        };
    },

    [PUBLICATION_TO_CLAIM_CLEAR]: (state) => {
        return {
            ...state,
            publicationToClaim: null
        };
    },

    [POSSIBLY_YOUR_PUBLICATIONS_COMPLETED]: (state, action) => {
        console.log(action);
        return {
            ...state,
            loadingPublications: false,
            publicationsList: action.payload
        };
    },

    [POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingPublications: false,
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
