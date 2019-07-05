import * as actions from 'actions/actionTypes';
import communitiesReducer from './searchCommunities';

describe('searchCollections reducer', () => {
    const initState = {
        itemsList: [],
        itemsLoading: false,
        itemsLoadingError: false,
    };

    it('is setting the "items loading" status', () => {
        const result = communitiesReducer({}, { type: actions.SEARCH_COMMUNITIES_LOADING });
        expect(result.itemsLoading).toBe(true);
        expect(result).toEqual({ ...initState, itemsLoading: true });
    });

    it('is saving the payload', () => {
        const testPayload = ['test1', 'test2', 'test3'];
        const result = communitiesReducer({}, { type: actions.SEARCH_COMMUNITIES_LOADED, payload: testPayload });
        expect(result.itemsList).toBeInstanceOf(Array);
        expect(result.itemsList.length).toEqual(3);
        expect(result).toEqual({ ...initState, itemsList: testPayload });
    });

    it('is setting the "loading error" status', () => {
        const result = communitiesReducer({}, { type: actions.SEARCH_COMMUNITIES_FAILED });
        expect(result.itemsLoadingError).toBe(true);
        expect(result).toEqual({ ...initState, itemsLoadingError: true });
    });
});
