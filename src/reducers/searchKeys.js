import * as actions from 'actions/actionTypes';

const initState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
};

const handlers = {
    [`${actions.SEARCH_KEY_LOOKUP_LOADING}@`]: (state, action) => ({
        ...state,
        [`${actions.getActionSuffix(action.type)}`]: {
            ...initState,
            itemsLoading: true,
        },
    }),
    [`${actions.SEARCH_KEY_LOOKUP_LOADED}@`]: (state, action) => ({
        ...state,
        [`${actions.getActionSuffix(action.type)}`]: {
            ...initState,
            itemsList: action.payload,
        },
    }),
    [`${actions.SEARCH_KEY_LOOKUP_FAILED}@`]: (state, action) => ({
        ...state,
        [`${actions.getActionSuffix(action.type)}`]: {
            ...initState,
            itemsLoadingError: true,
        },
    }),
};

export default function searchKeysReducer(state = {}, action) {
    const handler = handlers[actions.getAction(action.type)];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
