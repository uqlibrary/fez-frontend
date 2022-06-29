import {
    VIEW_COLLECTIONS_LOADING,
    VIEW_COLLECTIONS_LOADED,
    VIEW_COLLECTIONS_LOAD_FAILED,
    VIEW_COLLECTIONS_CLEARED,
    SET_COLLECTIONS_ARRAY,
} from 'actions/actionTypes';

import viewCollectionsReducer from './collections';

const initialState = {
    loadingCollections: true,
    loadingCollectionsPid: 'UQ:123',
    collectionList: [],
    collectionsOpened: [],
};

describe('viewCollections reducer', () => {
    it('sets collection loading state', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            loadingCollections: true,
            loadingCollectionsPid: 'UQ:123',
        };
        const test = viewCollectionsReducer(previousState, {
            type: VIEW_COLLECTIONS_LOADING,
            payload: { pid: 'UQ:123' },
        });
        expect(test).toEqual(expected);
    });

    it('sets collecton loaded state', () => {
        const previousState = {
            ...initialState,
            loadingCommunities: false,
            loadingCollectionsPid: 'UQ:123',
        };
        const expected = {
            collectionList: [
                {
                    pid: 'UQ:1234',
                    per_page: 10,
                    page: 1,
                    current_page: 1,
                    from: 1,
                    to: 10,
                    total: 10,
                    data: [{ item: 'test' }],
                },
            ],
            loadingCollections: false,
            loadingCollectionsPid: null,
            loadingCollectionsError: null,
            currentPage: 1,
            perPage: 10,
            collectionsOpened: [],
        };
        const test = viewCollectionsReducer(previousState, {
            type: VIEW_COLLECTIONS_LOADED,
            payload: {
                pid: 'UQ:1234',
                per_page: 10,
                page: 1,
                current_page: 1,
                from: 1,
                to: 10,
                total: 10,
                data: [{ item: 'test' }],
            },
        });
        expect(test).toEqual(expected);
    });

    it('clears collection array', () => {
        const previousState = {
            ...initialState,
        };
        const expected = {
            ...previousState,
            // collectionList: [],
            loadingCollections: false,
            loadingCollectionsPid: null,
            loadingCollectionsError: null,
            currentPage: 1,
            perPage: 10,
            // collectionsOpened: [],
        };
        const test = viewCollectionsReducer(previousState, {
            type: VIEW_COLLECTIONS_CLEARED,
        });
        expect(test).toEqual(expected);
    });
    it('Sets open collections array', () => {
        const previousState = {
            ...initialState,
            collectionList: ['test'],
            loadingCollections: false,
        };
        const expected = {
            loadingCollections: false,
            loadingCollectionsPid: 'UQ:123',
            collectionList: ['test'],
            collectionsOpened: ['UQ:12345'],
        };
        const test = viewCollectionsReducer(previousState, {
            type: SET_COLLECTIONS_ARRAY,
            payload: { open: true, pid: 'UQ:12345' },
        });
        expect(test).toEqual(expected);
    });
    it('removes from open collections array when item closed', () => {
        const previousState = {
            ...initialState,
            collectionList: ['test'],
            loadingCollections: false,
            collectionsOpened: ['UQ:12345', 'UQ:98765'],
        };
        const expected = {
            loadingCollections: false,
            loadingCollectionsPid: 'UQ:123',
            collectionList: ['test'],
            collectionsOpened: ['UQ:98765'],
        };
        const test = viewCollectionsReducer(previousState, {
            type: SET_COLLECTIONS_ARRAY,
            payload: { open: false, pid: 'UQ:12345' },
        });
        expect(test).toEqual(expected);
    });
    it('correctly handles failed loading', () => {
        const previousState = {
            ...initialState,
            collectionList: ['test'],
            loadingCollections: false,
            collectionsOpened: [],
        };
        const expected = {
            collectionList: [],
            loadingCollections: false,
            loadingCollectionsPid: null,
            loadingCollectionsError: { error: true },
            currentPage: 1,
            perPage: 10,
            collectionsOpened: [],
        };
        const test = viewCollectionsReducer(previousState, {
            type: VIEW_COLLECTIONS_LOAD_FAILED,
            payload: { error: true },
        });
        expect(test).toEqual(expected);
    });
});
