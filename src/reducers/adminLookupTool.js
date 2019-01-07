import * as actions from 'actions/actionTypes';

export const initialState = {
    lookupResults: null,
    loadingRecord: true,
    loadingError: null
};

const handlers = {
    [actions.ADMIN_LOOKUP_TOOL_LOADING]: () => (
        {
            ...initialState
        }
    ),

    [actions.ADMIN_LOOKUP_TOOL_SUCCESS]: (state, action) => (
        {
            ...initialState,
            loadingRecord: false,
            lookupResults: action.payload
        }
    ),
    // [actions.VIEW_RECORD_LOADED]: (state, action) => (
    //     {
    //         ...initialState,
    //         loadingRecordToView: false,
    //         recordToView: action.payload,
    //         hideCulturalSensitivityStatement: state.hideCulturalSensitivityStatement
    //     }
    // ),

    [actions.ADMIN_LOOKUP_TOOL_LOAD_FAILED]: (state, action) => (
        {
            ...initialState,
            loadingRecord: false,
            loadingError: action.payload
        }
    ),

    [actions.ADMIN_LOOKUP_TOOL_SET]: (state, action) => (
        {
            ...initialState,
            loadingRecord: false,
            lookupResults: action.payload
        }
    ),

    [actions.ADMIN_LOOKUP_TOOL_CLEAR]: () => (
        {
            ...initialState
        }
    )
};

export default function adminLookupToolReducer(state = {...initialState}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
