import * as actions from 'actions/actionTypes';

export const initialState = {
    recordToView: null,
    loadingRecordToView: true,
    recordToViewError: null,
    isRecordLocked: false,
    isDeleted: false,
    isDeletedVersion: false,
    isJobCreated: false,
    error: null,
};

const handlers = {
    [actions.VIEW_RECORD_LOADING]: () => ({
        ...initialState,
    }),

    [actions.VIEW_RECORD_LOADED]: (state, action) => {
        return {
            ...initialState,
            loadingRecordToView: false,
            recordToView: action.payload,
            isRecordLocked: !!action.payload.rek_editing_user,
        };
    },

    [actions.VIEW_RECORD_VERSION_DELETED_LOADED]: (state, action) => ({
        ...initialState,
        isDeletedVersion: true,
        loadingRecordToView: false,
        recordToView: action.payload,
        isRecordLocked: !!action.payload.rek_editing_user,
    }),

    [actions.VIEW_RECORD_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingRecordToView: false,
        recordToViewError: action.payload,
    }),

    [actions.VIEW_RECORD_DELETED_LOADED]: (state, action) => ({
        ...initialState,
        loadingRecordToView: false,
        recordToView: action.payload,
        isDeleted: true,
    }),

    [actions.VIEW_RECORD_CLEAR]: () => ({
        ...initialState,
        isRecordLocked: false,
    }),

    [actions.VIEW_RECORD_UNLOCK]: state => ({
        ...state,
        isRecordLocked: false,
    }),

    [actions.ADMIN_UPDATE_WORK_JOB_CREATED]: state => ({
        ...state,
        isJobCreated: true,
    }),

    [actions.ADMIN_UPDATE_WORK_FAILED]: (state, action) => ({
        ...state,
        error: action.payload,
    }),

    [actions.DETAILED_HISTORY_LOADING]: state => ({
        ...state,
        isLoadingDetailedHistory: true,
    }),
    [actions.DETAILED_HISTORY_LOADING_SUCCESS]: (state, action) => ({
        ...state,
        isLoadingDetailedHistory: false,
        recordDetailedHistory: action.payload,
    }),
    [actions.DETAILED_HISTORY_LOADING_FAILED]: /* c8 ignore next */ state => /* c8 ignore next */ ({
        ...state,
        isLoadingDetailedHistory: false,
    }),
};

export default function viewRecordReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
