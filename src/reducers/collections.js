import * as actions from 'actions/actionTypes';
// import { record } from 'mock/data';

export const initialState = {
    collectionList: [],
    loadingCollections: false,
    loadingCollectionsError: null,
    totalRecords: 0,
    startRecord: 0,
    endRecord: 0,
    currentPage: 1,
    perPage: 10,
};

const handlers = {
    [actions.VIEW_COLLECTIONS_LOADING]: state => ({
        // collectionList: [...state.collectionList],
        loadingCollections: true,
        collectionList: state.collectionList,
    }),

    [actions.VIEW_COLLECTIONS_LOADED]: (state, action) => {
        const uniqueValues = new Set();
        const collectionList = [...state.collectionList, action.payload];
        // Latest addition is always the last element of the list - reverse so it remains the primary for duplicates.
        collectionList.reverse();
        const filteredList = collectionList.filter(obj => {
            const isPresent = uniqueValues.has(obj.parent);
            uniqueValues.add(obj.parent);
            return !isPresent;
        });
        return {
            ...initialState,
            collectionList: [...filteredList],
            loadingCollections: false,
        };
    },

    [actions.VIEW_COLLECTIONS_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingCollections: false,
        loadingCollectionsError: action.payload,
    }),
    [actions.VIEW_COLLECTIONS_CLEARED]: state => ({
        ...initialState,
        collectionList: state.collectionList,
        loadingCollections: false,
    }),
};

export default function viewCollectionsReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
