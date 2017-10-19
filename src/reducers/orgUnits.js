import * as actions from 'actions/actionTypes';

export const initialState = {
    itemsListLoading: false,
    itemsListLoadingError: false,
    itemsList: []
};

const handlers = {
    [actions.ORG_UNITS_LOAD_FAILED]: () => ({
        ...initialState,
        itemsListLoadingError: true
    }),

    [actions.ORG_UNITS_LOADED]: (state, action) => ({
        ...initialState,
        itemsList: action.payload
    }),

    [actions.ORG_UNITS_LOADING]: () => ({
        ...initialState,
        itemsListLoading: true
    })
};

export default function orgUnitsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
