import * as actions from '../actions/actionTypes';

export const initialState = {
    communityCollectionsList: [],
    communityCollectionsLoading: false,
    communityCollectionsLoadingError: false,
};

const handlers = {
    [actions.COLLECTION_LIST_LOADING]: (state) => (
        {
            ...state,
            communityCollectionsList: [],
            communityCollectionsLoading: true,
            communityCollectionsLoadingError: false,
        }
    ),
    [actions.COLLECTION_LIST_LOADED]: (state, action) => (
        {
            ...state,
            communityCollectionsList: action.payload,
            communityCollectionsLoading: false,
            communityCollectionsLoadingError: false,
        }
    ),
    [actions.COLLECTION_LIST_FAILED]: (state) => (
        {
            ...state,
            communityCollectionsList: [],
            communityCollectionsLoading: false,
            communityCollectionsLoadingError: true,
        }
    ),
};

export default function digiTeamBatchImportReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
