import * as actions from 'actions/actionTypes';

export const initialState = {
    incompleteRecordList: [],
    loadingIncompleteRecordList: true,
};

const handlers = {

    [actions.INCOMPLETE_RECORDS_LOADED]: (state, action) => (
        {
            ...state,
            loadingIncompleteRecordList: false,
            incompleteRecordList: action.payload.data,
        }
    ),

    [actions.INCOMPLETE_RECORDS_FAILED]: (state) => (
        {
            ...state,
            loadingIncompleteRecordList: false,
            incompleteRecordList: [],
        }
    ),

    [actions.INCOMPLETE_RECORDS_LOADING]: (state) => (
        {
            ...state,
            loadingIncompleteRecordList: true
        }
    ),
};

export default function incompleteRecordReducer(state = {...initialState}, action) {
    console.log('incompleteRecordReducer action = ', action);
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
