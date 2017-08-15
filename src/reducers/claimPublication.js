import * as actions from 'actions/claimPublications';

export const initialState = {
    publicationToClaim: null,
    possibleCounts: null,
    publicationsList: [],
    loadingPublications: true
};

const handlers = {

    [actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            loadingPublications: true,
            publicationsList: []
        };
    },

    [actions.PUBLICATION_TO_CLAIM_SET]: (state, action) => {
        return {
            ...state,
            publicationToClaim: action.payload
        };
    },

    [actions.PUBLICATION_TO_CLAIM_CLEAR]: (state) => {
        return {
            ...state,
            publicationToClaim: null
        };
    },

    [actions.POSSIBLY_YOUR_PUBLICATIONS_COMPLETED]: (state, action) => {
        console.log(action);
        return {
            ...state,
            loadingPublications: false,
            publicationsList: action.payload
        };
    },

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingPublications: false,
            publicationsList: []
        };
    },

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED]: (state, action) => {
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
