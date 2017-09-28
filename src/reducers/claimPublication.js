import * as actions from 'actions/actionTypes';

export const initialState = {
    publicationToClaim: null,
    possibleCounts: 0,
    possiblePublicationsPagingData: {},
    possiblePublicationsList: [],
    possiblePublicationsFacets: {},
    loadingPossiblePublicationsList: true,
    loadingPossibleCounts: true,
};

const handlers = {

    [actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            loadingPossiblePublicationsList: true,
            possiblePublicationsList: [],
            possiblePublicationsFacets: {},
            possiblePublicationsPagingData: {}
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
            possiblePublicationsList: action.payload.data,
            possiblePublicationsPagingData: {
                total: action.payload.total,
                current_page: action.payload.current_page,
                from: action.payload.from,
                to: action.payload.to,
                per_page: action.payload.per_page
            },
        };
    },

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_COMPLETED]: (state, action) => {
        return {
            ...state,
            possiblePublicationsFacets: action.payload
        };
    },

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingPossiblePublicationsList: false,
            possiblePublicationsList: [],
            loadingPossibleCounts: false,
            possibleCounts: 0,
            possiblePublicationsPagingData: {}
        };
    },

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => {
        return {
            ...state,
            loadingPossibleCounts: true,
            possibleCounts: 0
        };
    },

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_COMPLETED]: (state, action) => {
        return {
            ...state,
            loadingPossibleCounts: false,
            possibleCounts: action.payload.total
        };
    },

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => {
        return {
            ...state,
            loadingPossibleCounts: false,
            possibleCounts: 0
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
