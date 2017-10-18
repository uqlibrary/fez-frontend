import React from 'react';
import orgUnitsReducer from './orgUnits';
import * as actions from 'actions/actionTypes';

const initialState = {
    itemsListLoading: false,
    itemsListLoadingError: false,
    itemsList: []
};

describe('OrgUnits reducer ', () => {
    it('should return initial state', () => {
        expect(orgUnitsReducer(undefined, {})).toEqual(initialState);
    });

    it('should return loading state', () => {
        expect(orgUnitsReducer(undefined, {type: actions.ORG_UNITS_LOADING})).toEqual({...initialState, itemsListLoading: true});
    });

    it('should return failed state', () => {
        expect(orgUnitsReducer(undefined, {type: actions.ORG_UNITS_LOAD_FAILED})).toEqual({...initialState, itemsListLoadingError: true});
    });

    it('should return loaded state', () => {
        const testValues = ['one', 'two'];
        expect(orgUnitsReducer(undefined, {type: actions.ORG_UNITS_LOADED, payload: testValues})).toEqual({...initialState, itemsList: testValues});
    });

});
