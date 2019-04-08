import * as actions from 'actions/actionTypes';

export const initialState = {
    incompleteRecordList: [],
    loadingIncompleteRecordList: true,
};

const handlers = {

    [actions.INCOMPLETE_RECORD_LOADED]: (state, action) => (
        {
            ...state,
            loadingIncompleteRecordList: false,
            incompleteRecordList: action.payload.data,
        }
    ),

    [actions.INCOMPLETE_RECORD_FAILED]: (state) => (
        {
            ...state,
            loadingIncompleteRecordList: false,
            incompleteRecordList: [],
        }
    ),

    [actions.INCOMPLETE_RECORD_LOADING]: (state) => (
        {
            ...state,
            loadingIncompleteRecordList: true
        }
    ),
};

export default function incompleteRecordReducer(state = {...initialState}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
