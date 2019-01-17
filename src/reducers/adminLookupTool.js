import * as actions from 'actions/actionTypes';

export const initialState = {
    lookupResults: [],
    loadingResults: false,
};

const handlers = {
    [actions.ADMIN_LOOKUP_TOOL_LOADING]: () => (
        {
            ...initialState,
            loadingResults: true,
        }
    ),

    [actions.ADMIN_LOOKUP_TOOL_SUCCESS]: (state, action) => (
        {
            ...initialState,
            loadingResults: false,
            lookupResults: action.payload
        }
    ),

    [actions.ADMIN_LOOKUP_TOOL_LOAD_FAILED]: (state, action) => (
        {
            ...initialState,
            loadingResults: false,
            lookupResults: action.payload,
        }
    ),

    [actions.ADMIN_LOOKUP_TOOL_SET]: (state, action) => (
        {
            ...initialState,
            loadingResults: false,
            lookupResults: action.payload
        }
    ),

    [actions.ADMIN_LOOKUP_TOOL_CLEAR]: () => (
        {
            ...initialState,
            lookupResults: []
        }
    )
};

export default function adminLookupToolReducer(state = initialState, action) {
    console.log('adminLookupToolReducer sees:');
    console.log(action);
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
