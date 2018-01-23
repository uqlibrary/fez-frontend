import * as actions from 'actions/actionTypes';

export const initialState = {
    publicationToClaim: null,
    publicationToClaimFileUploadingError: false,
    possibleCounts: 0,
    possiblePublicationsPagingData: {},
    possiblePublicationsList: [],
    possiblePublicationsFacets: {},
    loadingPossiblePublicationsList: true,
    loadingPossibleCounts: true,
    publicationsClaimedInProgress: []
};

const handlers = {

    [actions.POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => (
        {
            ...state,
            loadingPossiblePublicationsList: true,
            possiblePublicationsList: [],
            possiblePublicationsFacets: {},
            possiblePublicationsPagingData: {}
        }
    ),

    [actions.PUBLICATION_TO_CLAIM_SET]: (state, action) => (
        {
            ...state,
            publicationToClaimFileUploadingError: false,
            publicationToClaim: action.payload
        }
    ),

    [actions.PUBLICATION_TO_CLAIM_CLEAR]: (state) => (
        {
            ...state,
            publicationToClaimFileUploadingError: false,
            publicationToClaim: null
        }
    ),

    [actions.POSSIBLY_YOUR_PUBLICATIONS_LOADED]: (state, action) => (
        {
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
        }
    ),

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FACETS_LOADED]: (state, action) => (
        {
            ...state,
            possiblePublicationsFacets: action.payload
        }
    ),

    [actions.POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => (
        {
            ...state,
            loadingPossiblePublicationsList: false,
            possiblePublicationsList: [],
            loadingPossibleCounts: false,
            possibleCounts: 0,
            possiblePublicationsPagingData: {}
        }
    ),

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADING]: (state) => (
        {
            ...state,
            loadingPossibleCounts: true
        }
    ),

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_LOADED]: (state, action) => (
        {
            ...state,
            loadingPossibleCounts: false,
            possibleCounts: action.payload.total
        }
    ),

    [actions.COUNT_POSSIBLY_YOUR_PUBLICATIONS_FAILED]: (state) => (
        {
            ...state,
            loadingPossibleCounts: false,
            possibleCounts: 0
        }
    ),

    [actions.HIDE_PUBLICATIONS_LOADED]: (state, action) => (
        {
            ...state,
            publicationsClaimedInProgress: [...state.publicationsClaimedInProgress, action.payload.pid]
        }
    ),

    [actions.CLAIM_PUBLICATION_CREATE_COMPLETED]: (state, action) => (
        {
            ...state,
            publicationToClaimFileUploadingError: !!action.payload.fileUploadFailed,
            publicationsClaimedInProgress: [...state.publicationsClaimedInProgress, action.payload.pid]
        }
    )
};

export default function claimPublicationReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
