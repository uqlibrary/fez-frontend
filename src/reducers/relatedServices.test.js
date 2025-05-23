import * as actions from 'actions/actionTypes';
import relatedServicesReducer, { initState } from './relatedServices';
import { rorLookup } from 'mock/data/ror';

describe('relatedService reducers', () => {
    it('should return loading state', () => {
        const previousState = {
            ...initState,
        };
        const expectedState = {
            ...initState,
            itemsLoading: true,
        };

        const actualState = relatedServicesReducer(previousState, {
            type: actions.RELATED_SERVICE_LOOKUP_LOADING,
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return loaded state', () => {
        const previousState = {
            ...initState,
        };

        const expectedState = {
            ...initState,
            itemsList: rorLookup.data,
            itemsLoading: false,
        };

        const actualState = relatedServicesReducer(previousState, {
            type: actions.RELATED_SERVICE_LOOKUP_LOADED,
            payload: rorLookup.data,
        });
        expect(actualState).toEqual(expectedState);
    });

    it('should return error state', () => {
        const previousState = {
            ...initState,
        };
        const expectedState = {
            ...initState,
            itemsLoadingError: true,
        };

        const actualState = relatedServicesReducer(previousState, {
            type: actions.RELATED_SERVICE_LOOKUP_FAILED,
        });
        expect(actualState).toEqual(expectedState);
    });
});
