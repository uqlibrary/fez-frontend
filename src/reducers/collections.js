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
    // collectionsSelectedTitles: [],
    collectionsSelectedParent: null,
};

const handlers = {
    [actions.VIEW_COLLECTIONS_LOADING]: (state, action) => ({
        loadingCollections: true,
        loadingCollectionsPid: action.payload.pid,
        collectionList: state.collectionList,
        collectionsOpened: state.collectionsOpened,
        collectionsSelected: [],
        collectionsSelectedParent: null,
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
        // let selectedArray =
        //     action.payload.selectedParent !== state.collectionsSelectedParent ? [] : [...state.collectionsSelected];
        // let selectedTitleArray =
        //     action.payload.selectedParent !== state.collectionsSelectedParent
        //         ? []
        //         : [...state.collectionsSelectedTitles];
        // // action.payload.selectedParent !== state.selectedParent ?
        // if (selectedArray.indexOf(action.payload.pid) === -1) {
        //     selectedArray.push(action.payload.pid);
        //     selectedTitleArray.push(action.payload.title);
        // } else {
        //     selectedArray = selectedArray.filter(val => val !== action.payload.pid);
        //     selectedTitleArray = selectedTitleArray.filter(val => val !== action.payload.title);
        // }
        // console.log('SELECTED PARENT IS', action.payload.selectedParent, state.collectionsSelectedParent);
        // console.log('SELECTED ARRAY IS', selectedArray);
        // console.log('SELECTED TITLE ARRAY IS', selectedTitleArray);
        // return {
        //     ...state,
        //     collectionsSelected: selectedArray,
        //     collectionsSelectedTitles: selectedTitleArray,
        //     collectionsSelectedParent: action.payload.selectedParent,
        // };

        let selectedArray =
            action.payload.selectedParent !== state.collectionsSelectedParent ? [] : [...state.collectionsSelected];
        // console.log(selectedArray.findIndex(object => object.pid === action.payload.pid));
        if (selectedArray.findIndex(object => object.pid === action.payload.pid) >= 0) {
            // console.log('filtering');
            selectedArray = selectedArray.filter(object => object.pid !== action.payload.pid);
        } else {
            // console.log('pushing');
            selectedArray.push({ pid: action.payload.pid, title: action.payload.title });
        }
        // console.log('SELECTED ARRAY', selectedArray);
        return {
            ...state,
            collectionsSelected: selectedArray,
            collectionsSelectedParent: action.payload.selectedParent,
        };
    },
    [actions.SET_ALL_COLLECTIONS_SELECTED]: (state, action) => {
        // console.log('SELECTED TITLE ARRAY (ALL) IS', action.payload.titles);
        return {
            ...state,
            collectionsSelected: action.payload.pids,
            collectionsSelectedParent: action.payload.selectedParent,
            // collectionsSelectedTitles: action.payload.titles,
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
