import * as actions from 'actions/actionTypes';

export const initialState = {
    suggestedOrganisationUnits: [],
    suggestedOrganisationUnitsLoading: false,
    suggestedOrganisationUnitsFailed: false,
};

const handlers = {
    [actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADING]: () => ({
        ...initialState,
        suggestedOrganisationUnits: [],
        suggestedOrganisationUnitsLoading: true,
        suggestedOrganisationUnitsFailed: false,
    }),

    [actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADED]: (state, action) => ({
        ...initialState,
        suggestedOrganisationUnits: action.payload,
        suggestedOrganisationUnitsLoading: false,
        suggestedOrganisationUnitsFailed: false,
    }),

    [actions.SUGGESTED_ORGANISATIONAL_UNITS_FAILED]: () => ({
        ...initialState,
        suggestedOrganisationUnits: [],
        suggestedOrganisationUnitsLoading: false,
        suggestedOrganisationUnitsFailed: true,
    }),

    [actions.SUGGESTED_ORGANISATIONAL_UNITS_CLEARED]: () => ({
        ...initialState,
        suggestedOrganisationUnits: [],
    }),
};

export default function suggestedOrganisationalUnitsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
