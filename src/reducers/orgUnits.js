import * as actions from 'actions/actionTypes';

export const initialState = {
    orgUnitsListLoading: false,
    orgUnitsListLoadingError: false,
    orgUnitsList: []
};

const handlers = {
    [actions.ORG_UNITS_LOAD_FAILED]: () => ({
        orgUnitsList: [],
        orgUnitsListLoading: false,
        orgUnitsListLoadingError: true
    }),

    [actions.ORG_UNITS_LOADED]: (state, action) => ({
        orgUnitsList: action.payload,
        orgUnitsListLoading: false,
        orgUnitsListLoadingError: false
    }),

    [actions.ORG_UNITS_LOADING]: () => ({
        orgUnitsList: [],
        orgUnitsListLoading: true,
        orgUnitsListLoadingError: false
    })
};

export default function orgUnitsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
