import {
    FEEDBACK_RECORD_LOADING,
    FEEDBACK_RECORD_LOADED,
    FEEDBACK_RECORD_LOAD_FAILED,
    FEEDBACK_RECORD_CLEAR,
} from 'actions/actionTypes';

export const initialState = {
    recordToFeedback: null,
    loadingRecordToFeedback: true,
    recordToFeedbackError: null,
};

const handlers = {
    [FEEDBACK_RECORD_LOADING]: () => ({
        ...initialState,
    }),

    [FEEDBACK_RECORD_LOADED]: (state, action) => ({
        ...initialState,
        loadingRecordToFeedback: false,
        recordToFeedback: action.payload,
    }),

    [FEEDBACK_RECORD_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingRecordToFeedback: false,
        recordToFeedbackError: action.payload,
    }),

    [FEEDBACK_RECORD_CLEAR]: () => ({
        ...initialState,
    }),
};

export default function feedbackRecordReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
