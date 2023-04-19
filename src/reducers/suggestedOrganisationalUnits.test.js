import * as actions from 'actions/actionTypes';
import suggestedOrganisationalUnitsReducer, { initialState } from './suggestedOrganisationalUnits';
import { suggestedOrganisationalUnits } from 'mock/data/suggestedOrganisationalUnits';

describe('organisationalUnits reducers', () => {
    it('should return loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expectedState = {
            ...initialState,
            suggestedAuthorId: 1,
            suggestedOrganisationUnitsLoading: true,
        };

        const actualState = suggestedOrganisationalUnitsReducer(previousState, {
            type: actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADING,
            authorId: 1,
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return loaded state', () => {
        const authorId = 1;
        const previousState = {
            ...initialState,
        };
        const expectedOrgs = suggestedOrganisationalUnits.map(item => ({ ...item, suggested: true }));

        const expectedState = {
            ...initialState,
            suggestedAuthorId: authorId,
            suggestedOrganisationUnits: expectedOrgs,
            suggestedOrganisationUnitsLoading: false,
            suggestedOrganisationUnitsLoaded: true,
        };

        const actualState = suggestedOrganisationalUnitsReducer(previousState, {
            type: actions.SUGGESTED_ORGANISATIONAL_UNITS_LOADED,
            payload: { data: suggestedOrganisationalUnits },
            authorId: 1,
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return error state', () => {
        const previousState = {
            ...initialState,
        };
        const expectedState = {
            ...initialState,
            suggestedOrganisationUnitsFailed: true,
        };

        const actualState = suggestedOrganisationalUnitsReducer(previousState, {
            type: actions.SUGGESTED_ORGANISATIONAL_UNITS_FAILED,
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return cleared state', () => {
        const previousState = {
            ...initialState,
            suggestedOrganisationUnitsFailed: true,
        };
        const expectedState = {
            ...initialState,
        };

        const actualState = suggestedOrganisationalUnitsReducer(previousState, {
            type: actions.SUGGESTED_ORGANISATIONAL_UNITS_CLEARED,
        });
        expect(actualState).toEqual(expectedState);
    });
});
