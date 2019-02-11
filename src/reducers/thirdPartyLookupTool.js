import * as actions from 'actions/actionTypes';

export const initialState = {
    lookupResults: [],
    loadingResults: false,
};

const handlers = {
    [actions.THIRD_PARTY_LOOKUP_TOOL_LOADING]: () => (
        {
            ...initialState,
            loadingResults: true,
        }
    ),

    [actions.THIRD_PARTY_LOOKUP_TOOL_SUCCESS]: (state, action) => (
        {
            ...state,
            loadingResults: false,
            lookupResults: action.payload
        }
    ),

    [actions.THIRD_PARTY_LOOKUP_TOOL_LOAD_FAILED]: (state, action) => (
        {
            ...state,
            loadingResults: false,
            lookupResults: action.payload,
        }
    ),

    [actions.THIRD_PARTY_LOOKUP_TOOL_CLEAR]: () => (
        {
            ...initialState,
            lookupResults: []
        }
    )
};

export default function thirdPartyLookupToolReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
