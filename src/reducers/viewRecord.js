import * as actions from 'actions/actionTypes';

export const initialState = {
    recordToView: null,
    loadingRecordToView: true,
    recordToViewError: null,
    hideCulturalSensitivityStatement: false,
    isRecordLocked: false,
    isDeleted: false,
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
};

export default function viewRecordReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
