import * as actions from 'actions/actionTypes';

export const initState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
};

const handlers = {
    [actions.RELATED_SERVICE_LOOKUP_LOADING]: state => ({
        ...state,
        ...initState,
        itemsLoading: true,
    }),
    [actions.RELATED_SERVICE_LOOKUP_LOADED]: (state, action) => ({
        ...state,
        itemsList: action.payload,
        itemsLoading: false,
    }),
    [actions.RELATED_SERVICE_LOOKUP_FAILED]: state => ({
        ...state,
        itemsList: [],
        itemsLoading: false,
        itemsLoadingError: true,
    }),
};

export default function relatedServicesReducer(state = initState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
