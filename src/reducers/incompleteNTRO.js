import * as actions from 'actions/actionTypes';

export const initialState = {
    incompleteNTROList: [],
    loadingIncompleteNTROList: true,
};

const handlers = {

    [actions.INCOMPLETE_NTRO_LOADED]: (state, action) => (
        {
            ...state,
            loadingIncompleteNTROList: false,
            incompleteNTROList: action.payload.data,
        }
    ),

    [actions.INCOMPLETE_NTRO_FAILED]: (state) => (
        {
            ...state,
            loadingIncompleteNTROList: false,
            incompleteNTROList: [],
        }
    ),

    [actions.INCOMPLETE_NTRO_LOADING]: (state) => (
        {
            ...state,
            loadingIncompleteNTROList: true
        }
    ),
};

export default function incompleteNTROReducer(state = {...initialState}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
