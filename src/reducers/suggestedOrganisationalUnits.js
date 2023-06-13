import * as actions from 'actions/actionTypes';

export const initialState = {
    suggestedAuthorId: null,
    suggestedOrganisationUnits: [],
    suggestedOrganisationUnitsLoaded: false,
    suggestedOrganisationUnitsLoading: false,
    suggestedOrganisationUnitsFailed: false,
};

const handlers = {
    [actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADING]: (state, action) => ({
        ...initialState,
        suggestedAuthorId: action.authorId,
        suggestedOrganisationUnits: [],
        suggestedOrganisationUnitsLoaded: false,
        suggestedOrganisationUnitsLoading: true,
        suggestedOrganisationUnitsFailed: false,
    }),

    [actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADED]: (state, action) => ({
        ...initialState,
        suggestedAuthorId: action.authorId,
        suggestedOrganisationUnitsLoaded: true,
        suggestedOrganisationUnits: action.payload.data.map(item => ({
            ...item,
            suggested: true,
        })),
        suggestedOrganisationUnitsLoading: false,
        suggestedOrganisationUnitsFailed: false,
    }),

    [actions.SUGGESTED_ORGANISATIONAL_UNITS_FAILED]: () => ({
        ...initialState,
        suggestedAuthorId: null,
        suggestedOrganisationUnits: [],
        suggestedOrganisationUnitsLoaded: false,
        suggestedOrganisationUnitsLoading: false,
        suggestedOrganisationUnitsFailed: true,
    }),

    [actions.SUGGESTED_ORGANISATIONAL_UNITS_CLEARED]: () => ({
        ...initialState,
        suggestedAuthorId: null,
        suggestedOrganisationUnits: [],
        suggestedOrganisationUnitsLoaded: false,
        suggestedOrganisationUnitsLoading: false,
        suggestedOrganisationUnitsFailed: false,
    }),
};

export default function suggestedOrganisationalUnitsReducer(state = initialState, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
