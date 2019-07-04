import * as actions from 'actions/actionTypes';
import searchKeysReducer from './searchKeys';

describe('searchKeys reducer', () => {
    const initialState = { someValue: ['Just', 'Some', 'Initial', 'State', 'Values'] };
    const someItems = [
        'UQ Business School',
        'UQ Diamantina Institute',
        'Archaeological Services Unit',
        'Unknown',
        'University of Queensland Diamantina Institute',
        'University of Vermont, Burlington',
        'Aboriginal and Torres Strait Islander Studies Unit',
    ];

    it('is returning expected values while loading data', () => {
        const test = searchKeysReducer(initialState, { type: `${actions.SEARCH_KEY_LOOKUP_LOADING}@org_unit` });
        expect(test.org_unit.itemsLoading).toBeTruthy();
        expect(test.org_unit.itemsLoadingError).toBeFalsy();
        expect(test).toEqual({
            ...initialState,
            org_unit: { itemsList: [], itemsLoading: true, itemsLoadingError: false },
        });
    });

    it('is returning expected values when data loaded', () => {
        const test = searchKeysReducer(initialState, {
            type: `${actions.SEARCH_KEY_LOOKUP_LOADED}@org_unit`,
            payload: someItems,
        });
        expect(test.org_unit.itemsLoading).toBeFalsy();
        expect(test.org_unit.itemsLoadingError).toBeFalsy();
        expect(test).toEqual({
            ...initialState,
            org_unit: { itemsLoading: false, itemsLoadingError: false, itemsList: someItems },
        });
    });

    it('is returning expected values when it fails to load data', () => {
        const test = searchKeysReducer(initialState, { type: `${actions.SEARCH_KEY_LOOKUP_FAILED}@org_unit` });
        expect(test.org_unit.itemsLoading).toBeFalsy();
        expect(test.org_unit.itemsLoadingError).toBeTruthy();
        expect(test).toEqual({
            ...initialState,
            org_unit: { itemsList: [], itemsLoading: false, itemsLoadingError: true },
        });
    });

    it('returns the initialState when an invalid action type is supplied', () => {
        const test = searchKeysReducer(initialState, { type: 'INVALID_ACTION_TYPE' });
        expect(test).toEqual(initialState);
    });
});
