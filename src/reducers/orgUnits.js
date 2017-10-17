import * as actions from 'actions/actionTypes';

export const initialState = {
    orgUnitsListLoading: false,
    orgUnitsListLoadingError: false,
    orgUnitsList: []
};

const handlers = {
    [actions.ORG_UNITS_LOAD_FAILED]: () => ({
        ...initialState,
        orgUnitsListLoadingError: true
    }),

    [actions.ORG_UNITS_LOADED]: (state, action) => ({
        ...initialState,
        orgUnitsList: action.payload
    }),

    [actions.ORG_UNITS_LOADING]: () => ({
        ...initialState,
        orgUnitsListLoading: true
    })
};

export default function orgUnitsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
