import * as actions from '../actions/actionTypes';

const searchKey = (value) => (value.substring(value.indexOf('@') + 1, value.length));

const handlers = {
    [`${actions.SEARCH_KEY_LOOKUP_LOADING}@`]: (state, action) => {
        return {
            ...state,
            [`${searchKey(action.type)}`]: []
        };
    },
    [`${actions.SEARCH_KEY_LOOKUP_LOADED}@`]: (state, action) => {
        return {
            ...state,
            [`${searchKey(action.type)}`]: action.payload
        };
    },
    [`${actions.SEARCH_KEY_LOOKUP_FAILED}@`]: (state, action) => {
        return {
            ...state,
            [`${searchKey(action.type)}`]: []
        };
    }
};

const searchKeyReducer = (state = {}, action) => {
    const handler = handlers[action.type.substring(0, action.type.indexOf('@') + 1)];

    if (!handler) {
        return state;
    }
    return handler(state, action);
};

export default searchKeyReducer;
