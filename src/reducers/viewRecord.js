import * as actions from 'actions/actionTypes';

export const initialState = {
    recordToView: null,
    loadingRecordToView: true,
    recordToViewError: null,
    hideCulturalSensitivityStatement: false,
    isRecordLocked: false,
    isDeleted: false,
    isDeletedVersion: false,
    isJobCreated: false,
    error: null,
};

const handlers = {
    [actions.VIEW_RECORD_LOADING]: state => ({
        ...initialState,
        hideCulturalSensitivityStatement: state.hideCulturalSensitivityStatement,
    }),

    [actions.VIEW_RECORD_LOADED]: (state, action) => ({
        ...initialState,
        loadingRecordToView: false,
        recordToView: action.payload,
        hideCulturalSensitivityStatement: state.hideCulturalSensitivityStatement,
        isRecordLocked: !!action.payload.rek_editing_user,
    }),

    [actions.VIEW_RECORD_VERSION_DELETED_LOADED]: (state, action) => ({
        ...initialState,
        isDeletedVersion: true,
        loadingRecordToView: false,
        recordToView: action.payload,
        hideCulturalSensitivityStatement: state.hideCulturalSensitivityStatement,
        isRecordLocked: !!action.payload.rek_editing_user,
    }),

    [actions.VIEW_RECORD_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingRecordToView: false,
        recordToViewError: action.payload,
        hideCulturalSensitivityStatement: true,
    }),

    [actions.VIEW_RECORD_DELETED]: (state, action) => ({
        ...initialState,
        loadingRecordToView: false,
        recordToView: action.payload,
        hideCulturalSensitivityStatement: true,
        isDeleted: true,
    }),

    [actions.VIEW_RECORD_CLEAR]: state => ({
        ...initialState,
        hideCulturalSensitivityStatement: state.hideCulturalSensitivityStatement,
        isRecordLocked: false,
    }),

    [actions.VIEW_RECORD_CULTURAL_SENSITIVITY_STATEMENT_HIDE]: state => ({
        ...state,
        hideCulturalSensitivityStatement: true,
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
    [actions.DETAILED_HISTORY_LOADING_FAILED]: state => ({
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
