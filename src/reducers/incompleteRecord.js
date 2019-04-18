import * as actions from 'actions/actionTypes';

export const initialState = {
    incompleteRecordList: [],
    loadingIncompleteRecordList: true,
};

const handlers = {

    [actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADED]: (state, action) => (
        {
            ...state,
            loadingIncompleteRecordList: false,
            incompleteRecordList: action.payload.data,
        }
    ),

    [actions.AUTHOR_INCOMPLETEPUBLICATIONS_FAILED]: (state) => (
        {
            ...state,
            loadingIncompleteRecordList: false,
            incompleteRecordList: [],
        }
    ),

    [actions.AUTHOR_INCOMPLETEPUBLICATIONS_LOADING]: (state) => (
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
    console.log(handler);
    return handler(state, action);
}
