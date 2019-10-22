import * as actions from 'actions/actionTypes';

export const initialState = {
    newRecord: null,
    newRecordSaving: false,
    newRecordError: false,
    newRecordErrorMessage: null,
    newRecordFileUploadingOrIssueError: false,
};

const handlers = {
    // [actions.CREATE_ADMIN_RECORD_RESET]: () => ({
    //     ...initialState,
    // }),

    [actions.CREATE_ADMIN_RECORD_SUCCESS]: (state, action) => ({
        ...initialState,
        newRecord: action.payload.newRecord,
        newRecordFileUploadingOrIssueError: !!action.payload.fileUploadOrIssueFailed,
    }),

    [actions.CREATE_ADMIN_RECORD_FAILED]: (state, action) => ({
        ...initialState,
        newRecordError: true,
        newRecordErrorMessage: action.payload,
    }),

    [actions.CREATE_ADMIN_RECORD_SAVING]: () => ({
        ...initialState,
        newRecordSaving: true,
    }),
};

export default function createAdminRecordReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
