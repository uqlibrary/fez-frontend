import * as actions from 'actions/actionTypes';

export const initialState = {
    newRecord: null,
    newRecordSaving: false,
    newRecordError: false,
    newRecordErrorMessage: null,
    newRecordFileUploadingError: false
};

const handlers = {
    [actions.RECORD_CREATE_RESET]: () => (
        {
            ...initialState
        }
    ),

    [actions.RECORD_CREATE_SUCCESS]: (state, action) => (
        {
            ...initialState,
            newRecord: action.payload,
            newRecordFileUploadingError: !!action.payload.fileUploadFailed
        }
    ),

    [actions.RECORD_CREATE_FAILED]: (state, action) => (
        {
            ...initialState,
            newRecordError: true,
            newRecordErrorMessage: action.payload
        }
    ),

    [actions.RECORD_CREATE_SAVING]: () => (
        {
            ...initialState,
            newRecordSaving: true
        }
    )
};

export default function createRecordReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
