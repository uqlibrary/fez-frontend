import * as actions from 'actions/actionTypes';

export const initialState = {
    organisationUnits: [],
    organisationUnitsLoading: false,
    organisationUnitsFailed: false,
};

const handlers = {
    [actions.ORGANISATIONAL_UNITS_LOADING]: () => ({
        ...initialState,
        organisationUnits: [],
        organisationUnitsLoading: true,
        organisationUnitsFailed: false,
    }),

    [actions.ORGANISATIONAL_UNITS_LOADED]: (state, action) => ({
        ...initialState,
        organisationUnits: action.payload,
        organisationUnitsLoading: false,
        organisationUnitsFailed: false,
    }),

    [actions.ORGANISATIONAL_UNITS_FAILED]: () => ({
        ...initialState,
        organisationUnits: [],
        organisationUnitsLoading: false,
        organisationUnitsFailed: true,
    }),

    // [actions.ORGANISATIONAL_UNITS_CLEARED]: () => ({
    //     ...initialState,
    //     organisationUnits: [],
    // }),
};

export default function organisationalUnitsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
