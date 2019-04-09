import * as actions from 'actions/actionTypes';

export const initialState = {
    newRecord: null,
    newCollectionSaving: false,
    newCollectionError: false,
    newCollectionErrorMessage: null
};

const handlers = {

    [actions.CREATE_COLLECTION_SUCCESS]: (state, action) => (
        {
            ...initialState,
            newRecord: action.payload,
            newCollectionSaving: false,
            newCollectionError: false
        }
    ),

    [actions.CREATE_COLLECTION_FAILED]: (state, action) => (
        {
            ...initialState,
            newCollectionSaving: false,
            newCollectionError: true,
            newCollectionErrorMessage: action.payload
        }
    ),

    [actions.CREATE_COLLECTION_SAVING]: () => (
        {
            ...initialState,
            newCollectionSaving: true,
            newCollectionError: false
        }
    )
};

export default function createCollectionReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
