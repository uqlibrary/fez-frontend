import * as actions from 'actions/actionTypes';

const initState = {
    itemsList: [],
    itemsLoading: true,
    itemsLoadingError: false,
};

const handlers = {
    [actions.SEARCH_COMMUNITIES_LOADING]: state => ({
        ...state,
        itemsList: [],
        itemsLoading: true,
        itemsLoadingError: false,
    }),
    [actions.SEARCH_COMMUNITIES_LOADED]: (state, action) => ({
        ...state,
        itemsList: action.payload,
        itemsLoading: false,
        itemsLoadingError: false,
    }),
    [actions.SEARCH_COMMUNITIES_FAILED]: state => ({
        ...state,
        itemsList: [],
        itemsLoading: false,
        itemsLoadingError: true,
    }),
};

export default function communitiesReducer(state = initState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
