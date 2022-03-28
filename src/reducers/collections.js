import * as actions from 'actions/actionTypes';
// import { record } from 'mock/data';

export const initialState = {
    collectionList: [],
    loadingCollections: false,
    loadingCollectionsPid: null,
    loadingCollectionsError: null,
    // totalRecords: 0,
    // startRecord: 0,
    // endRecord: 0,
    currentPage: 1,
    perPage: 10,
    collectionsOpened: [],
    collectionsSelected: [],
    collectionsSelectedParent: null,
};

const handlers = {
    [actions.VIEW_COLLECTIONS_LOADING]: (state, action) => ({
        loadingCollections: true,
        loadingCollectionsPid: action.payload.pid,
        collectionList: state.collectionList,
        collectionsOpened: state.collectionsOpened,
        collectionsSelected: [],
    }),

    [actions.VIEW_COLLECTIONS_LOADED]: (state, action) => {
        const uniqueValues = new Set();
        const collectionList = [action.payload, ...state.collectionList];
        const filteredList = collectionList.filter(obj => {
            const isPresent = uniqueValues.has(obj.parent);
            uniqueValues.add(obj.parent);
            return !isPresent;
        });
        return {
            ...initialState,
            collectionList: [...filteredList],
            loadingCollectionsPid: null,
            loadingCollections: false,
            collectionsOpened: state.collectionsOpened,
        };
    },

    [actions.VIEW_COLLECTIONS_LOAD_FAILED]: (state, action) => ({
        ...initialState,
        loadingCollections: false,
        loadingCollectionsPid: null,
        loadingCollectionsError: action.payload,
        collectionsOpened: state.collectionsOpened,
    }),
    [actions.VIEW_COLLECTIONS_CLEARED]: state => ({
        ...initialState,
        collectionList: [...state.collectionList],
        loadingCollections: false,
        loadingCollectionsPid: null,
        collectionsOpened: [],
    }),
    [actions.SET_COLLECTIONS_ARRAY]: (state, action) => {
        let collectionArray = [...state.collectionsOpened];
        !!action.payload.open
            ? collectionArray.push(action.payload.pid)
            : (collectionArray = collectionArray.filter(item => item !== action.payload.pid));
        return {
            ...state,
            collectionsOpened: collectionArray,
        };
    },
    [actions.SET_COLLECTIONS_SELECTED]: (state, action) => {
        let selectedArray =
            action.payload.selectedParent !== state.collectionsSelectedParent ? [] : [...state.collectionsSelected];
        // action.payload.selectedParent !== state.selectedParent ?
        if (selectedArray.indexOf(action.payload.pid) === -1) {
            selectedArray.push(action.payload.pid);
        } else {
            selectedArray = selectedArray.filter(val => val !== action.payload.pid);
        }
        console.log('SELECTED PARENT IS', action.payload.selectedParent, state.collectionsSelectedParent);
        console.log('SELECTED ARRAY IS', selectedArray);
        return {
            ...state,
            collectionsSelected: selectedArray,
            collectionsSelectedParent: action.payload.selectedParent,
        };
    },
    [actions.SET_ALL_COLLECTIONS_SELECTED]: (state, action) => {
        return {
            ...state,
            collectionsSelected: action.payload.pids,
        };
    },
};

export default function viewCollectionsReducer(state = { ...initialState }, action) {
    const handler = handlers[action.type];
    if (!handler) {
        return state;
    }
    return handler(state, action);
}
