import * as actions from 'actions/actionTypes';
import collectionsReducer from './searchCollections';

describe('searchCollections reducer', () => {
    const initState = {
        itemsList: [],
        itemsLoading: false,
        itemsLoadingError: false,
    };

    it('is setting the "items loading" status', () => {
        const result = collectionsReducer({}, { type: actions.SEARCH_COLLECTION_LOADING });
        expect(result.itemsLoading).toBe(true);
        expect(result).toEqual({ ...initState, itemsLoading: true });
    });

    it('is saving the payload', () => {
        const testPayload = ['test1', 'test2', 'test3'];
        const result = collectionsReducer({}, { type: actions.SEARCH_COLLECTION_LOADED, payload: testPayload });
        expect(result.itemsList).toBeInstanceOf(Array);
        expect(result.itemsList.length).toEqual(3);
        expect(result).toEqual({ ...initState, itemsList: testPayload });
    });

    it('is setting the "loading error" status', () => {
        const result = collectionsReducer({}, { type: actions.SEARCH_COLLECTION_FAILED });
        expect(result.itemsLoadingError).toBe(true);
        expect(result).toEqual({ ...initState, itemsLoadingError: true });
    });
});
