import * as actions from 'actions/actionTypes';
import organisationalUnitsReducer, { initialState } from './organisationalUnits';
import { organisationalUnits } from 'mock/data/organisationalUnits';

describe('organisationalUnits reducers', () => {
    it('should return loading state', () => {
        const previousState = {
            organisationUnitsLoading: false,
        };
        const expectedState = {
            ...initialState,
            organisationUnitsLoading: true,
        };

        const actualState = organisationalUnitsReducer(previousState, { type: actions.ORGANISATIONAL_UNITS_LOADING });
        expect(actualState).toEqual(expectedState);
    });

    it('should return loaded state', () => {
        const previousState = {
            ...initialState,
        };
        const expectedState = {
            ...initialState,
            organisationUnits: organisationalUnits,
            organisationUnitsLoading: false,
            organisationUnitsLoaded: true,
        };

        const actualState = organisationalUnitsReducer(previousState, {
            type: actions.ORGANISATIONAL_UNITS_LOADED,
            payload: { data: organisationalUnits },
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return error state', () => {
        const previousState = {
            ...initialState,
        };
        const expectedState = {
            ...initialState,
            organisationUnitsFailed: true,
        };

        const actualState = organisationalUnitsReducer(previousState, { type: actions.ORGANISATIONAL_UNITS_FAILED });
        expect(actualState).toEqual(expectedState);
    });
});
