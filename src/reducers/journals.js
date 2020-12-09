import * as actions from 'actions/actionTypes';

const initState = {
    itemsList: [],
    itemsLoading: false,
    itemsLoadingError: false,
};

const handlers = {
    [actions.JOURNAL_LOOKUP_LOADING]: () => ({
        ...initState,
        itemsLoading: true,
    }),
    [actions.JOURNAL_LOOKUP_LOADED]: (state, action) => ({
        ...initState,
        itemsList: action.payload,
    }),
    [actions.JOURNAL_LOOKUP_FAILED]: () => ({
        ...initState,
        itemsLoadingError: true,
    }),
};

export default function journalReducer(state = {}, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
