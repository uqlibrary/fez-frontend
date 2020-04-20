import * as actions from 'actions/actionTypes';

export const initialState = {
    newRecord: null,
    newRecordSaving: false,
    newRecordError: false,
    newRecordErrorMessage: null,
    newRecordFileUploadingOrIssueError: false,
};

const handlers = {
    [actions.ADMIN_CREATE_RECORD_RESET]: () => ({
        ...initialState,
    }),

    [actions.ADMIN_CREATE_RECORD_SUCCESS]: (state, action) => {
        return {
            ...initialState,
            newRecord: action.payload.newRecord,
            newRecordFileUploadingOrIssueError: !!action.payload.fileUploadOrIssueFailed,
        };
    },

    [actions.ADMIN_CREATE_RECORD_FAILED]: (state, action) => ({
        ...initialState,
        newRecordError: true,
        newRecordErrorMessage: action.payload,
    }),

    [actions.ADMIN_CREATE_RECORD_SAVING]: () => {
        return {
            ...initialState,
            newRecordSaving: true,
        };
    },
};

export default function createAdminRecordReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
