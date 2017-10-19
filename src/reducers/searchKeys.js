import * as actions from '../actions/actionTypes';

const handlers = {
    [`${actions.SEARCH_KEY_LOOKUP_LOADING}@`]: (state, action) => (
        {
            ...state,
            [`${actions.getActionSuffix(action.type)}`]: []
        }
    ),
    [`${actions.SEARCH_KEY_LOOKUP_LOADED}@`]: (state, action) => (
        {
            ...state,
            [`${actions.getActionSuffix(action.type)}`]: action.payload
        }
    ),
    [`${actions.SEARCH_KEY_LOOKUP_FAILED}@`]: (state, action) => (
        {
            ...state,
            [`${actions.getActionSuffix(action.type)}`]: []
        }
    )
};

export default function searchKeyReducer(state = {}, action) {
    const handler = handlers[actions.getAction(action.type)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
}
