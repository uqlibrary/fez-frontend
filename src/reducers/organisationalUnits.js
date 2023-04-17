import * as actions from 'actions/actionTypes';

export const initialState = {
    organisationUnits: [],
    organisationUnitsLoaded: false,
    organisationUnitsLoading: false,
    organisationUnitsFailed: false,
};

const handlers = {
    [actions.ORGANISATIONAL_UNITS_LOADING]: () => ({
        ...initialState,
        organisationUnits: [],
        organisationUnitsLoaded: false,
        organisationUnitsLoading: true,
        organisationUnitsFailed: false,
    }),

    [actions.ORGANISATIONAL_UNITS_LOADED]: (state, action) => ({
        ...initialState,
        organisationUnits: action.payload.data,
        organisationUnitsLoaded: true,
        organisationUnitsLoading: false,
        organisationUnitsFailed: false,
    }),

    [actions.ORGANISATIONAL_UNITS_FAILED]: () => ({
        ...initialState,
        organisationUnits: [],
        organisationUnitsLoaded: false,
        organisationUnitsLoading: false,
        organisationUnitsFailed: true,
    }),
};

export default function organisationalUnitsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
