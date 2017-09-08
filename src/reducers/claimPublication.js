import * as actions from 'actions/claimPublications';

export const initialState = {
    publicationToClaim: null,
    possibleCounts: null,
    possiblePublicationsList: [],
    loadingPossiblePublicationsList: true,
    loadingPossibleCounts: true,
    facetsData: {},
    loadingFacetsData: true,
    activeFacets: null
};

const handlers = {

    [actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state, action) => {
        return {
            ...state,
            loadingPossiblePublicationsList: true,
            possiblePublicationsList: [],
            facetsData: {},
            loadingFacetsData: true,
            activeFacets: action.payload
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
        return {
            ...state,
            loadingPossiblePublicationsList: false,
            possiblePublicationsList: action.payload,
        };
    },

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED]: (state, action) => {
        return {
            ...state,
            facetsData: action.payload,
            loadingFacetsData: false
        };
    },

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingPossiblePublicationsList: false,
            possiblePublicationsList: [],
            loadingPossibleCounts: false,
            possibleCounts: null,
            facetsData: {},
            loadingFacetsData: false
        };
    },

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            loadingPossibleCounts: true,
            possibleCounts: null
        };
    },

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            loadingPossibleCounts: false,
            possibleCounts: action.payload
        };
    },

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingPossibleCounts: false,
            possibleCounts: null
        };
    }

};

export default function claimPublicationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    console.log(action);
    return handler(state, action);
}
